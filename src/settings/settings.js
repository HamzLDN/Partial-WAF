const express = require("express");
const settings = require('../logdata/information')
const router = express.Router()
const information = settings.info

router.post("/", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof(value)==="object") {
        information.settings[key] = 1
        } else {
        information.settings[key] = value
        }
    }
    return res.redirect("/")
})
router.get('/download-logs', (_, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="report.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(information.dict, null, 2)); 
  });

module.exports = router;