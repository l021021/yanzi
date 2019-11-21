var WebSocketClient = require('websocket').client;
var cirrusAPIendpoint = "cirrus11.yanzi.se";
var username = "653498331@qq.com";
var password = "000000";
var client = new WebSocketClient();
var connection;

var locationId = "229349" //fangtang
    //var deviceID = "UUID-A9899341F08A49279C04EAC3E6C05094"
var deviceID = 'EUI64-D0CF5EFFFE792D84-3-Motion'

var TimeoutId = setTimeout(doReport, 30000);

const tenDay = 864000000;
const _24Hour = 86400000;
var motionTimeStamps = new Array();
var assetTimeStamps1 = new Array();
const startDate = '2019/11/1/0:00:00'
const endDate = '2019/11/11/23:59:59'
var recordObj = {
    "type": "",
    "Did": "",
    "timeStamp": "",
    "value": ""
}


client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    connection.close();
});

client.on('connect', function(connection) {
    console.log('Websocket open!');
    console.log("Checking API service status with ServiceRequest.");
    sendServiceRequest();

    // Handle messages
    connection.on('message', function(message) {
        clearTimeout(TimeoutId);
        TimeoutId = setTimeout(doReport, 30000);

        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
        }

        if (json.messageType == 'ServiceResponse') {
            console.log("ServiceRequest succeeded, sending LoginRequest");
            sendLoginRequest();
        } else if (json.messageType == 'LoginResponse') {
            if (json.responseCode.name == 'success') {

                now = new Date().getTime();
                sendGetSamplesRequest(deviceID, now - tenDay, now);
            } else {
                console.log(json.responseCode.name);
                console.log("Couldn't login, check your username and passoword");
                connection.close();
            }
        } else if (json.messageType == 'GetSamplesResponse') {
            if (json.responseCode.name == 'success' && json.sampleListDto.list) {

                console.log("receiving " + json.sampleListDto.list.length + ' lists'); //json.sampleListDto.list.length json.sampleListDto.dataSourceAddress.variableName.name

                //Process records
                switch (json.sampleListDto.dataSourceAddress.variableName.name) { //json.sampleListDto.list[0].resourceType  json.sampleListDto.list[0].sampleTime  json.sampleListDto.list[0].value
                    case 'motion':
                        var lastValue = -1;
                        for (let index = 0; index < json.sampleListDto.list.length; index++) {

                            //var temp1 = sensorArray[json.list[0].dataSourceAddress.did];
                            var temprecordObj;
                            json.sampleListDto.list[0].value; //update new value 
                            recordObj.type = json.sampleListDto.list[0].resourceType;
                            recordObj.Did = json.sampleListDto.dataSourceAddress.did
                            recordObj.timeStamp = json.sampleListDto.list[0].sampleTime
                            if (lastValue != json.sampleListDto.list[0].value) { //Value changed!
                                recordObj.value = 'in'
                                temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                motionTimeStamps.push(temprecordObj)
                            } else if (lastValue == json.sampleListDto.list[0].value) { //Value unchanged!
                                //motionFlag = ' == ';
                                recordObj.value = 'ot'
                                temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                motionTimeStamps.push(temprecordObj)
                                    // motionTimeStamps.push(json.list[0].dataSourceAddress.did + ',ot,' + _t1.getTime());

                            } else { //do not record to record 
                                console.log("        Sensor first seen, cannot tell");
                            };

                            lastValue = json.sampleListDto.list[0].value; //update new value 

                        }

                        break;
                    case 'EventDTO':
                        console.log('    ' + _Counter + '#    Event DTO : ' + json.list[0].eventType.name);
                        break;
                    default:
                        console.log("!!!! cannot understand this rsourcetype " + json.list[0].resourceType);
                }
            } else {
                console.log("no samples.");
            }
        } else {
            console.log("Couldn't understand");
            connection.close();
        }

    });

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function(error) {
        console.log('Connection closed!');
    });

    function sendMessage(message) {
        if (connection.connected) {
            // Create the text to be sent
            var json = JSON.stringify(message, null, 1);
            //console.log('sending' + JSON.stringify(json));
            connection.sendUTF(json);
        } else {
            console.log("sendMessage: Couldn't send message, the connection is not open");
        }
    }

    function sendServiceRequest() {
        var request = {
            "messageType": "ServiceRequest"
        }
        sendMessage(request);
    }

    function sendLoginRequest() {
        var request = {
            "messageType": "LoginRequest",
            "username": username,
            "password": password
        }
        sendMessage(request);
    }


    function sendGetSamplesRequest(deviceID, timeStart, timeEnd) {
        if (timeStart > timeEnd) {
            console.log('Wrong Date.')
            return null;
        }
        if ((timeEnd - timeStart) >= _24Hour) {
            var request = {
                "messageType": "GetSamplesRequest",
                "dataSourceAddress": {
                    "resourceType": "DataSourceAddress",
                    "did": deviceID,
                    "locationId": locationId,
                },
                "timeSerieSelection": {
                    "resourceType": "TimeSerieSelection",
                    "timeStart": timeStart,
                    "timeEnd": timeStart + _24Hour
                }
            };
            sendMessage(request);
            sendGetSamplesRequest(deviceID, timeStart + _24Hour, timeEnd);
        } else {

            var request = {
                "messageType": "GetSamplesRequest",
                "dataSourceAddress": {
                    "resourceType": "DataSourceAddress",
                    "did": deviceID,
                    "locationId": locationId,
                },
                "timeSerieSelection": {
                    "resourceType": "TimeSerieSelection",
                    "timeStart": timeStart,
                    "timeEnd": timeEnd
                }
            };
            sendMessage(request);
        }

    }

    function findLocationId(deviceID) {
        return locationId;
    }

});


function beginPoll() {
    if (!username) {
        console.error("The username has to be set");
        return;
    }
    if (!password) {
        console.error("The password has to be set");
        return;
    }
    client.connect("wss://" + cirrusAPIendpoint + "/cirrusAPI");
    console.log("Connecting to wss://" + cirrusAPIendpoint + "/cirrusAPI using username " + username);
}

function doReport() {

    clearTimeout(TimeoutId);
    console.log('Total records: ' + motionTimeStamps.length);
    console.log("Time is Up...")
    process.exit();
}

beginPoll();