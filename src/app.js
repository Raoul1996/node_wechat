
/**
 * 由于使用的 ngrok 代理工具不稳定，所以需要及时替换测试号的链接
 * @url: https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
 * 进行接口信息的配置与修改。
 * @password: wechatdev1
 */

const Koa = require('koa')
const path = require('path')
const weChat = require('./wechat/g')
const wechat_file = path.join(__dirname,'../config/wechat_file.txt')
const config  = require('./config')
const weiXinAutoReply = require('./reply')
let app = new Koa()
app.use(weChat(config.weChat,weiXinAutoReply.reply))
app.listen(2333)
console.log('Listing:2333')