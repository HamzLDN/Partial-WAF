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

const io = new Server(server); 
var dict = [];
let id = 0
function Partial_MiddleWare(req, res, next) {
    const has_xss = XssDetect.containsXSS([req.method, req.originalUrl, req.params, req.query]);
    console.log("BODY IS", req.body)
    http_log.log_data(req.ip, req.method, req.originalUrl, req.params, req.query, has_xss, dict, id)[0];
    io.emit('network', dict);
    dict = dict
    id+=1;
    next();
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'index.html'));
})

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.emit('network', dict);

});
server.listen(8392, () => {
    console.log('Dashboard server running on http://localhost:8392');
  });
module.exports = Partial_MiddleWare;