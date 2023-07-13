var WSC = require('ws');
var wss = new WSC.Server({ port:5757 });
var fs = require('fs');


console.log('running server');

function MakeFile(Dir, Name, Data){
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    
    var today = dd+'-'+mm+'-'+yyyy;

    var NewName = Name.replaceAll("/","\\")
    var NewDir = Dir.replaceAll("/","\\")

    console.log('Directory: '+NewDir);
    console.log('File: '+NewName);

    fs.mkdirSync(__dirname+"\\files\\"+today+NewDir, {recursive: true});
    fs.writeFile(__dirname+"\\files\\"+today+NewDir+NewName, Data, function (err) {
        if (err) {
            throw err;
        }
        
    });
}

wss.on("connection", wsClient => {
    console.log('got connection');

    wsClient.on('message', function message(data) {
        var Dt = JSON.parse(data.toString('utf8'));
        MakeFile(Dt["Dir"],Dt['Name'],Dt['Data']);
    });

    wsClient.on('close', function close() {
        console.log('lost connection');
    });
});