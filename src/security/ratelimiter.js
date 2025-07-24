const utility = require("../utils/TokenUtils")

let blocked_ips = []

function check_blocked_ip(ip_data) {
    if (ip_data[0].Blocked && !utility.check_expiration(ip_data[0].Timestamp)) {
        ip_data[0].Blocked = false
        ip_data[0].Timestamp = utility.generate_time(1)
        ip_data[0].Counter = 0
    }
}
function handle_ips(ip, ip_exist, rate_limit, timeout) {
    const counter_exceeded = ip_exist[ip][0].Counter > rate_limit;
    if (counter_exceeded && utility.check_expiration(ip_exist[ip][0].Timestamp)) {
        const requests = ip_exist[ip][0];
        requests.Blocked = true
        requests.Timestamp = utility.generate_time(timeout)
        return true
    } else if (counter_exceeded && !utility.check_expiration(ip_exist[ip][0].Timestamp)){
        const requests = ip_exist[ip][0];
        requests.Counter = 0
        requests.Timestamp = utility.generate_time(1)
    } else  {
        const requests = ip_exist[ip][0];
        requests.Counter = requests.Counter+1
    }
    return false
}


function exceeded_rpm(ip, rate_limit, timeout) { // false means didnt exceed limit
    if (Number.isNaN(rate_limit || timeout)) return false
    const ip_exist = blocked_ips.find(entry => Object.keys(entry)[0] === ip);
    if (!ip_exist) {
        const request = { };
        request.Timestamp = utility.generate_time(1)
        request.Counter = 0
        request.Blocked = false
        blocked_ips.push({ [ip]: [request]});
    } else {
        check_blocked_ip(ip_exist[ip])
        return handle_ips(ip, ip_exist, rate_limit, timeout)
    }
    return false
}

module.exports = {
    exceeded_rpm
}
