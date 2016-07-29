# filedownloader

![npm](https://img.shields.io/npm/v/filedownloader.svg) ![license](https://img.shields.io/npm/l/filedownloader.svg) ![github-issues](https://img.shields.io/github/issues/oussama1598/node-filedownloader.svg)  ![Circle CI build status](https://circleci.com/gh/oussama1598/node-filedownloader.svg?style=svg)

makes downloading very easy

![nodei.co](https://nodei.co/npm/filedownloader.png?downloads=true&downloadRank=true&stars=true)

![travis-status](https://img.shields.io/travis/oussama1598/node-filedownloader.svg)
![stars](https://img.shields.io/github/stars/oussama1598/node-filedownloader.svg)
![forks](https://img.shields.io/github/forks/oussama1598/node-filedownloader.svg)

![forks](https://img.shields.io/github/forks/oussama1598/node-filedownloader.svg)

![](https://david-dm.org/oussama1598/node-filedownloader/status.svg)
![](https://david-dm.org/oussama1598/node-filedownloader/dev-status.svg)

## Quick start
```sh
    npm install filedownloader
```
Then:
```javascript
    var Downloader = require("filedownloader");
    
    var Dl = new Downloader({
        url: "FILEURL"
    }).on("progress", function (progress){
        console.log(progress); 
    });
```
The Downloader function accepts an object that can take:

* `url` url to Download from
* `saveas` File name to be saved as ex( audio.mp3)
* `saveto` Folder to be saved in
* `deleteIfExists` Force deleting file if it is excisting (default: false)
* `resume` Resume file if it is not compelted if false will delete the file and start it again (default: true)

The progress event will return :
```js
    { progress: '1.3', dataWritten: 376072, filesize: '29828970', speed: 'byte/s'} //just an example of the ouput
```

### Controlling The Download
you can pause the downloading by :
```js
    Dl.pause();
```
and you can resume it by:
```js
    Dl.resume();
```
### Setting event handlers
#### 'start': download started
The `start` event is emitted just after the download starts
    
```js
    Dl.on("start", function(){
       console.log("Download started") 
    });
```
#### 'progress': progress information

The `progress` Event is emitted with an object argument with the following keys:
    
* `dataWritten`: size of downloaded data in bytes
* `filesize`: size of the target file in bytes
* `progress`: an estimation of the progress percentage
* `speed`: an estimation of the download speed

```js
    Dl.on("progress", function(progress){
       console.log('Downloaded: ' + progress.pregress + '%'); 
    });
```
#### 'error': error occurred
The `error` event is emitted when an error occurs

```js
    Dl.on("error", function(err){
       console.log('Some error occurred:' + err); 
    });
```
#### 'end': Downloading finished
The `end` event is emitted when Downloading has finished.
    
```js
    Dl.on("end", function(){
       console.log('Download finished'); 
    });
```    
#### What's new
Added some functionality to resume file downloading

## Tests

```sh
npm test
```

## Dependencies

- [content-disposition](https://github.com/jshttp/content-disposition): Create and parse Content-Disposition header
- [del](https://github.com/sindresorhus/del): Delete files and folders
- [file-exists](https://github.com/scottcorgan/file-exists): Check if filepath exists and is a file
- [mkdirp](https://github.com/substack/node-mkdirp): Recursively mkdir, like `mkdir -p`
- [request](https://github.com/request/request): Simplified HTTP request client.
- [urlencode](https://github.com/node-modules/urlencode): encodeURIComponent with charset
- [valid-url](https://github.com/ogt/valid-url): URI validation functions


## Contributing

Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author

Oussama Barkouki

## License

 - **GPL-3.0** : [http://opensource.org/licenses/GPL-3.0](http://opensource.org/licenses/GPL-3.0)