'use strict'
exports.reply = async (ctx, next) => {
  const message = ctx.wenxin
  try {
    if (message.MsgType === 'event') {
      if (message.Event === 'subscribe') {
        if (message.EventKey) {
          console.log(`扫描二维码进来${message.EventKey} ${message.ticket}`)
        }
        ctx.body = 'hahaha you subscibe me \r\n' +
          `消息ID${message.MsgId}`
      } else if (message.Event === 'unsubscribe') {
        console.log('无情取关')
        this.body = ''
      }
    } else if (message.MsgType === 'text') {
      console.log('test messs')
      ctx.body = 'fsadfsadf'
    }
    await next
  }
  catch
    (err) {
    ctx.body = {message: err.message}
    ctx.status = err.status || 500
  }
}