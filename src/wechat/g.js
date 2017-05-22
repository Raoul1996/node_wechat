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
  return (
    async (ctx, next) => {
      let that = this
      const token = opts.token
      const signature = ctx.query.signature
      const nonce = ctx.query.nonce
      const timestamp = ctx.query.timestamp
      const echostr = ctx.query.echostr
      /**
       * 根据微信开发者文档显示，有必要在本地设置signature的检测。
       */
      const str = [token, timestamp, nonce].sort().join('')
      const sha = sha1(str)
      try {
        if (ctx.method === 'GET') {
          if (sha === signature) {
            console.log(sha)
            ctx.body = echostr + ''
            console.log('successful')
          } else {
            ctx.body = 'err'
            console.log(' test err')
          }
        } else if (ctx.method === 'POST') {
          if (sha !== signature) {
            ctx.body = 'wrong'
            return false
          }
          let data = await getRowBody(ctx.req, {
            length: ctx.length,
            limit: '1mb',
            encoding: ctx.charset
          })
          let content = await util.parseXMLAsync(data)
          let message = await util.formatMessage(content.xml)
          console.log(message)
          if (message.MsgType === 'event') {
            if (message.Event === 'subscribe') {
              let now = new Date().getTime()
              ctx.status = 200
              ctx.type = 'application/xml'
              let reply =
                `<xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${now}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[Thanks for your subscribe! this is the test msg]]></Content>
                </xml>`
              console.log(reply)
              ctx.body = reply
            }
          }
          if (message.MsgType === 'text') {
            let now = new Date().getTime()
            ctx.status = 200
            ctx.type = 'application/xml'
            let reply =
              `<xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${now}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[该功能未开发完毕]]></Content>
                </xml>`
            console.log(reply)
            ctx.body = reply
          }
        }
      } catch (err) {
        ctx.body = {message: err.message}
        ctx.status = err.status || 500
      }
    }
  )
}
//