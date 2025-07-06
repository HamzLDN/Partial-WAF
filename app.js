const express = require('express')
const partial_middleware = require('./src/middleware/http_traffic')
const app = express()
const args = process.argv.slice(2);
const [host, port] = [args[0], args[1]];
/Users/hamzachennou/Documents/GitHub/Partial-Protect/src/middleware/http_traffic
app.use(partial_middleware)


app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, host, () => {
    console.log(`LISTENING ON -> http://${host}:${port}`);
});

