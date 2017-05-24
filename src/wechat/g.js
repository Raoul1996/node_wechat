/**
 * 由于使用的 ngrok 代理工具不稳定，所以需要及时替换测试号的链接
 * @url: https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
 * 进行接口信息的配置与修改。
 * @password: wechatdev1
 */
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const getRowBody = require('raw-body')
const sha1 = require('sha1')
const util = require('./util')
const weChatGetAccessToken = require('./wechat')
module.exports = function (opts) {
  let wechat = new weChatGetAccessToken(opts)
  return function* (next) {
      let that = this
      const token = opts.token
      const signature = this.query.signature
      const nonce = this.query.nonce
      const timestamp = this.query.timestamp
      const echostr = this.query.echostr
      /**
       * 根据微信开发者文档显示，有必要在本地设置signature的检测。
       */
      const str = [token, timestamp, nonce].sort().join('')
      const sha = sha1(str)
      if (this.method === 'GET') {
        if (sha === signature) {
          console.log(sha)
          this.body = echostr + ''
          console.log('successful')
        } else {
          this.body = 'err'
          console.log(' test err')
        }
      } else if (this.method === 'POST') {
        if (sha !== signature) {
          this.body = 'wrong'
          return false
        }
        let data = yield getRowBody(this.req, {
          length: this.length,
          limit: '1mb',
          encoding: this.charset
        })
        let content = yield util.parseXMLAsync(data)
        let message = yield util.formatMessage(content.xml)
        console.log(message)
        console.log('dengdaizhixing')
        this.weixin = message
        yield handler.call(this,next)
        wechat.reply.call(this)
        /* if (message.MsgType === 'event') {
         if (message.Event === 'subscribe') {
         let now = new Date().getTime()
         this.status = 200
         this.type = 'application/xml'
         let reply =
         `<xml>
         <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
         <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
         <CreateTime>${now}</CreateTime>
         <MsgType><![CDATA[text]]></MsgType>
         <Content><![CDATA[Thanks for your subscribe! this is the test msg]]></Content>
         </xml>`
         console.log(reply)
         this.body = reply
         }
         }
         if (message.MsgType === 'text') {
         let now = new Date().getTime()
         this.status = 200
         this.type = 'application/xml'
         this.body = xml

         }*/
      }
    }

}