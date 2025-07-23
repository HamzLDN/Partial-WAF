class DashboardData {
    constructor() {
        this.info = {
            dict: [],
            blacklist_ip: [],
            whitelist_ip: ['127.0.0.1', '::1'],
            csrf: [],
            settings : []
          }
    }

}
module.exports = new DashboardData();