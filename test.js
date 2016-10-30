var Downloader = require("./index");


var Dl = new Downloader({
    url: "http://ghoulish-alien-3742.herokuapp.com/torrents/23c1fa6ceadf9122201cbb8b95ab565510196ad3/files/01%20Cheap%20Thrills%20(feat.%20Sean%20Paul).mp3",
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
/*var Dl = new Downloader({
    stream: {s: ytdl("https://www.youtube.com/watch?v=Mr1sqe_eZq4", {filter: "audioonly"}), noSize: true},
    saveas: "audio.webm",
    saveto: "Downloads"
}).on("start", function (){
    console.log("Download Started");
}).on("error", function(err){
    console.log(err)
}).on("progress", function(data){
    console.log(data)
}).on("end", function(){
    console.log("Download Finished");
});*/

setTimeout(() => {
    Dl.pause()
}, 5000);

setTimeout(() => {
    Dl.resume()
}, 8000);