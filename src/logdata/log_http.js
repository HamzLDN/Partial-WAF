/* we are logging every requests and storing it. 
I will make it send as an api once i get the web dashboard working */
const fs = require('fs');
const path = require('path');

function log_data(ip, method, url, params, query, xss_detect, dict, id) {
    console.log(ip, method, url, params, query);
    /* this code below ip_exists checks the first index in the list and matches each ip. 
    it will eventually make the code slow. I tried looking for better solutions like avoid duplication. 
    this is the best i can do unless someone can help me out. This wouldnt affect the client side */
    const ip_exist = dict.find(entry => Object.keys(entry)[0] === ip); 

    const request = { Id : id, Method: [method], Url: [url], Parameter: [params], Query: [query], ContainsXSS: [xss_detect]};
    if (ip_exist) {
        const requests = ip_exist[ip][0];
        requests.ContainsXSS.push(xss_detect)
        requests.Url.push(url)
        requests.Method.push(method)
        requests.Parameter.push(params)
        requests.Query.push(query)
    }
    else {
        dict.push({ [ip]: [request] });
    }
    // for now i will add to a file.
    const filePath = path.join(__dirname, 'log_data.json');
    const append_to_json = JSON.stringify(dict, null, 2)
    fs.writeFile(filePath, append_to_json, (err) => {
    if (err) {
        console.error('error in writing to file', err);
    } else {
        console.log('data has been written in the file');
    }
    });
    return dict;
}
    
module.exports = {
    log_data
}