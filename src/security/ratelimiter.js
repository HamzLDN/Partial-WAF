const utility = require("../utils/TokenUtils")

let blocked_ips = []

function check_blocked_ip(ip_data) {
    if (ip_data[0].Blocked && !utility.check_expiration(ip_data.Timestamp)) {
        return true
    }
    return false
}
function exceeded_rpm(ip, rate_limit, timeout) { // false means didnt exceed limit

    const ip_exist = blocked_ips.find(entry => Object.keys(entry)[0] === ip);
    console.log(ip_exist)
    if (ip_exist) {
        if (check_blocked_ip(ip_exist[ip])) blocked_ips = blocked_ips.filter(x => x !== ip);
        const counter_exceeded = ip_exist[ip][0].Counter > rate_limit;
        if (counter_exceeded && utility.check_expiration(ip_exist[ip][0].Timestamp)) {
            const requests = ip_exist[ip][0];
            requests.Blocked = true
            requests.Timestamp = utility.generate_time(timeout)
            return true
        } else {
            const requests = ip_exist[ip][0];
            requests.Counter = requests.Counter+1
        }
    } else {
        const request = { };
        request['Timestamp'] = utility.generate_time(1)
        request['Counter'] = 0
        request['Blocked'] = false
        blocked_ips.push({ [ip]: [request]});
    }
    // try {
    //     console.log(ip_exist[ip][0])
    // } catch{

    // }
    return false
}

module.exports = {
    exceeded_rpm
}