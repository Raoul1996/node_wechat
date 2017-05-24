exports.reply = function* (next) {
  let message = this.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log(`扫描二维码进来${message.EventKey} ${message.ticket}`)
      }
      this.body = 'hahaha you subscibe me \r\n' +
        `消息ID${message.MsgId}`
    } else if (message.Event === 'unsubscribe') {
      console.log('无情取关')
      this.body = ''
    }
  } else if (message.MsgType === 'text') {
    console.log('test message')
    this.body = ''
  }
  yield next
}