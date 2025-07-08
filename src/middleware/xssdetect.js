const xss = require('xss');

function containsXSS(info) {
    return info.some(value => {
        if (typeof value !== 'string') return false;
        const cleaned = xss(value);
        return cleaned !== value;
    });
}

module.exports = {
    containsXSS
}