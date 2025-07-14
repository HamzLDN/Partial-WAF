/* we are logging every requests and storing it. 
I will make it send as an api once i get the web dashboard working */
const settings = require("../logdata/information")
const information = settings.info

function log_data(ip, method, url, header, xss_detect) {
    /* this code below ip_exists checks the first index in the list and matches each ip. 
    it will eventually make the code slow. I tried looking for better solutions like avoid duplication. 
    this is the best i can do unless someone can help me out. This wouldnt affect the client side */
    const ip_exist = information.dict.find(entry => Object.keys(entry)[0] === ip); 

    
    if (ip_exist) {
        const requests = ip_exist[ip][0];
        requests.ContainsXSS.push(xss_detect)
        requests.Url.push(url)
        requests.Method.push(method)
        requests.Header.push(header)
    }
    else {
        const request = { Method: [method], Url: [url], Header: [header], ContainsXSS: [xss_detect]};
        information.dict.push({ [ip]: [request]});
    }
    
    return information.dict;
}
    
module.exports = {
    log_data
}