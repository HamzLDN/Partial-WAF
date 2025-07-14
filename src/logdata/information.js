class DashboardData {
    constructor() {
        this.info = {
            'dict': [],
            'blacklist-ip': [],
            'whitelist-ip': ['127.0.0.1', '::1'],
            'csrf': [],
            'settings' : []
          }          
    }

    get(key) {
        return this.info[key]
    }

    set(key, value) {
        this.data[key] = value;
    }
}
module.exports = new DashboardData();