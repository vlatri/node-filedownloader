<h1 align="center">
  <br>
  filedownloader
  <br>
  <br>
</h1>


<p align="center">
  <a href="https://github.com/oussama1598/node-filedownloader"><img src="https://img.shields.io/github/issues/oussama1598/node-filedownloader.svg" alt="github issues"></a>
  <a href="https://travis-ci.org/oussama1598/node-filedownloader"><img src="https://img.shields.io/travis/oussama1598/node-filedownloader/master.svg" alt="travis"></a>

  <a href="https://www.npmjs.com/package/filedownloader"><img src="https://img.shields.io/npm/v/filedownloader.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/filedownloader"><img src="https://img.shields.io/npm/dm/filedownloader.svg" alt="npm downloads"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>
<br>
**filedownloader** is a small module for easy downloading using the power of curl combined with node.js

## Note
this module requires curl to be present in your system path. if not please check those links

[Linux](http://askubuntu.com/questions/259681/the-program-curl-is-currently-not-installed)
[Windows](http://callejoabel.blogspot.com/2013/09/making-curl-work-on-windows-7.html)
[Mac Os](http://macappstore.org/curl/)


## Quick start


### Install

To install **filedownloader** for use in node `require('filedownloader')`, run:

```bash
	npm install filedownloader
```
### Usage
```js
    const Downloader = require("filedownloader");

    const Dl = new Downloader({
        url: "FILEURL"
    }).on("progress", progress => console.log(progress));
```
The Downloader function accepts an object that can take:

* `url` url to Download from
* `saveAs` Filename to be saved as ex( audio.mp3)
* `saveTo` Folder to be saved in (default: current working directory)
* `deleteIfExists` Delete file if it does exist (default: false)
* `resume` Resume file if it's not completed, if false will delete the file and start it again (default: true)

The progress event will return :
```js
    { progress: 0.13, dataWritten: 376072, filesize: '29828970', speed: 'byte/s'} //just an example of the ouput
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
    Dl.on("start", () => console.log("Download started"));
```
#### 'progress': progress information

The `progress` Event is emitted with an object argument with the following keys:

* `dataWritten`: size of downloaded data in bytes
* `filesize`: size of the target file in bytes
* `progress`: an estimation of the progress between 0 and 1
* `speed`: an estimation of the download speed

```js
    Dl.on("progress", progress => console.log(progress.progress));
```
#### 'error': error occurred
The `error` event is emitted when an error occurs

```js
    Dl.on("error", err => console.log('Some error occurred:' + err));
```
Note: err is always an instance of Error

#### 'end': Downloading finished
The `end` event is emitted when Downloading has finished.

```js
    Dl.on("end", () => console.log('Download finished'));
```
#### What's new
- getCurl function that returns the curl process instance
  >for more details: https://nodejs.org/api/child_process.html

- following standard js

## Tests

```sh
npm test
```

## Dependencies


- [bluebird](https://github.com/petkaantonov/bluebird): full featured promise library with unmatched performance.
- [content-disposition](https://github.com/jshttp/content-disposition): Create and parse Content-Disposition header
- [del](https://github.com/sindresorhus/del): Delete files and folders
- [mkdirp](https://github.com/substack/node-mkdirp): Recursively mkdir, like `mkdir -p`
- [request](https://github.com/request/request): Simplified HTTP request client.
- [valid-url](https://github.com/ogt/valid-url): URI validation functions

## Author

Oussama Barkouki

## License

 - **GPL-3.0** : [http://opensource.org/licenses/GPL-3.0](http://opensource.org/licenses/GPL-3.0)
