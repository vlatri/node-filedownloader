const Downloader = require('./')

new Downloader({
  url: 'http://unsplash.com/photos/kKDPBa5GmT4/download?force=true',
  saveTo: 'Downloads',
  resume: true
})
  .on('start', function () {
    console.log('Download Started')
  })
  .on('error', function (err) {
    console.log(err)
  })
  .on('progress', function (data) {
    console.log(data)
  })
  .on('end', function () {
    console.log('Download Finished')
  })

// setTimeout(() => {
//   Dl.pause()
// }, 5000)

// setTimeout(() => {
//   Dl.resume()
// }, 8000)
