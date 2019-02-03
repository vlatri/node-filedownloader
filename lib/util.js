const validurl = require("valid-url")
const path = require("path")
const urlencode = require("urlencode")
const fs = require("fs")
const mkdirp = require("mkdirp")
const cd = require("content-disposition")
const request = require("request")
const del = require("del")
const fileExists = require('file-exists')
const _ = require("underscore")
const Q = require("q")
const spawn = require('child_process').spawn

let utils = {
    PorcessOptions: ['--create-dirs', '--insecure', '--progress-bar', '--location', '--globoff'],
    ValidUrl: url => {
        return (!validurl.isUri(url)) ? false : true;
    },
    xtend: (target, source) => {
        return _.extend(target, source);
    },
    getinfo: (saveas, res) => {
        let size = res.headers["content-length"],
            returnObj = {
                saveas: saveas,
                filesize: size
            };
        if (saveas) return returnObj;

        if (res.headers['content-disposition']) {
            let filename = cd.parse(res.headers['content-disposition']).parameters.filename;
            returnObj.saveas = urlencode.decode(filename, "gbk");
        } else {
            if (res.req.path === "/") {
                returnObj.saveas = "index.html"
            } else {
                returnObj.saveas = urlencode.decode(path.basename(res.req.path), "gbk");
            }
        }
        return returnObj;
    },
    checkDir: function(path) {
        let self = this;
        if (!fs.existsSync(path)) {
            mkdirp(path, function(err) {
                if (err) self.emit("error", err);
            });
        }
        return path;
    },
    getonlineInfo: (url, fn) => {
        let d = Q.defer();
        request.head(url, function(err, res) {
            d.resolve(res);
        });
        return d.promise;
    },
    getFilesize: function(file) {
        return fileExists(file) ? fs.statSync(file)["size"] : 0;

    },
    fileDelete: function(file, fn) {
        return del(file, { force: true });
    },
    download: (self, startFrom, already = false) => {
        let Args = utils.xtend([], utils.PorcessOptions),
            Norespond = false,
            speed = 0,
            now = { time: 0, data: 0 },
            previous = { time: new Date().getTime() / 1000, data: 0 },
            progress = 0;

        Args.push("-o" + self.filePath);
        if (startFrom) Args.push('-C ' + startFrom);
        Args.push(self.options.url);

        self.curl = spawn('curl', Args);

        self.curl.stderr.on("data", data => {
            data = data.toString('ascii');
            if (Norespond) {
                data = data.toString('ascii');
                if (/\d+(\.\d{1,2})/.test(data)) {
                    if (!already) {
                        self.emit("start");
                    }

                    let dataWritten = utils.getFilesize(self.filePath),
                        size = self.fileinfo.filesize,
                        pr = parseFloat((dataWritten * 100) / size).toFixed(1);

                    progress = pr;

                    now = { time: new Date().getTime() / 1000, data: dataWritten };
                    let diff = now.time - previous.time
                    if (diff !== 0) {
                        speed = Math.floor((((now.data - previous.data) / (now.time - previous.time)) / 1024))
                    }
                    previous = utils.xtend({}, now);

                    self.emit("progress", { progress: pr, dataWritten: dataWritten, filesize: size, speed: `${speed}KB/s` });
                    already = true;
                }
            } else {
                Norespond = true;
            }
        });

        self.curl.on('close', function(code) {
            if (code !== null) {
                if (code === 0) {
                    if (progress === 0 && !fileExists(self.filePath)) return self.emit("error", 'Can\'t start the download');

                    const filesize = self.fileinfo.filesize,
                          dataWritten = utils.getFilesize(self.filePath);
                    
                    self.emit("progress", {
                            progress: 100,
                            dataWritten,
                            filesize,
                            speed: 0
                    });
                    self.emit("end");
                }
                if (code !== 0) {
                    self.emit("error", `Error: ${code}`);
                }
            }
        });
    },
    checkBeforeDownload: (self, options) => {
        return Q.Promise((resolve, reject) => {
            if (fileExists(self.filePath)) {
                if (options.deleteIfExists) {
                    utils.fileDelete(self.filePath).then(() => {
                        resolve()
                    }).catch(err => {
                        reject(err.toString())
                    })
                } else {
                    let fileSizeInBytes = utils.getFilesize(self.filePath),
                        len = parseFloat(self.fileinfo.filesize);
                    if (options.resume) {
                        if (fileSizeInBytes === len) {
                            self.emit("end");
                            reject();
                        } else {
                            resolve(fileSizeInBytes);
                        }
                    } else {
                        utils.fileDelete(self.filePath).then(() => {
                            d.resolve()
                        }).catch(err => {
                            reject(err.toString())
                        })
                    }
                }
            } else {
                resolve();
            }
        })
    }
}


module.exports = utils;
