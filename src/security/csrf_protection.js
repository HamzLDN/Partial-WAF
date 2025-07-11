function render_csrf(html) {
    const token = csrf_gen(100)

    const csrf_data = `\n<input type="hidden" name="csrf" value="${token['token']}" />`;

    const new_csrf_data = insert_csrf(html);
    console.log("++++++++++++++++")
    console.log(new_csrf_data)

    if (new_csrf_data === -1) {
        return [html, -1]
    } else {
        return [html.slice(0, new_csrf_data) + csrf_data + html.slice(new_csrf_data), token]
    }
}

function insert_csrf(html) {
    const form_start = html.indexOf("<form");
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

function purge_csrf_tokens(info) {
    return info['csrf'].filter(value=>!check_expiration(value['EXPR']))
}

function generate_time(minute) {
    return Date.now() + minute * 60 * 1000
}

function check_expiration(timestamp) {
    return Date.now() > timestamp
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
    render_csrf, check_expiration, purge_csrf_tokens
}