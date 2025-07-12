const http_log = require('../logdata/log_http')
const csrf = require("../security/csrf_protection")
const ratelimit = require("../security/ratelimiter")
const XssDetect = require('./xssdetect')
const http = require('http');
const express = require('express')
const path = require('path');
const app = express()

app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const { Server } = require('socket.io');
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
const io = new Server(server); 
var dict = [];
var information = {
  'blacklist-ip': [],
  'whitelist-ip': [],
  'csrf': [],
  'rate_limit': 60,
  'timeout': 5
}

function Partial_MiddleWare(req, res, next) {
    if (ratelimit.exceeded_rpm(req.ip, information['rate_limit'], information['timeout'])) return res.status(403).send("IP IS TEMPORARILY BLOCKED")
    if (req.method === "GET")  csrf.handle_csrf_layer(req, res, information)
    if (req.originalUrl === "/login") {
      const valid_csrf = csrf.validate_csrf(req, res, information)
      if (valid_csrf === 401) return res.status(401).send("UNAUTHROIZED CSRF")
      else if (valid_csrf === 500) return res.status(500).send("INTERNAL SERVER ERROR")
    }

    const new_headers = { ...req.headers };
    if (information['blacklist-ip'].some(x => x===req.ip))  return res.status(401).send("Unauthorized Access. Your IP is probably blocked")
    if (new_headers && 'cookie' in new_headers) {
        delete new_headers.cookie;
        console.log('Deleted cookies')
    }

    http_log.log_data(
      req.ip,
      req.method, 
      req.originalUrl, 
      JSON.stringify(new_headers), XssDetect.containsXSS([req.method, JSON.stringify(req.originalUrl), JSON.stringify(req.headers)]), 
      dict)[0];
    io.emit('network', dict);
    next();
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'index.html'));
})

app.post("/whitelist-ip", (req, res) => {
  const {filtered_ip} = req.body;
  if (information['whitelist-ip'].some(x=>filtered_ip===x)) {
    return res.status(200).send("IP ALREADY WHITELISTED")
  }
  else {
    information[index].push(filtered_ip) 
    return res.status(200).send("IP WHITELISTED SUCCESSFULLY")
  }
})

app.post("/blacklist-ip", (req, res) => {
  const {filtered_ip} = req.body;
  if (information['blacklist-ip'].some(x=>filtered_ip===x)) {
    return res.status(200).send("IP ALREADY BLACKLISTED")
  }
  else {
    information['blacklist-ip'].push(filtered_ip) 
    return res.status(200).send("IP BLACKLISTED SUCCESSFULLY")
  }

})

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('network', dict);
});

server.listen(278, () => {
  console.log('Dashboard server running on http://localhost:278');
});
module.exports = Partial_MiddleWare;