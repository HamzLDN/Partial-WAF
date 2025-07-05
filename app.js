const express = require('express')
const app = express()
const args = process.argv.slice(2);
const [host, port] = [args[0], args[1]];
console.log(host, port)
app.use((req, res, next) => {
    console.log(req.ip);
    console.log(req.method)
    console.log(req.originalUrl)
    console.log(req.params)
    console.log(req.query)
    next()
})

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, host, () => {
    console.log(`LISTENING ON -> http://${host}:${port}`);
});