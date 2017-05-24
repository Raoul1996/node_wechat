
const fs = require('fs')
const Promise = require('bluebird')
exports.readFileSync = function (fpath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, encoding, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}
exports.writeFileSync = function (fpath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fpath, content, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
