const http_log = require('../logdata/log_http')
const XssDetect = require('./xssdetect')
const express = require('express')
const app = express()

function Partial_MiddleWare(req, res, next) {
    console.log(req.ip);
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.params);
    console.log(req.query);
    const has_xss = XssDetect.containsXSS([req.method, req.originalUrl, req.params, req.query])
    http_log.log_data(req.ip, req.method, req.originalUrl, req.params, req.query, has_xss)
    next();    
}
app.listen(8392, () => {
    console.log('Dashboard server running on http://localhost:8392');
  });
module.exports = Partial_MiddleWare;