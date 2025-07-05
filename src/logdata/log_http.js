/* we are logging every requests and storing it. 
    I will make it send as an api once i get the web dashboard working */
    
function log_data(ip, method, url, query) { 
    const data_entry = dict.find(data_entry => data_entry.IP === ip);

    const request = { Method:method,Url: url, Query: query};
    if (!data_entry) {
        data_entry.Requests.push(request);
    } else {
        dict.push({ IP: ip,Requests: [request]});
    }
}