function add_csrf_token(html_content) {
    const csrf_session  = csrf_gen(30)
    
}



function csrf_gen(token_length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=-+/';
    let token = '';
    for (let i = 0; i < token_length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return {"token": token, "expiration": Date.now() + 30 * 60 * 1000}
}