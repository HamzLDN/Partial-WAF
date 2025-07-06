const xss = require('xss');

function find_xss_in_strings(info) {
    return info.some(value => {
        if (typeof value !== 'string') return false;
        const cleaned = xss(value);
        console.log(cleaned, value)
        return cleaned !== value;
    });
}

function containsXSS(info) {
    const xss = find_xss_in_strings(info)
    if (xss) return 1
    else return 0
}

module.exports = {
    containsXSS
}