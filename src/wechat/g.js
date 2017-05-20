'use strict'
/**
 * 由于使用的 ngrok 代理工具不稳定，所以需要及时替换测试号的链接
 * @url: https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
 * 进行接口信息的配置与修改。
 * @password: wechatdev1
 */
const sha1 = require('sha1')
module.exports = function (opts) {
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
