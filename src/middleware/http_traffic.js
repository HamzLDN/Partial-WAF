
class Partial_MiddleWare {
    handler(req, res, next) {
        app.use((req, res, next) => {
            console.log(req.ip);
            console.log(req.method)
            console.log(req.originalUrl)
            console.log(req.params)
            console.log(req.query)
            next()
        })              
    }
}