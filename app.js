'use strict'
/**
 * 由于使用的 ngrok 代理工具不稳定，所以需要及时替换测试号的链接
 * @url: https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
 * 进行接口信息的配置与修改。
 * @password: wechatdev1
 */
const Koa = require('koa')
const sha1 = require('sha1')
const config = {
  weChat: {
    appID: 'wxb250d9904e5fec3d',
    appSecret: '647e6c68f0c5f48803ba4c72b496311c',
    token: 'qwertyuiopraoul12345'
  }
}
let app = new Koa()
app.use(async (ctx, next) => {
  console.log(ctx.query)
  const token = config.weChat.token
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
      ctx.body = echostr + ''
      console.log('err')
    }
  } catch (err) {
    ctx.body = {message: err.message}
    ctx.status = err.status || 500
  }
})
app.listen(1234)
console.log('Listing:1234')