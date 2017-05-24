
const util = require('../libs/util')
const path = require('path')
const wechat_file = path.join(__dirname,'../config/wechat_file.txt')
const config = {
  weChat: {
    appID: 'wxb250d9904e5fec3d',
    appSecret: '647e6c68f0c5f48803ba4c72b496311c',
    token: 'qwertyuiopraoul12345',
    getAccessToken() {
      return util.readFileSync(wechat_file)
    },
    saveAccessToken(data){
      data = JSON.stringify(data)
      return util.writeFileSync(wechat_file,data)
    }
  }
}
module.exports = config