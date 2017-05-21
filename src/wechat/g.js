'use strict'
/**
 * 由于使用的 ngrok 代理工具不稳定，所以需要及时替换测试号的链接
 * @url: https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
 * 进行接口信息的配置与修改。
 * @password: wechatdev1
 */
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const sha1 = require('sha1')
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
  accessToken: `${prefix}token?grant_type=client_credential`
}
function weChatGetAccessToken (opts) {
  let that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  this.getAccessToken()
    .then(data => {
        try {
          data = JSON.parse(data)
        } catch (e) {
          return that.updateAccessToken(data)
        }
        if (that.isValidAccessToken(data)) {
          Promise.resolve(data)
        } else {
          return that.updateAccessToken()
        }
      }
    ).then(data => {
    that.access_token = data.access_token
    that.expires_in = data.expires_in
    that.saveAccessToken(data)
  })
}
weChatGetAccessToken.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) return false
  let access_token = data.access_token
  let expires_in = data.expires_in
  let now = (new Date().getTime())
  return (now < expires_in)
}
weChatGetAccessToken.prototype.updateAccessToken = function () {
  let appID = this.appID
  let appSecert = this.appSecret
  let url = `${api.accessToken}&appid=${appID}&secret=${appSecert}`
  console.log(url)
  return new Promise((resolve, reject) => {
    request({
      url: url,
      json: true
    }).then(res => {
      console.log(res.body)
      let data = res.body
      let now = (new Date().getTime())
      data.expires_in = now + (data.expires_in - 20) * 1000
      resolve(data)
    })
  })
}

module.exports = function (opts) {
  let wechat = new weChatGetAccessToken(opts)
  return (
    async (ctx, next) => {
      const token = opts.token
      const signature = ctx.query.signature
      const nonce = ctx.query.nonce
      const timestamp = ctx.query.timestamp
      const echostr = ctx.query.echostr
      /**
       * 根据微信开发者文档显示，没有必要在本地设置signature的检测。
       * 所以引入sha1模块暂时是没有必要的,不需要加密
       */
      const str = [token, timestamp, nonce].sort().join()
      const sha = sha1(str)
      try {
        await next()

        if (signature) {
          console.log(sha)
          ctx.body = echostr + ''
          console.log('successful')
        } else {
          ctx.body = 'err'
          console.log('err')
        }
      } catch (err) {
        ctx.body = {message: err.message}
        ctx.status = err.status || 500
      }
    }
  )
}
