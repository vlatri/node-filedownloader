var validurl = require("valid-url"),
    path = require("path"),
    urlencode = require("urlencode"),
    fs = require("fs"),
    mkdirp = require("mkdirp")
cd = require("content-disposition"),
    request = require("request"),
    del = require("del");

module.exports = {
    ValidUrl: function(url) {
        return (!validurl.isUri(url)) ? false : true;
    },
    xtend: function(obj1, obj2) {
        for (param in obj2) {
            if (!obj1[param]) {
                obj1[param] = obj2[param];
            }
        }
        return obj1;
    },
    getinfo: function(saveas, res) {
        var size = res.headers["content-length"],
            returnObj = {
                saveas: saveas,
                filesize: size
            };
        if (saveas) return returnObj;

        if (res.headers['content-disposition']) {
            var filename = cd.parse(res.headers['content-disposition']).parameters.filename;
            returnObj.saveas = urlencode.decode(filename, "gbk");
        } else {
            if (res.req.path === "/") {
                returnObj.saveas = "index.html"
            } else {
                returnObj.saveas = path.basename(res.req.path);
            }
        }
        return returnObj;
    },
    checkDir: function(path) {
        var self = this;
        if (!fs.existsSync(path)) {
            mkdirp(path, function(err) {
                if (err) self.emit(err);
            });
        }
        return path;
    },
    getonlineInfo: function(url, fn) {
        request.head(url, function(err, res) {
            fn(res);
        });
    },
    getFilesize: function(file) {
        var stats = fs.statSync(file)
        var fileSizeInBytes = stats["size"];
        return fileSizeInBytes;
    },
    fileDelete: function(file, fn) {
        del(file).then(function() {
            fn();
        });
    }
}
