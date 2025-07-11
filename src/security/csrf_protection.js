function render_csrf(html) {


    const find_forms = find_multiple_index(html, "<form");
    if (find_forms.length === 0) {
        return [html, -1]
    }
    let new_csrf_data = html;
    let offset = 0;

    for (let x = 0; x < find_forms.length; x++) { // adds csrf for multiple form
        const token = csrf_gen(100)
        const csrf_data = `\n<input type="hidden" name="csrf" value="${token['token']}" />`;
        let insert_index = insert_csrf(html, find_forms[x]);
        if (insert_index === -1) continue;
    
        insert_index += offset;
    
        new_csrf_data =  new_csrf_data.slice(0, insert_index) +  csrf_data +  new_csrf_data.slice(insert_index);
    
        offset += csrf_data.length;
    }
    return [new_csrf_data, token];
    
}

function insert_csrf(html, form_start) {
    if (form_start === -1) return -1;
    let in_string = false;
    let quoteChar = null;

    for (let i = form_start; i < html.length; i++) {
        const char = html[i];

        if ((char === '"' || char === "'" || char === '`')) {
            if (!in_string) {
                in_string = true;
                quoteChar = char;
            } else if (char === quoteChar) {
                in_string = false;
                quoteChar = null;
            }
        }
        if (char === '>' && !in_string) {
            return i + 1;
        }
    }
    return -1;
}

function handle_csrf_layer(req, res, information) {
    const originalSend = res.send;
    res.send = function (body) {
      console.log("CSRF")
      if (typeof body === 'string' && body.includes('<html')) {
        const params = render_csrf(body)
        body = params[0]
  
        if (params[1] !== -1) {
          information['csrf'].push({IP : req.ip, CSRF_TOKEN: params[1]['token'], EXPR: params[1]['expiration']})
        }
        console.log(information)
      }
      return originalSend.call(this, body);
    };
}

function find_multiple_index(html, string) {
    let values = []
    let find_str = ""
    let counter = 0
    for (let i = 0; i < html.length;i++) {
        if (html[i] === string[counter]) {
            find_str += html[i]
            counter++;
        } else {
            counter = 0
            find_str=""
        }
        if (find_str === string) {
            values.push(i-string.length+1)
        }
    }
    return values;
}

function validate_csrf(req, res, information) {
    try {
        const is_valid = information['csrf'].some(x=>x['IP'] === req.ip && x['CSRF_TOKEN'] === req.body['csrf'] && check_expiration(x['EXPR']))
        if (!is_valid) {
        console.log("CSRF_ID INCORRECT")
        return res.status(401).send("CSRF_ID IS INCORRECT")
        }
    } catch (err){
        console.log(err)
        return res.status(50).send("INTERNAL SERVER ERROR")
    }
}

function generate_time(minute) {
    return Date.now() + minute * 60 * 1000
}

function check_expiration(timestamp) {
    return Date.now() < timestamp
}

function purge_csrf() {

}

function csrf_gen(token_length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=-+/';
    let token = '';
    for (let i = 0; i < token_length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return {"token": token, "expiration": generate_time(30)}
}
module.exports = {
    render_csrf, 
    check_expiration, 
    handle_csrf_layer,
    validate_csrf
}