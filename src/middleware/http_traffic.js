const http_log = require('../logdata/log_http')
const csrf = require("../security/csrf_protection")
const ratelimit = require("../security/ratelimiter")
const XssDetect = require('./xssdetect')
const http = require('http');
const permissions = require('../security/permissions')
const userSettings = require('../settings/settings')
const express = require('express')
const path = require('path');
const app = express()
const settings = require('../logdata/information')

app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));
app.use(express.json());


const { Server } = require('socket.io');
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use("/permissions", permissions)
app.use("/settings", userSettings)

const io = new Server(server); 
const information = settings.info


function Partial_MiddleWare(req, res, next) {
  if (information.settings.freeze_site === 1) {
    return res.status(503).send("SERVER IS TEMPORARILY DOWN")
  }
  if (ratelimit.exceeded_rpm(
    req.ip,
    parseInt(information.settings.ratelimit),
    parseInt(information.settings.timeout))) {
    return res.status(403).send("IP IS TEMPORARILY BLOCKED")
  }

  csrf.handle_csrf_layer(req, res, information);
  
  if (information.blacklist_ip.some(x => x===req.ip))  {
    return res.status(401).send("Unauthorized Access. Your IP is probably blocked")
  }
    
  
  const new_headers = { ...req.headers };
  if (new_headers && 'cookie' in new_headers) {
      delete new_headers.cookie;
      console.log('Deleted cookies')
  }

  const xss = XssDetect.containsXSS(
    [JSON.stringify(req.originalUrl), 
      JSON.stringify(req.headers), 
      JSON.stringify(req.body)]
    );
    
  http_log.log_data(
    req.ip,
    req.method, 
    req.originalUrl, 
    JSON.stringify(new_headers),
    xss)[0];

  io.emit('network', information.dict);

  if (information.settings.block_xss === 1 && xss) {
    return res.status(403).send("XSS IS FORBIDDEN! WE HAVE FLAGGED IP ADDRESS")
  }
    
  next();
}

app.get("/", (req, res) => {
  if (information.whitelist_ip.some(x=>req.ip===x)) {
    res.render('index', information.settings);
  } 
})

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('network', information.dict);
});

server.listen(278, () => {
  console.log('Dashboard server running on http://localhost:278');
});

module.exports = Partial_MiddleWare;