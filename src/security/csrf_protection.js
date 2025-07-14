import utility from "../utils/TokenUtils.js";
function render_csrf(html) {
    const find_forms = find_multiple_index(html, "<form");
    if (find_forms.length === 0) {
        return [html, -1]
    }
    let new_csrf_data = html;
    let offset = 0;
    const token = {"token": utility.generate_token(100), "expiration": utility.generate_time(30)}
    for (let x = 0; x < find_forms.length; x++) { // adds csrf for multiple form
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
      if (typeof body === 'string' && body.includes('<html')) {
        const params = render_csrf(body)
        body = params[0]
  
        if (params[1] !== -1) {
          information['csrf'].push({IP : req.ip, CSRF_TOKEN: params[1]['token'], EXPR: params[1]['expiration']})
        }
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
        const is_valid = information['csrf'].some(x=>x['IP'] === req.ip && x['CSRF_TOKEN'] === req.body['csrf'] && utility.check_expiration(x['EXPR']))
        if (!is_valid) {
        console.log("CSRF_ID INCORRECT")
        return 401
        }
    } catch (err){
        console.log(err)
        return 500
    }
}



function purge_csrf() {
}
export default {
    render_csrf, 
    handle_csrf_layer,
    validate_csrf
}