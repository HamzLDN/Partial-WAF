const http_log = require('../logdata/log_http')

function Partial_MiddleWare(req, res, next) {
    console.log(req.ip);
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.params);
    console.log(req.query);
    http_log.log_data(req.ip, req.method, req.originalUrl, req.params, req.query)
    next();    
}
module.exports = Partial_MiddleWare;