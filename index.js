var request = require("request"),
    fs = require("fs"),
    util = require('util'),
    EventEmitter = require('events'),
    utils = require('./lib/util'),
    fileExists = require('file-exists'),
    path = require("path"),
    del = require("del");

module.exports = Downloader = function(options) {
    EventEmitter.call(this);
    var self = this,
        defaultOpt = {
            url: null,
            saveas: null,
            saveto: null,
            deleteIfExists: false,
            resume: true
        };
    options = utils.xtend(options, defaultOpt) || defaultOpt;

    if (!options.url) this.emit("error", "No url specified");
    if (!utils.ValidUrl(options.url)) this.emit("error", "Not a valid Url");
    options.saveto = (!options.saveto) ? __dirname : utils.checkDir.call(self, options.saveto);

    utils.getonlineInfo(options.url, function(res) {
        self.fileinfo = utils.getinfo(options.saveas, res);

        self.filePath = path.join(options.saveto, self.fileinfo.saveas);

        if (fileExists(self.filePath)) {
            if (options.deleteIfExists) {
                utils.fileDelete(self.filePath, function() {
                    down();
                });
            } else {
                var fileSizeInBytes = utils.getFilesize(self.filePath);
                len = parseFloat(self.fileinfo.filesize);
                if (options.resume) {
                    if (fileSizeInBytes === len) {
                        self.emit("end");
                    } else {
                        down("bytes=" + fileSizeInBytes + "-" + len);
                    }
                } else {
                    utils.fileDelete(self.filePath, function() {
                        down();
                    });
                }
            }
        } else {
            down();
        }
    });

    var down = function(rn) {
        var head = rn ? { Range: rn } : {};
        var dw = request.get(options.url, { headers: head })
            .on("response", function(res) {
                var previous = 0,
                    now = 0,
                    speed = 0;

                self.int = setInterval(function() {
                    speed = now - previous;
                    previous = now;
                }, 1000);

                self.stream = fs.createWriteStream(self.filePath, { flags: 'a' }).on("pipe", function() {
                    self.emit("start");
                }).on("finish", function() {
                    clearInterval(self.int);
                    self.emit("end");
                }).on("error", function(err) {
                    self.emit("error", err)
                }).on("drain", function(e) {
                    var dataWritten = utils.getFilesize(self.filePath),
                        pr = parseFloat((dataWritten * 100) / self.fileinfo.filesize).toFixed(1),
                        size = self.fileinfo.filesize;
                    now = dataWritten;
                    self.emit("progress", { progress: pr, dataWritten: dataWritten, filesize: size, speed: speed });
                });

                dw.pipe(self.stream);
            });
    }
}


Downloader.prototype.pause = function() {
    if (this.stream) {
        this.stream.cork();
    }
};

Downloader.prototype.resume = function() {
    if (this.stream) {
        this.stream.uncork();
    }
};

util.inherits(Downloader, EventEmitter);
