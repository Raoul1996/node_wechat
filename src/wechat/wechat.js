'use strict'
const Promise = require('bluebird')
const util = require('./util')
const fs = require('fs')
const request = Promise.promisify(require('request'))
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
  accessToken: `${prefix}token?grant_type=client_credential`,
  upload: `${prefix}media/upload?`
}
function WeChat (opts) {
  let that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken

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
WeChat.prototype.uploadMaterial = function (type, filepath) {
  let that = this
  let form = {
    media: fs.createReadStream(filepath)
  }
  return new Promise((resolve, reject) => {
    that.fetchAccessToken().then(data => {
      const url = `${api.upload}&access_token=${data.access_token}&type=${type}`
      console.log('wechat 52 ')
      console.log(data)
      console.log(url)
      request({
        method: 'POST',
        url: url,
        formData: form,
        json: true
      }).then(res => {
        console.log('wechat line 58')
        console.log(res.body)
        let _data = res.body
        if (_data) {
          resolve(_data)
          console.log('wechat 64line ')
          console.log(_data)
        } else {
          throw new Error('upload material error')
        }
      }).catch((err) => {
        reject(err)
      })
    })

  })
}
WeChat.prototype.reply = function () {
  let content = this.body
  let message = this.weixin
  let xml = util.tpl(content, message)
  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}
WeChat.prototype.fetchAccessToken = function (data) {
  let that = this
  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this)
    }
  }
  //这里需要return promise
  return this.getAccessToken()
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
      console.log('access_token 更新或者确认可以使用')
      that.access_token = data.access_token
      that.expires_in = data.expires_in
      that.saveAccessToken(data)
      return Promise.resolve(data)
    })
}
module.exports = WeChat