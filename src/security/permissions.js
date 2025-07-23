const express = require('express')
const settings = require('../logdata/information')
const information = settings.info
const router = express.Router()

router.post("/whitelist-ip", (req, res) => {
    const {filtered_ip} = req.body;
    if (information.whitelist_ip.some(x=>filtered_ip===x)) {
      return res.status(200).send("IP ALREADY WHITELISTED")
    }
    else {
      information.whitelist_ip.push(filtered_ip) 
      return res.status(200).send("IP WHITELISTED SUCCESSFULLY")
    }
  })
  
router.post("/blacklist-ip", (req, res) => {
  
    const {filtered_ip} = req.body;
    if (information.blacklist_ip.some(x=>filtered_ip===x)) {
        return res.status(200).send("IP ALREADY BLACKLISTED")
    }
    else {
        information.blacklist_ip.push(filtered_ip) 
        return res.status(200).send("IP BLACKLISTED SUCCESSFULLY")
    }
  }
)


module.exports = router;