/* we are logging every requests and storing it. 
I will make it send as an api once i get the web dashboard working */
const fs = require('fs');
const path = require('path');

const dict = [];

function findMatchingRequest(r, method, url, params, query) {
    return (
    r.Method === method &&
    r.Url === url &&
    JSON.stringify(r.Parameter) === JSON.stringify(params) &&
    JSON.stringify(r.Query) === JSON.stringify(query)
    );
}

function log_data(ip, method, url, params, query) {
    console.log(ip, method, url, params, query);
    /* this code below ip_exists checks the first index in the list and matches each ip. 
    it will eventually make the code slow. I tried looking for better solutions like avoid duplication. 
    this is the best i can do unless someone can help me out. This wouldnt affect the client side */
    const ip_exist = dict.find(entry => Object.keys(entry)[0] === ip); 
    const request = { Method: method, Url: url, Parameter: params, Query: query, Counter: 1 };

    if (ip_exist) {
    const requests = ip_exist[ip];
    const existingRequest = requests.find(r =>
        findMatchingRequest(r, method, url, params, query)
    );
    if (existingRequest) {
        existingRequest.Counter += 1;
    } else {
        requests.push(request);
    }
    } else {
    dict.push({ [ip]: [request] });
    }
    // for now i will add to a file.
    const filePath = path.join(__dirname, 'log_data.json');
    fs.writeFile(filePath, JSON.stringify(dict, null, 2), (err) => {
    if (err) {
        console.error('error in writing to file', err);
    } else {
        console.log('data has been written in the file');
    }
    });
}
    
module.exports = {
    log_data
}