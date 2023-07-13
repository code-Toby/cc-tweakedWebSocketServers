var WSC = require('ws');
var wss = new WSC.Server({ port:5757 });
var fs = require('fs');
var InterVal;
var FileArray = [];

console.log('running server');

function sendFiles(ws) {
    var files = fs.readdirSync(__dirname+'/files');
    
    files.forEach(function(v, i) {
        var fileData = fs.readFileSync(__dirname+'/files/'+v, "utf8", function(err, data){
            return data
        });
        var NewData = JSON.stringify({'Name':v,'Data':fileData})
        if (FileArray[i] != NewData) {
            FileArray[i] = NewData;
            var Dt = JSON.parse(FileArray[i]);
            ws.send(FileArray[i]);
            console.log('Sent file: '+Dt["Name"]);
        }

        
        //if (Dt["Name"] == v) {
            //if (Dt["Data"] != LastData) {
                //ws.send(NewData);
                //LastData = Dt["Data"]
                
            //}
        //}
        
    });
}

wss.on("connection", wsClient => {
    console.log('got connection');

    InterVal = setInterval(sendFiles, 500, wsClient );

    wsClient.on('close', function close() {
        console.log('lost connection');
        clearInterval(InterVal);
    });
    
});



