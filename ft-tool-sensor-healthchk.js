var WebSocketClient = require('websocket').client;

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production

//var username = "653498331@qq.com";
var username = "bruce.li@sugarinc.cn";
var password = "000888";


//Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var LocationId = '229349' //fangtang 


// ################################################

//For log use only
var _Counter = 0; //message counter
var _logLimit = 300; //will exit when this number of messages has been logged
var _t1 = new Date();
var _t2 = new Date();
var _t3 = new Date();

var _Locations = [];
var sensorArray = new Array();
var motionTimeStamps = '';
var assetTimeStamps1 = '';
var assetTimeStamps2 = '';



// Create a web socket client initialized with the options as above
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    connection.close();
});

client.on('connect', function(connection) {
    //console.log("Checking API service status with ServiceRequest.");
    sendServiceRequest();
    // Handle messages
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
            var t = new Date().getTime();
            var timestamp = new Date();
            timestamp.setTime(t);
            _Counter = _Counter + 1; //counter of all received packets

            if (_Counter > _logLimit) {
                console.log("Enough Data, I will quit now!")
                connection.close();
                var output = "";    
                for (var key in sensorArray) {
                    if (output == "") {
                        output = sensorArray[key];      
                    }      
                    else {
                        output += "|" + sensorArray[key];      
                    }
                } // do some report before exit

                // console.log(sensorArray.toString());
                console.log(output);
                console.log(motionTimeStamps.toString());
                console.log(assetTimeStamps1.toString());
                console.log(assetTimeStamps2.toString());
                process.exit();
            } //for log use only

            // Print all messages with DTO type
            //console.log(_Counter + '# ' + timestamp.toLocaleTimeString() + ' RCVD_MSG:' + json.messageType);
            switch (json.messageType) {
                case 'ServiceResponse':
                    sendLoginRequest();
                    break;
                case 'LoginResponse':
                    if (json.responseCode.name == 'success') {
                        sendPeriodicRequest(); //as keepalive
                        //sendGetLocationsRequest();// not mandatory 
                        sendSubscribeRequest(LocationId); //test
                        //sendSubscribeRequest_lifecircle(json.list[i].locationAddress.locationId);
                        sendSubscribeRequest_lifecircle(LocationId); //eventDTO

                    } else {
                        console.log(json.responseCode.name);
                        console.log("Couldn't login, check your username and passoword");
                        connection.close();
                        process.exit();
                    }
                    break;
                case 'PeriodicResponse':
                    setTimeout(sendPeriodicRequest, 60000);
                    // console.log(_Counter + '# ' + "periodic response-keepalive");
                    break;
                case 'SubscribeResponse':
                    var now = new Date().getTime();
                    setTimeout(sendGetLocationsRequest, json.expireTime - now);
                    //_t1.setTime(json.expireTime);
                    //console.log("susbscribe renew in (min)： " + (json.expireTime - now) / 60000); //100min
                    break;

                case 'SubscribeData':
                    switch (json.list[0].resourceType) {
                        case 'SampleList':
                            //Sensor DATA
                            switch (json.list[0].dataSourceAddress.variableName.name) {
                                case 'motion': //sampleMotion
                                    _t1.setTime(json.list[0].list[0].sampleTime);
                                    _t2.setTime(json.list[0].list[0].timeLastMotion); //sensor motion-detected time
                                    _t3.setTime(json.timeSent); //packet sent 

                                    //algorithm based on SampleMotion；
                                    var temp1 = sensorArray[json.list[0].dataSourceAddress.did];
                                    // var motionFlag = ' ? '; //update new value 
                                    if (temp1 == null) {
                                        sensorArray[json.list[0].dataSourceAddress.did] = 1;
                                        console.log(_Counter + '# ' + timestamp.toLocaleTimeString() + ' RCVD_MSG:' + json.messageType);
                                    } else {
                                        sensorArray[json.list[0].dataSourceAddress.did] = sensorArray[json.list[0].dataSourceAddress.did] + 1;
                                    };
                                    break;
                                case 'assetUtilization': //SampleUtilization
                                    break;
                                case 'unitState':
                                    break;
                                case 'percentage': //SamplePercentage
                                    break;
                                case 'uplog':
                                    break;
                                case 'volatileOrganicCompound':
                                case 'temperatureK':
                                case 'relativeHumidity':
                                case 'pressure':
                                case 'soundPressureLevel':
                                case 'illuminance':
                                case 'carbonDioxide':
                                    break;
                                default:
                                    console.log(_Counter + '# ' + "Other " + json.list[0].dataSourceAddress.variableName.name);
                            }
                            break;
                        case 'EventDTO':
                            break;
                        default:
                    }
                    break;

                default:
                    console.log("!!!! cannot understand");
                    //connection.close();
                    break;
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
    //console.log("Connecting to wss://" + cirrusAPIendpoint + "/cirrusAPI using username " + username);
}

beginPOLL();