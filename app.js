// THIS FILE IS JUST A DEMO ON HOW TO USE THE MIDDLEWARE!!!

const express = require('express')
const partial_middleware = require('./src/middleware/http_traffic')
const app = express()
const args = process.argv.slice(2);
let [host, port] = [args[0], args[1]];

if (!host || !port) {
    host = 'localhost'
    port = 3000
    console.log("USING DEFAULT HOST AND PORT");
}
app.use(express.urlencoded({ extended: true }));

app.use(partial_middleware)

// Uncomment the following lines to see an example
app.get("/", (req, res) => {
    res.send(`
        <h1> THIS IS AN EXAMPLE FORM </h1>
<form id="simpleForm" action="/login" method="POST">
  <label for="name">Name:</label><br />
  <input type="text" id="name" name="name" required /><br /><br />

  <label for="email">Email:</label><br />
  <input type="email" id="email" name="email" required /><br /><br />

  <button type="submit">Submit</button>
</form>
`);
});

app.listen(port, host, () => {
    console.log(`LISTENING ON -> http://${host}:${port}`);
});

