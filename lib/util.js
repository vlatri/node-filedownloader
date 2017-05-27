const validurl = require('valid-url')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const cd = require('content-disposition')
const request = require('request')
const del = require('del')
const bluebird = require('bluebird')

const PorcessOptions = [
  '--create-dirs',
  '--insecure',
  '--progress-bar',
  '--location',
  '--globoff'
]

const ValidUrl = url => validurl.isUri(url)

const parseHead = res => {
  const size = parseInt(res.headers['content-length'], 10)
  const filename = res.headers['content-disposition']
    ? decodeURI(
        cd.parse(res.headers['content-disposition']).parameters.filename
      )
    : path.basename(res.request.uri.path)

  return {
    size,
    filename
  }
}

const checkDir = path =>
  bluebird
    .promisify(fs.stat)(path)
    .catch(() => bluebird.promisify(mkdirp)(path))

const getHead = url => bluebird.promisify(request.head)(url)

const responseCheck = res =>
  new Promise((resolve, reject) => {
    if (res.statusCode !== 200) {
      reject(new Error(`Http error code ${res.statusCode}`))
    }

    resolve(res)
  })

const fileDelete = file =>
  del(file, {
    force: true
  })

const getFilesize = filePath =>
  bluebird.promisify(fs.stat)(filePath).then(file => file.size)

const checkBeforeDownload = (options, size) => {
  const filePath = path.join(options.saveTo, options.saveAs)

  return getFilesize(filePath)
    .then(size => {
      if (options.deleteIfExists || !options.resume) {
        return fileDelete(filePath)
      }
      return Promise.resolve(size)
    })
    .catch(() => Promise.resolve())
}

module.exports = {
  ValidUrl,
  parseHead,
  checkDir,
  getHead,
  responseCheck,
  checkBeforeDownload,
  PorcessOptions,
  getFilesize
}
