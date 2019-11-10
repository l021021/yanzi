var WebSocketClient = require('websocket').client;

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production
var username = "653498331@qq.com";
var password = "000000";

//A flag to indicate which stage the session was in
//var sessionstage = "getlocations";
//Set up Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var locationId = "229349" //Usually a 6 digit number
var deviceID = "EUI64-0080E10300056EB7-3-Temp" //Found in Yanzi Live, ends with "-Temp"

// ################################################

// Create a web socket client initialized with the options as above
var client = new WebSocketClient();

var Counter = 0;

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
        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
            console.log(Counter + ' recieved message type:' + json.messageType);
            Counter = Counter + 1;
            if (json.messageType == 'ServiceResponse') {
                console.log("ServiceRequest succeeded, sending LoginRequest");
                sendLoginRequest();
            } else if (json.messageType == 'LoginResponse') {
                //LoginRequest
                if (json.responseCode.name == 'success') {
                    console.log("LoginRequest succeeded, let's get some data...");
                    sendGetLocationsRequest();
                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't login, check your username and passoword");
                    connection.close();
                }
            } else if (json.messageType == 'GetLocationsResponse') {
                //GetLocationsRequest
                if (json.responseCode.name == 'success') {
                    //   console.log("rcvd :  location  " + JSON.stringify(json));
                    //UPDATE location IDs
                    // console.log(JSON.stringify(json.list));
                    if (JSON.stringify(json.list) != '[]') {
                        //console.log(json.timeSent);
                        console.log(json.list[0].locationAddress.locationId);
                        // console.log(json.list[0].timeCreated);
                        sendSubscribeRequest(json.list[0].locationAddress.locationId);
                        sendSubscribeRequest_lifecircle(json.list[0].locationAddress.locationId);
                    }

                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't get location");
                    connection.close();
                }
            } else if (json.messageType == 'GetSamplesResponse') {
                if (json.responseCode.name == 'success') {
                    console.log("Yaaaay, temperaturedata in abundance!");
                    console.log(json.sampleListDto.list);
                    connection.close();
                } else {
                    console.log("Couldn't get samples.");
                    connection.close();
                }
            } else if (json.messageType == 'SubscribeData') {
                if (json.list[0].resourceType == 'Samplelist') {
                    console.log(Counter + ' ' + JSON.stringify(json));
                    //    if (JSON.stringify(json.list) != '[]' && json.list[0].dataSourceAddress.variableName.name != null) {
                    //Counter = Counter + 1;
                    // console.log('Subscribed Data : ' + json.list[0].dataSourceAddress.variableName.name.toString());
                    if (json.list[0].dataSourceAddress.variableName.name == 'motion') {
                        //           console.log(JSON.stringify(json.list));
                        //           console.log(JSON.stringify(json.list[0].SampleMotion));
                        console.log('ID:' + json.list[0].dataSourceAddress.did + ' Sampled: ' + json.list[0].list[0].sampleTime + ' counter: ' + json.list[0].list[0].value +
                            ' Last detected: ' + json.list[0].list[0].timeLastMotion);


                        //       }
                    }
                }
            } else if (json.messageType == 'GetUnitsResponse') {
                if (json.responseCode.name == 'success') {
                    console.log("Yaaaay, temperaturedata in abundance!");
                    console.log(json.sampleListDto.list);
                    connection.close();
                } else {
                    console.log("Couldn't get samples.");

                    connection.close();
                }
            } else if (json.messageType == 'PeriodicResponse') {
                sendPeriodicRequest();
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
            //    console.log('sending' + JSON.stringify(json));
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

    function sendGetLocationsRequest() {
        var now = new Date().getTime();
        //var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {
            "messageType": "GetLocationsRequest",
            "timeSent": now
        }
        sendMessage(request);
    }

    function sendGetSamplesRequest() {
        var now = new Date().getTime();
        var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {
            "messageType": "GetSamplesRequest",
            "dataSourceAddress": {
                "resourceType": "DataSourceAddress",
                "did": deviceID,
                "locationId": locationId,
                "variableName": {
                    "resourceType": "VariableName",
                    "name": "temperatureC"
                }
            },
            "timeSerieSelection": {
                "resourceType": "TimeSerieSelection",
                "timeStart": nowMinusOneHour,
                "timeEnd": now
            }
        };
        sendMessage(request);
    }

    function sendGetUnitsRequest() {
        var now = new Date().getTime();
        var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {

            "messageType": "GetUnitsRequest",
            "timeSent": now,
            "locationAddress": {
                "resourceType": "LocationAddress",
                "locationId": locationID,
            }
        }

        sendMessage(request);
    }



    function sendSubscribeRequest(location_ID) {
        var now = new Date().getTime();
        //   var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {
            "messageType": "SubscribeRequest",
            "timeSent": now,
            "unitAddress": {
                "resourceType": "UnitAddress",
                "locationId": location_ID,
            },
            "subscriptionType": {
                "resourceType": "SubscriptionType",
                "name": "data" //data   |  lifecircle  |  config
            }
        }

        sendMessage(request);
    }

    function sendSubscribeRequest_lifecircle(location_ID) {
        var now = new Date().getTime();
        //   var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {
            "messageType": "SubscribeRequest",
            "timeSent": now,
            "unitAddress": {
                "resourceType": "UnitAddress",
                "locationId": location_ID,
            },
            "subscriptionType": {
                "resourceType": "SubscriptionType",
                "name": "lifecircle" //data   |  lifecircle  |  config
            }
        }

        sendMessage(request);
    }

    function sendPeriodicRequest() {
        var now = new Date().getTime();
        var nowMinusOneHour = now - 60 * 60 * 1000;
        var request = {
            "messageType": "PeriodicRequest",
            "timeSent": now
        };
        sendMessage(request);
    }




});

function beginTOLL() {
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

beginTOLL();