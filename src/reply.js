
const config = require('./config')
const Wechat = require('./wechat/wechat')
const weChatApi = new Wechat(config.weChat)

exports.reply = function* (next) {
  let message = this.weixin
  console.log(message)
  const event = message.Event
  const msgType = message.MsgType
  const eventKey = message.EventKey
  const msgId = message.MsgId
  const content = message.Content
  const ticket = message.ticket
  const latitude = message.Latitude
  const longitude = message.Longitude
  const preision = message.Preision
  if (msgType === 'event') {
    if (event === 'subscribe') {
      console.log('subscribe')
      this.body = 'hahaha you subscribe me \r\n' +
        `消息ID${msgId}`
      if (eventKey) {
        console.log(`扫描二维码进来${eventKey} ${ticket}`)
      }
      this.body = 'hahaha you subscribe me \r\n' +
        `消息ID${msgId}`
    } else if (event === 'unsubscribe') {
      console.log(`${message.FromUserName}无情取关`)
      this.body = ''
    }
    else if (event === 'LOCATION') {
      this.body = `您上报的地理位置是: ${latitude} / ${longitude}- ${preision}`
    } else if (event === 'CLICK') {
      this.body = `您点击了菜单${eventKey}`
    } else if (event === 'SCAN') {
      console.log(`关注后扫描二维码${eventKey} ${ticket}`)
      this.body = '看到你扫了一下下'
    } else if (event === 'VIEW') {
      this.body = `您点击了菜单中的链接${eventKey}`
    }
  } else if (msgType === 'text') {
    let reply = `你说的是: ${content}。可是我就是不想回复你怎么办，因为坑爹宝没指定回复策略。所以你最好输入1到6这几个数字`
    if (content === '1') {
      reply = '我爱你'
    } else if (content === '2') {
      reply = '我真的很爱你'
    } else if (content === '3') {
      reply = '我不生气了'
    }
    else if (content === '4') {
      reply = '萌萌是我的宝贝'
    } else if (content === '5') {
      reply = {
        title: '我的小祖宗',
        description: '我的女朋友',
        picUrl: 'http://oq5td7hx8.bkt.clouddn.com/11.jpg',
        url: 'https://github.com/'
      }
    } else if (content === '6') {
      reply = {
        title: '祝我自己生日快乐',
        description: '5月25居然是农历的4月30啊',
        picUrl: 'http://oq5td7hx8.bkt.clouddn.com/14.jpg',
        url: 'http://nodejs.org/'
      }
    } else if (content === '7') {

      let data = yield weChatApi.uploadMaterial('image', `${__dirname}/2.jpg`)
      reply = {
        type: 'image',
        mediaId: data.media_id
      }
    }
    this.body = reply
  }

  yield next
}