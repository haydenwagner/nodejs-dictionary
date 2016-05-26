function makeNewEntry(){
    var value = document.getElementById('newFileInput').value;

    if ( value === undefined || value === '' ){
        return;
    }
    else{
        var fileName = "/" + value + '.json';
        console.log(fileName);

        //SEND AS JSON FILE TO 'node-practice.js'

        $.get(fileName, function(res){
            if(res === 'File already exists'){
                fileExists(res);
            }
            else{
                console.log(res);
            }
        });
    }


}


function newButton(text, func){
    var button = document.createElement('button');
    button.innerHTML = text;
    button.onclick = func;

    return button;
}

function fileExists(res){
    var div = document.createElement('div');
    var p = document.createElement('p');
    var input = document.getElementById('newFileInput');

    div.id = 'fileExistsDiv';
    p.innerHTML = res + ', would you like to edit the existing file?';

    div.appendChild(p);
    div.appendChild( newButton('Yes', fileExistsYes) );
    div.appendChild( newButton('No', fileExistsNo) );

    document.body.appendChild(div);

    input.style.background = 'red';
}

function fileExistsYes(){
    console.log(this);
    console.log('yes, edit the existing file');
}

function fileExistsNo(){
    var input = document.getElementById('newFileInput');
    var fileExistsDiv = document.getElementById('fileExistsDiv');

    input.value = '';
    input.style.background = 'none';
    input.focus();

    document.body.removeChild(fileExistsDiv);

    console.log(this);
    console.log("no, don't edit the existing file");
}


function makeNewSchema(){
    var type = 'newschema';
    var value = document.getElementById('newSchemaInput').value;
    console.log(value);

    var req = 'type='+type+'&value='+value;
    console.log(req);

    handleKeyVal(req);

    $.get(req, function(res){
        console.log(res);
    });
}

