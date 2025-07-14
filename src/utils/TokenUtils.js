function generate_token(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=-+/';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token
}

function generate_time(minute) {
    return Date.now() + minute * 60 * 1000
}

function check_expiration(timestamp) {
    return Date.now() < timestamp

}
export default {
    generate_token,
    generate_time,
    check_expiration
}