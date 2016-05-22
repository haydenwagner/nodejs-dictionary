function makeNewEntry(){
    var fileName = "/" + document.getElementById('newFileInput').value + '.json';
    console.log(fileName);
    if(fileName){
        //SEND AS JSON FILE TO 'node-practice.js'

        $.get(fileName, function(res){
            console.log(res);
        });
    }
}
