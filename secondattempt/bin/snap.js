
var snap7 = require('node-snap7');
s7client = new snap7.S7Client();


b0 = new Buffer([0]);
b1= new Buffer([1]);

var s7statusflag = 0;

var setupvars ={
    wordLen: s7client.S7WLBit,
    ip: "192.168.0.1",
    localTSAP:0x030,
    remoteTSAP: 0x020,
    dbNumber: 0,
    rack: 0,
    slot: 1,
    LOGO: 0
};

var PLCdata = {
    output1: 0,
    output2: 0,
    output3: 0,
    output4: 0

};

function S7activityhandler(task){
    switch(task) {
        case 1:
            PLCconnection(setupvars.LOGO);
            break;
        case 2:
            PLCdisconnect();
            break;
        case 3:
            if(s7statusflag>0){
                PLCdata.output1 = Getoutputs(0,1);
                PLCdata.output2 = Getoutputs(1,1);
                PLCdata.output3 = Getoutputs(2,1);
                PLCdata.output4 = Getoutputs(3,1);
            }else{
                console.log("Outputs not available");
            }
            break;
    }



}

function PLCconnection(LOGO){

    if(LOGO > 0){
        console.log("LOGO");
        s7client.SetConnectionParams(setupvars.ip, setupvars.localTSAP, setupvars.remoteTSAP);
        s7client.SetConnectionType(0x01);
        s7client.Connect(function (err) {
            if (err) {

                return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
            } else {
                s7statusflag = 1;
            }
            // Read the first byte from PLC process outputs...
        });

    }else {
        console.log(1200);
        s7client.ConnectTo(setupvars.ip, setupvars.rack, setupvars.slot, function (err) {
            if (err) {
                return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
            } else {
                s7statusflag = 1;

            }
            // Read the first byte from PLC process outputs...
        });
    }
}

function PLCdisconnect(){
    var OK = s7client.Disconnect();
    if(OK > 0){
        console.log("disconnected");
        s7statusflag = 0;
    }else{
        console.log("disconnection failed");
    }
}

function Getoutputs(start, ammount){
    s7client.ReadArea(S7Client.S7AreaPA, setupvars.dbNumber, start, ammount, setupvars.wordLen, function (err) {
        if (err) {
            return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
        } else {
        }
        // Read the first byte from PLC process outputs...
    });
}

//S7activityhandler(3);

exports.activityhandler = S7activityhandler;
exports.PLCdata = PLCdata;