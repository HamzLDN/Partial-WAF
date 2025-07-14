class DashboardData {
    constructor() {
        this.info = {
            'dict': [],
            'blacklist-ip': [],
            'whitelist-ip': ['127.0.0.1', '::1'],
            'csrf': [],
            'settings' : ['test']
          }          
    }

}
module.exports = new DashboardData();