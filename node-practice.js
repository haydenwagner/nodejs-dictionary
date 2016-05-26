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
    currentReq: {}
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
    console.log('Requested URL =' + req.url);

    if(req.url === "/index.html"){
        sendFileContent(res, 'index.html', "text/html");
    }
    else if( req.url.toString().substring(1).indexOf('=') != -1 ){
        handleKeyVal(req.url.toString().substring(1), function handleKeyValCallback(cbRes){
            var type = cbRes.type;
            var fileName = cbRes.value;

            //maybe take this out to its own 'checkKeyValType' function???
            if( type == 'newschema' ){
                var path = 'log/schemas/';
                fileName = fileName + '.json';

                fs.readdir(path, function readdirCallback(err,files){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //check for file first---then in callback delegate to 'makeNewEntry' OR
                        //editExisting..but fits edit 'makeNewEntry' (see notes at function)
                        checkForFile(fileName, path, function checkForFileCallback(cbRes){
                            console.log(cbRes);
                            //if statement here to delgate to different functions
                        });
                    }
                });
            }
        });
    }
    else if(/^\/[a-zA-Z0-9\/]*.html$/.test(req.url.toString())){
        sendFileContent(res, req.url.toString().substring(1), "text/html");
    }
    else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    }
    else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
        sendFileContent(res, req.url.toString().substring(1), "text/css");
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

// ***commented this out for now...using key val for json file requests now
// function newJSONRequest(res, fileName, contentType){
//     var path = 'log/';
//     makeNewEntry(res, fileName, path);
// }



///****CHANGE
//dont have check in the makeNewEntry function.....when a file is requested check...then do 'makeNewEntry' function if there wasnt
//one there, or do a 'editExistingEntry' (?) function if a file already exists..(so pull out the check for file bit from below and just use
//on its own before the 'makeNewEntry' function)
function makeNewEntry(res, fileName, path){
    var location = path + fileName;

    checkForFile(fileName, path, function checkForFileCallback(cbRes){
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
}



function checkForFile(fileName, path, callback){
    var location = path + fileName;

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




function handleKeyVal(reqString, callback){
    var resObj = {};
    var tempString = reqString;

    if( tempString.indexOf('&') != -1){
        do {
            var ampLocation = tempString.indexOf('&');
            var pair = tempString.slice(0, ampLocation);

            addKeyValToObj(pair, resObj);

            tempString = tempString.slice(ampLocation + 1);

        } while ( tempString.indexOf('&') != -1 );

        addKeyValToObj(tempString, resObj);
    }
    else if( tempString.indexOf('=') != -1){
        addKeyValToObj(tempString, resObj);
    }

    function addKeyValToObj(pair, obj){
        var eqLocation = tempString.indexOf('=');
        var key = pair.slice(0, eqLocation);
        var value = pair.slice(eqLocation + 1);

        obj[key] = value;
    }

    session.currentReq = resObj;
    callback(resObj);
}



// function stripExtension(fileNameArray, callback){
//     var arr = fileNameArray;

//     for(var i=0;i<arr.length; i++){

//     }
// }
