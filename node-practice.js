// var p = document.createElement('p');
// p.id = "nodeTest";
// document.body.appendChild(p);


var http = require('http');
var fs = require('fs');
//var express = require('express');
//var bodyParser = require('body-parser');
//var jsonfile = require('jsonfile');
//var app = express();

var log = "log/";
var session = {
    currentFile: undefined,
};


// app.use(bodyParser);
// app.post('/', function(req, res){
//     console.log(req.body);
//     res.send(200);
// });





http.createServer(createServerCallback).listen(1337, "127.0.0.1");
console.log("Server running at http://127.0.0.1:1337/");


//ADD ELSE IF TO CHECK IF JSON....if so then do makeNewEntry
//https://www.npmjs.com/package/jsonfile <--- use to read and write json

function createServerCallback(req, res){
    if(req.url === "/index.html"){
        sendFileContent(res, 'index.html', "text/html");
    }
    else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    }
    else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    }
    else if(/^\/[a-zA-Z0-9\/]*.json$/.test(req.url.toString())){
        //sendFileContent(res, req.url.toString().substring(1), "text/json");
        newJSONRequest(res, req.url.toString().substring(1), "text/json");
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<b>No file found</b></br>This is the default response. Requested URL is: ' + req.url);
        res.end();
    }
}



function sendFileContent(res, fileName, contentType){
  fs.readFile(fileName, function(err, data){
    if(err){
      res.writeHead(404);
      res.write("Not Found!");
    }
    else{
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
    }
    res.end();
  });
}

function newJSONRequest(res, fileName, contentType){
    makeNewEntry(res, fileName);
}


function makeNewEntry(res, fileName){
    var location = log + fileName;

    checkForFile(fileName, function(cbRes){
        console.log(cbRes);
        if( cbRes ){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('File already exists');
        }
        else{
            fs.writeFile(location, 'Some log\n');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("File didn't exist, wrote new file: " + location);
        }
        res.end();
    });


    // if( test ){
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.write('File already exists');
    // }
    // else{
    //     fs.writeFile(location, 'Some log\n');
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.write("File didn't exist, wrote new file: " + location);
    // }

}



function checkForFile(fileName, callback){
    var location = log + fileName;

    fs.stat(location, function(err, stat) {
        if(err === null) {
            //console.log(err);
            callback(true);
        } else if(err.code == 'ENOENT') {
            callback(false);
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}
