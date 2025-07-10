const http_log = require('../logdata/log_http')
const csrf = require("../security/csrf_protection")
const XssDetect = require('./xssdetect')
const http = require('http');
const express = require('express')
const fetch = require('node-fetch');
const path = require('path');
const app = express()
console.log( path.join(__dirname, '../assets'))
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
  'csrf': []
}

function handle_csrf_layer(req, res) {
  const originalSend = res.send;
  res.send = function (body) {
    console.log("CSRF")
    if (typeof body === 'string' && body.includes('<html')) {
      const params = csrf.render_csrf(body)
      body = params[0]

      if (params[1] !== -1) {
        information['csrf'].push({IP : req.ip, CSRF_TOKEN: params[1]['token'], EXPR: params[1]['expiration']})
      }
      console.log(information)
    }
    return originalSend.call(this, body);
  };
}

function Partial_MiddleWare(req, res, next) {
    if (req.method === "POST") {
      try {
        console.log("FOUND CSRF TOKEN -> ")
        const is_valid = information['csrf'].some(x=>x['IP'] === req.ip && x['CSRF_TOKEN']===req.body['csrf'] && csrf.check_expiration(x['EXPR']))
        if (!is_valid) {
          console.log("CSRF_ID INCORRECT")
          return res.status(401).send("CSRF_ID IS INCORRECT")
        }
      } catch (err){
        return res.status(401).send("INTERNAL SERVER ERROR")
      }
    }
    
    handle_csrf_layer(req, res)
    const has_xss = XssDetect.containsXSS([req.method, req.originalUrl, JSON.stringify(req.headers)]);
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