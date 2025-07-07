const http_log = require('../logdata/log_http')
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
let id = 0
var whitelisted_ip = []
function Partial_MiddleWare(req, res, next) {
    const has_xss = XssDetect.containsXSS([req.method, req.originalUrl, JSON.stringify(req.headers)]);
    const new_headers = { ...req.headers };

    if (new_headers && 'cookie' in new_headers) {
        delete new_headers.cookie;
        console.log('Deleted cookies')
      }
    http_log.log_data(req.ip, req.method, req.originalUrl, JSON.stringify(new_headers), has_xss, dict, id)[0];
    io.emit('network', dict);
    id+=1;
    next();
}

app.get("/", (req, res) => {
    if (req.some(x => x==req.ip)) {

    }
    res.sendFile(path.join(__dirname, '../../views', 'index.html'));
})

app.post("/whitelist-ip", (req, res) => {
  const {filtered_ip} = req.body;
  if (whitelisted_ip.some(x=>filtered_ip[0]===x)) {
    return res.status(200).send("IP ALREADY WHITELISTED")
  }
  else {
    whitelisted_ip.push(filtered_ip[0])
    return res.status(200).send("IP HAS BEEN WHITELISTED")
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