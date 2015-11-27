var request = require("request"),
    fs = require("fs"),
    util = require('util'),
    EventEmitter = require('events'),
    utils = require('./lib/util'),
    path = require("path");

module.exports = Downloader = function (options) {
    EventEmitter.call(this);
    var self = this, defaultOpt = {
        url: null,
        saveas: null,
        saveto: null
    };
    options = utils.xtend(options, defaultOpt) || defaultOpt;

    if(!options.url) this.emit("error" ,"No url specified");
    if(!utils.ValidUrl(options.url)) this.emit("error", "Not a valid Url");
    options.saveto = (!options.saveto) ? __dirname : utils.checkDir.call(self, options.saveto);

    var dw = request.get(options.url).on("response", function(res){
        var fileinfo = utils.getinfo(options.saveas, res);
        self.fileinfo = fileinfo;
        self.stream = fs.createWriteStream(path.join(options.saveto, fileinfo.saveas)).on("pipe", function(){
           self.emit("start");
        }).on("finish", function(){
            self.emit("end");
        }).on("error", function (err){
            self.emit("error", err)
        }).on("drain", function(e){
            var dataWritten = self.stream.bytesWritten,
                pr = parseFloat((dataWritten * 100) / self.fileinfo.filesize).toFixed(1),
                size = self.fileinfo.filesize;
            self.emit("progress", {progress: pr, dataWritten: dataWritten, filesize: size});
        });

        dw.pipe(self.stream);
    });
}

Downloader.prototype.pause = function (){
   if(this.stream){
       this.stream.cork();
   }
};

Downloader.prototype.resume = function (){
    if(this.stream){
        this.stream.uncork();
    }
};

util.inherits(Downloader, EventEmitter);
