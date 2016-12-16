var Downloader = require("./");


var Dl = new Downloader({
    url: "http://www.youtube-mp3.org/get?video_id=xQCOs9eb1Xc&ts_create=1481919124&r=MTA1LjE1NS45NS4xNDk%3D&h2=0c99da6d164cd82187d49f337ef0d0d9&s=166491",
    saveto: "Downloads",
    deleteIfExists: true
}).on("start", function (){
    console.log("Download Started");
}).on("error", function(err){
    console.log(err)
}).on("progress", function(data){
    console.log(data)
}).on("end", function(){
    console.log("Download Finished");
});

setTimeout(() => {
    Dl.pause()
}, 5000);

setTimeout(() => {
    Dl.resume()
}, 8000);