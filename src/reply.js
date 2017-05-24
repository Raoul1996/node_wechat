exports.reply = function* (next) {
  let message = this.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      console.log('subscribe')
      this.body = 'hahaha you subscribe me \r\n' +
        `消息ID${message.MsgId}`
      if (message.EventKey) {
        console.log(`扫描二维码进来${message.EventKey} ${message.ticket}`)
      }
      this.body = 'hahaha you subscribe me \r\n' +
        `消息ID${message.MsgId}`
    } else if (message.Event === 'unsubscribe') {
      console.log(`${message.FromUserName}无情取关`)
      this.body = ''
    }
  } else if (message.MsgType === 'text') {
    console.log('test message')
    this.body = '坑爹宝先生，晚上好'
  }
  yield next
}