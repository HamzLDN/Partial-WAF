const express = require('express')
const app = express()
const args = process.argv.slice(2);
const [host, port] = [args[0], args[1]];

app.listen(port, () => {
    console.log(`LISTENING ON -> http://${host}:${port}`);
});