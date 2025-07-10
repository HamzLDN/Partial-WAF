function render_csrf(html_content) {
    const csrf_session  = csrf_gen(30)
    
    const index = html_content.indexOf("<head>")
    const before_head = html_content.slice(0, index);
    const after_head = html_content.slice(index);
    
    return `${before_head}csrf-token="+${csrf_session['token']}"${after_head}`// i put the token in between the head
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