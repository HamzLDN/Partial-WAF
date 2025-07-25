const express = require('express')
const settings = require('../logdata/information')
const information = settings.info
const router = express.Router()

router.post("/whitelist-ip", (req, res) => {
    const {filtered_ip} = req.body;
    if (information.whitelist_ip.some(x=>filtered_ip===x)) {
      return res.redirect("/?success=IP_ALREADY_WHITELISTED")
    }
    else {
      information.whitelist_ip.push(filtered_ip) 
      return res.redirect("/?success=IP_WHITELISTED_SUCCESSFULLY")
    }
  })
  
router.post("/blacklist-ip", (req, res) => {
  
    const {filtered_ip} = req.body;
    if (information.blacklist_ip.some(x=>filtered_ip===x)) {
        return res.redirect("/?success=IP_ALREADY_BLACKLISTED")
    }
    else {
        information.blacklist_ip.push(filtered_ip) 
        return res.redirect("/?success=IP_BLACKLISTED_SUCCESSFULLY")
    }
  }
)


module.exports = router;