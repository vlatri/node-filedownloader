var Downloader = require("./index");


var Dl = new Downloader({
    url: "https://www.dropbox.com/s/jogm62357fv9iru/mp3-tagger_1.0-1_i386.deb?dl=1",
    saveto: "Downloads"
}).on("start", function (){
    console.log("Download Started");
}).on("error", function(err){
    console.log(err)
}).on("progress", function(data){
    console.log(data)
}).on("end", function(){
    console.log("Download Finished");
});