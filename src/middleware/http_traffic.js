const http_log = require('../logdata/log_http')
const csrf = require("../security/csrf_protection")
const XssDetect = require('./xssdetect')
const http = require('http');
const express = require('express')
const path = require('path');
const app = express()
console.log( path.join(__dirname, '../assets'))
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const { Server } = require('socket.io');
const { info } = require('console');
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
const io = new Server(server); 
var dict = [];
var information = {
  'blacklist-ip': [],
  'whitelist-ip': [],
  'csrf': []
}

function Partial_MiddleWare(req, res, next) {
    console.log(res.send.length)
    if (req.method === "GET") {
      csrf.handle_csrf_layer(req, res, information)
    
    } 
    if (req.originalUrl === "/login") {
      if (csrf.validate_csrf(req, res, information) === 401) return res.status(401).send("UNAUTHROIZED CSRF")
      else if (csrf.validate_csrf(req, res, information) === 500) return res.status(500).send("INTERNAL SERVER ERROR")
    }
    
    const has_xss = XssDetect.containsXSS([req.method, JSON.stringify(req.originalUrl), JSON.stringify(req.headers)]);
    const new_headers = { ...req.headers };
    if (information['blacklist-ip'].some(x => x===req.ip)) {
      return res.status(401).send("Unauthorized Access. Your IP is probably blocked")
    }
    if (new_headers && 'cookie' in new_headers) {
        delete new_headers.cookie;
        console.log('Deleted cookies')
    }
    http_log.log_data(req.ip, req.method, req.originalUrl, JSON.stringify(new_headers), has_xss, dict)[0];
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