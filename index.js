const EventEmitter = require('events')
const utils = require('./lib/util')
const path = require('path')
const spawn = require('child_process').spawn

const defaults = {
  url: null,
  saveAs: null,
  saveTo: process.cwd(),
  deleteIfExists: false,
  resume: true
}

class Downloader extends EventEmitter {
  constructor (options) {
    super()

    this.options = Object.assign({}, defaults, options)

    if (!this.options.url) {
      setImmediate(() => {
        this.emit('error', new Error('No url specified'))
      })
      return this
    }
    if (!utils.ValidUrl(this.options.url)) {
      setImmediate(() => {
        this.emit('error', new Error('Not a valid url!'))
      })
      return this
    }

    utils
      .checkDir(this.options.saveTo)
      .then(() => utils.getHead(this.options.url))
      .then(res => utils.responseCheck(res))
      .then(res => utils.parseHead(res))
      .then(fileInfo => {
        this.options.saveAs = this.options.saveAs || fileInfo.filename
        this.fileInfo = fileInfo

        return utils.checkBeforeDownload(this.options, fileInfo.size)
      })
      .then(fileSize => this.download(fileSize))
      .catch(err => this.emit('error', err))

    return this
  }

  download (fileSize) {
    if (!isNaN(fileSize) && fileSize === this.fileInfo.size) {
      return this.emit('end')
    }

    const filePath = path.join(this.options.saveTo, this.options.saveAs)
    const Args = [].concat(utils.PorcessOptions)
    // const speed = 0
    // const now = {
    //   time: 0,
    //   data: 0
    // }
    // const previous = {
    //   time: new Date().getTime() / 1000,
    //   data: 0
    // }

    let started = false
    let progress = 0

    Args.push(`-o${filePath}`)
    if (!isNaN(fileSize)) Args.push(`-C ${fileSize}`)
    Args.push(this.options.url)

    this.curl = spawn('curl', Args).stderr
      .on('data', data => {
        data = data.toString('ascii').trim()

        if (data.indexOf('#') !== -1) return
        if (!started) this.emit('start')

        if (started) {
          utils
            .getFilesize(filePath)
            .then(size => {
              progress = parseFloat(size / this.fileInfo.size)

              this.emit('progress', {
                progress,
                dataWritten: size,
                filesize: this.fileInfo.size,
                speed: null
              })
            })
            .catch(err => {
              this.curl.kill()
              this.emit('error', err)
            })
        }
        started = true
      })
      .on('close', code => {
        if (code === null) return
        if (code) this.emit('error', new Error(code))

        utils
          .getFilesize(filePath)
          .then(size => {
            this.emit('progress', {
              progress: 1,
              dataWritten: size,
              filesize: this.fileInfo.size,
              speed: 0
            })
            this.emit('end')
          })
          .catch(err => this.emit('error', err))
      })
  }

  pause () {
    if (this.curl) this.curl.kill()
    return this
  }

  resume () {
    if (this.curl) utils.download(utils.getFilesize(this.filePath))
    return this
  }

  getCurl () {
    if (this.curl) return this.curl
  }
}

module.exports = Downloader
