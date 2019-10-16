var WebSocketClient = require('websocket').client;

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production
//var username = "bruce.li@sugarinc.cn";
//var password = "000888";

var username = "653498331@qq.com";

var password = "000000";

//Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var locationId = "229349" //Usually a 6 digit number
var deviceID = "EUI64-0080E10300056EB7-3-Temp" //Found in Yanzi Live, ends with "-Temp"

// ################################################

//For log use only
var _Counter = 1;
var _t1 = new Date();
var _t2 = new Date();
var _t3 = new Date();

var _Locations = [];

// Create a web socket client initialized with the options as above
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    connection.close();
});

client.on('connect', function(connection) {
    // console.log('Websocket open!');
    console.log("Checking API service status with ServiceRequest.");
    sendServiceRequest();

    // Handle messages
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
            var t = new Date().getTime();
            var timestamp = new Date();
            timestamp.setTime(t);
            _Counter = _Counter + 1;
            // console.log(timestamp.toLocaleTimeString() + ' RCVD_MSG:' + _Counter + '# ' + json.messageType);

            if (json.messageType == 'ServiceResponse') {
                //ServiceRequest
                console.log("ServiceRequest succeeded, sending LoginRequest");
                sendLoginRequest();
            } else if (json.messageType == 'LoginResponse') {
                //LoginRequest
                if (json.responseCode.name == 'success') {
                    console.log("LoginRequest succeeded!");
                    setTimeout(sendPeriodicRequest, 30000); //keepalive
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
                    if (json.list.length != 0) {
                        for (var i = 0; i < json.list.length; i++) {

                            if (!_Locations.includes(json.list[i].locationAddress.locationId)) {
                                _Locations.push(json.list[i].locationAddress.locationId);
                                //sendSubscribeRequest(json.list[i].locationAddress.locationId);
                                sendSubscribeRequest("229349");
                                console.log('requesting: ' + json.list[i].locationAddress.locationId);
                                //sendSubscribeRequest_lifecircle(json.list[i].locationAddress.locationId);

                            }
                        }
                    }
                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't get location");
                    connection.close();
                }
            } else if (json.messageType == 'GetSamplesResponse') {
                //GetSamplesResponse
                if (json.responseCode.name == 'success') {
                    console.log("Yaaaay, temperaturedata in abundance!");
                    console.log(json.sampleListDto.list);
                    connection.close();
                } else {
                    console.log("Couldn't get samples.");
                    connection.close();
                }
            } else if (json.messageType == 'SubscribeData') {
                //SubscribeData
                // console.log(json.list[0].resourceType)
                if (json.list[0].resourceType == 'SampleList') {
                    //DATA
                    //console.log(Counter + ' ' + JSON.stringify(json));
                    //    if (JSON.stringify(json.list) != '[]' && json.list[0].dataSourceAddress.variableName.name != null) {
                    //Counter = Counter + 1;
                    // console.log('Subscribed Data : ' + json.list[0].dataSourceAddress.variableName.name.toString());
                    if (json.list[0].dataSourceAddress.variableName.name == 'motion') {
                        //Motion

                        _t1.setTime(json.list[0].list[0].sampleTime);
                        _t2.setTime(json.list[0].list[0].timeLastMotion);
                        if (json.list[0].list[0].sampleTime - json.list[0].list[0].timeLastMotion < 100000) {
                            console.log('Move! ' + json.list[0].dataSourceAddress.did + ' @ ' +
                                _t1.toLocaleTimeString() + ' # ' + json.list[0].list[0].value +
                                ' Last: ' + _t2.toLocaleTimeString() + ' static_for(s) ' +
                                (json.list[0].list[0].sampleTime - json.list[0].list[0].timeLastMotion) / 1000);
                        }

                    } else if (true)
                    // none motion sensor data
                    {}
                } else if (json.list[0].resourceType == 'EventDTO')
                //life circle data
                {
                    switch (json.list[0].eventType.name) {
                        case 'newUnAcceptedDeviceSeenByDiscovery':
                            console.log(_Counter + " Sensor detected !");
                            break;
                        case 'physicalDeviceIsNowUP':
                            console.log(_Counter + " Sensor up !");
                            break;
                        case 'physicalDeviceIsNowDOWN':
                            console.log(_Counter + " Sensor down !");
                            break;
                        case 'remoteLocationGatewayIsNowDOWN':
                            console.log(_Counter + " Gateway down !");
                            break;
                        case 'remoteLocationGatewayIsNowUP':
                            console.log(_Counter + " Gateway up !");
                            break;
                        case 'physicalDeviceIsNowDOWN':
                            console.log(_Counter + " Sensor down !");
                            break;

                        default:
                            console.log(_Counter + json.list[0].eventType.name);
                    }
                }

            } else if (json.messageType == 'GetUnitsResponse') {
                //GetUnitsResponse
                if (json.responseCode.name == 'success') {
                    console.log("Yaaaay, temperaturedata in abundance!");
                    console.log(json.sampleListDto.list);
                    connection.close();
                } else {
                    console.log("Couldn't get samples.");

                    connection.close();
                }
            } else if (json.messageType == 'PeriodicResponse') {
                //PeriodicResponse
                setTimeout(sendPeriodicRequest, 10000);
            } else if (json.messageType == 'SubscribeResponse') //Subscribe renewal
            {
                setTimeout(sendGetLocationsRequest, 6000000); //100min
            } else {
                //others: do not process
                console.log("Couldn't understand");
                //connection.close();
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

function beginPOLL() {
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

beginPOLL();