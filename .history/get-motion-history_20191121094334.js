var WebSocketClient = require('websocket').client;
var cirrusAPIendpoint = "cirrus11.yanzi.se";
var username = "653498331@qq.com";
var password = "000000";
var client = new WebSocketClient();
var connection;

var locationId = "229349" //Usually a 6 digit number
    //var deviceID = "UUID-A9899341F08A49279C04EAC3E6C05094"
var deviceID = 'EUI64-D0CF5EFFFE792D84-3-Motion'

var TimeoutId = setTimeout(doReport, 30000);

const tenDay = 864000000;
const _24Hour = 86400000;

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

                    console.log("receiving " + json.sampleListDto.list.length + ' lists');
                } else {
                    console.log("no samples.");
                }
            } else {
                console.log("Couldn't understand");
                connection.close();
            }
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
            if (timeStart >= timeEnd) {
                console.log('Wrong Date.')
                return null
            };
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
            //console.log(Date(timeEnd).toTimeString());
            sendMessage(request);
        }

    }

    function findLocationId(deviceID) {
        return locationId;
    }

});


function processArgs() {
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
    console.log("Time is Up...")
    process.exit();
}

processArgs();