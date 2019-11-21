var WebSocketClient = require('websocket').client;
//var async = require('async');

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus11.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production
var username = "653498331@qq.com";
var password = "000000";

//Set up Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var locationId = "229349" //Usually a 6 digit number
var deviceID = "EUI64-D0CF5EFFFE792D88-3-Motion"

// Create a web socket client initialized with the options as above
var client = new WebSocketClient();
var connection;
var TimeoutId = setTimeout(doReport, 10000);

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
        TimeoutId = setTimeout(doReport, 10000);

        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
            //console.log('recieved message type:');
            //console.log(json.messageType);
            if (json.messageType == 'ServiceResponse') {
                console.log("ServiceRequest succeeded, sending LoginRequest");
                // console.log('rcvd' + JSON.stringify(json));
                sendLoginRequest();
            } else if (json.messageType == 'LoginResponse') {
                if (json.responseCode.name == 'success') {

                    now = new Date().getTime();
                    sendGetSamplesRequest(deviceID, now - 3600000 * 100, now);
                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't login, check your username and passoword");
                    connection.close();
                }
            } else if (json.messageType == 'GetSamplesResponse') {
                if (json.responseCode.name == 'success' && json.sampleListDto.list) {

                    console.log(json.sampleListDto.list)
                        //   connection.close();
                } else {
                    console.log("no samples.");

                    //connection.close();
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
            console.log('sending' + JSON.stringify(json));
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
        if ((timeEnd - timeStart) >= 10000000) {
            var request = {
                "messageType": "GetSamplesRequest",
                "dataSourceAddress": {
                    "resourceType": "DataSourceAddress",
                    "did": deviceID,
                    "locationId": locationId,
                    // "variableName": {
                    ///     "resourceType": "VariableName",
                    //      "name": "assetUtilization"
                    //  }
                },
                "timeSerieSelection": {
                    "resourceType": "TimeSerieSelection",
                    "timeStart": timeStart,
                    "timeEnd": timeStart + 10000000
                }
            };
            //console.log(Date(timeEnd).toTimeString());
            sendMessage(request);
            //setTimeout('
            sendGetSamplesRequest(deviceID, timeStart + 10000000, timeEnd);
        } else {
            if (timeStart >= timeEnd) { return null };

            var request = {
                "messageType": "GetSamplesRequest",
                "dataSourceAddress": {
                    "resourceType": "DataSourceAddress",
                    "did": deviceID,
                    "locationId": locationId,
                    //   "variableName": {
                    //       "resourceType": "VariableName",
                    //       "name": "assetUtilization"
                    //    }
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
    process.exit();
}

processArgs();