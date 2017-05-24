'use strict'
const Promise = require('bluebird')
const util = require('./util')
const request = Promise.promisify(require('request'))
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
  accessToken: `${prefix}token?grant_type=client_credential`
}
function WeChat (opts) {
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
          return Promise.resolve(data)
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
WeChat.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) return false
  let access_token = data.access_token
  let expires_in = data.expires_in
  let now = (new Date().getTime())
  return (now < expires_in)
}
WeChat.prototype.updateAccessToken = function () {
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
WeChat.prototype.reply =function () {
  let content = this.body
  let message = this.weixin
  let xml = util.tpl(content, message)
  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}
module.exports = WeChat