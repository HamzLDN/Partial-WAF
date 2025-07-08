/* we are logging every requests and storing it. 
I will make it send as an api once i get the web dashboard working */
const fs = require('fs');
const path = require('path');
let count = 0;
function refresh_logs(dict, size, count) {
    /// 300 > 20
    if (count > dict.length) {
        delete dict[count]
        return dict
        // 5 5
    }
    return dict
}
function log_data(ip, method, url, header, xss_detect, dictionary_values) {
    const dict = refresh_logs(dictionary_values, count)

    /* this code below ip_exists checks the first index in the list and matches each ip. 
    it will eventually make the code slow. I tried looking for better solutions like avoid duplication. 
    this is the best i can do unless someone can help me out. This wouldnt affect the client side */
    const ip_exist = dict.find(entry => Object.keys(entry)[0] === ip); 

    const request = { Method: [method], Url: [url], Header: [header], ContainsXSS: [xss_detect]};
    if (ip_exist) {
        const requests = ip_exist[ip][0];
        requests.ContainsXSS.push(xss_detect)
        requests.Url.push(url)
        requests.Method.push(method)
        requests.Header.push(header)
    }
    else {
        dict.push({ [ip]: [request] });
        count++;
    }
    return dict;
}
    
module.exports = {
    log_data
}