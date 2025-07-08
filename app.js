const express = require('express')
const partial_middleware = require('partial-protect')
const app = express()
const args = process.argv.slice(2);
const [host, port] = [args[0], args[1]];

app.use(partial_middleware)


app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, host, () => {
    console.log(`LISTENING ON -> http://${host}:${port}`);
});

