const express = require('express')

const router = express.Router()

router.post("/whitelist-ip", (req, res) => {
    const {filtered_ip} = req.body;
    if (req.information['whitelist-ip'].some(x=>filtered_ip===x)) {
      return res.status(200).send("IP ALREADY WHITELISTED")
    }
    else {
      information['whitelist-ip'].push(filtered_ip) 
      return res.status(200).send("IP WHITELISTED SUCCESSFULLY")
    }
  })
  
router.post("/blacklist-ip", (req, res) => {
    const {filtered_ip} = req.body;
    if (req.information['blacklist-ip'].some(x=>filtered_ip===x)) {
        return res.status(200).send("IP ALREADY BLACKLISTED")
    }
    else {
        req.information['blacklist-ip'].push(filtered_ip) 
        return res.status(200).send("IP BLACKLISTED SUCCESSFULLY")
    }
  }
)


module.exports = router;