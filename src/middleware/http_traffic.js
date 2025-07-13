const http_log = require('../logdata/log_http')
const csrf = require("../security/csrf_protection")
const ratelimit = require("../security/ratelimiter")
const XssDetect = require('./xssdetect')
const http = require('http');
const express = require('express')
const path = require('path');
const app = express()

app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));


const { Server } = require('socket.io');
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
const io = new Server(server); 
var dict = [];
var information = {
  'blacklist-ip': [],
  'whitelist-ip': [],
  'csrf': [],
  'settings' : {
  }
}

function csrf_layer(req, res) {
  if (req.method === "GET")  csrf.handle_csrf_layer(req, res, information)
    if (req.method === "POST") {
      const valid_csrf = csrf.validate_csrf(req, res, information)
      if (valid_csrf === 401) return res.status(401).send("UNAUTHROIZED CSRF")
      else if (valid_csrf === 500) return res.status(500).send("INTERNAL SERVER ERROR")
    }
}
function Partial_MiddleWare(req, res, next) {
    const values = information['settings']
    console.log(values['freeze_site'])
    if (values['freeze_site'] === 1) return res.status(503).send("SERVER IS TEMPORARILY DOWN")
    if (ratelimit.exceeded_rpm(req.ip, parseInt(values['rate-limit']), parseInt(values['timeout']))) {
      return res.status(403).send("IP IS TEMPORARILY BLOCKED")
    } else {
      console.log("RATE LIMIT IS NOT IN USE. TOGGLE IT ON SETTINGS")
    }
    csrf_layer(req, res)
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
      JSON.stringify(new_headers), 
      XssDetect.containsXSS(
        [
          JSON.stringify(req.originalUrl), 
          JSON.stringify(req.headers)
        ]), 
      dict)[0];
    io.emit('network', dict);
    next();
}

app.get("/", (req, res) => {

    res.render('index', information['settings']);
})

app.post("/whitelist-ip", (req, res) => {
  const {filtered_ip} = req.body;
  if (information['whitelist-ip'].some(x=>filtered_ip===x)) {
    return res.status(200).send("IP ALREADY WHITELISTED")
  }
  else {
    information['whitelist-ip'].push(filtered_ip) 
    return res.status(200).send("IP WHITELISTED SUCCESSFULLY")
  }
})

app.post("/settings", (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof(value)==="object") {
      information['settings'][key] = 1
    } else {
      information['settings'][key] = value
    }
    
  }
  return res.redirect("/")
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