var WebSocketClient = require('websocket').client;

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production

//var username = "653498331@qq.com";
//var username = "bruce.li@sugarinc.cn";
//var password = "000888";
var username = "frank.shen@pinyuaninfo.com";
var password = "Internetofthing";

//Location ID and Device ID, please change this to your own, can be found in Yanzi Live
//var LocationId = '229349' //fangtang 
var LocationId = '60358' //1003
    // var LocationId = '797296' //novah 
var deviceID = "EUI64-0080E10300056EB7-3-Temp" //Found in Yanzi Live, ends with "-Temp"

// ################################################

//For log use only
var _Counter = 0; //message counter
var _logLimit = 3000; //will exit when this number of messages has been logged
var _t1 = new Date();
var _t2 = new Date();
var _t3 = new Date();
var _units = new Array();
var _Locations = [];


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
        console.log(_Counter + '# ' + ' RCVD_MSG:' + message.type + ' :' + message.utf8Data.length);
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

                process.exit();
            } //for log use only

            // Print all messages with DTO type
            // console.log(_Counter + '# ' + timestamp.toLocaleTimeString() + ' RCVD_MSG:' + json.messageType);
            switch (json.messageType) {
                case 'ServiceResponse':
                    sendLoginRequest();
                    break;
                case 'LoginResponse':
                    if (json.responseCode.name == 'success') {
                        sendPeriodicRequest(); //as keepalive
                        //sendGetLocationsRequest();// not mandatory 
                        //sendSubscribeRequest(LocationId); //test
                        sendGetUnitsRequest(LocationId);
                        //sendSubscribeRequest_lifecircle(json.list[i].locationAddress.locationId);
                        //sendSubscribeRequest_lifecircle(LocationId); //eventDTO

                    } else {
                        console.log(json.responseCode.name);
                        console.log("Couldn't login, check your username and passoword");
                        connection.close();
                        process.exit();
                    }
                    break;
                case 'GetLocationsResponse':
                    if (json.responseCode.name == 'success') {
                        console.log(_Counter + '# rcvd :  location  ' + JSON.stringify(json));
                        //UPDATE location IDs
                        if (json.list.length != 0) {
                            for (var i = 0; i < json.list.length; i++) {
                                if (!_Locations.includes(json.list[i].locationAddress.locationId)) {
                                    _Locations.push(json.list[i].locationAddress.locationId);
                                    //sendSubscribeRequest(json.list[i].locationAddress.locationId);
                                    sendSubscribeRequest(LocationId); //test
                                    //sendSubscribeRequest_lifecircle(json.list[i].locationAddress.locationId);
                                    sendSubscribeRequest_lifecircle(LocationId); //eventDTO
                                }
                            }
                        }
                    } else {
                        console.log(json.responseCode.name);
                        console.log("Couldn't get location");
                        connection.close();
                        process.exit();
                    }
                    break;
                case 'GetSamplesResponse':
                    //GetSamplesResponse
                    if (json.responseCode.name == 'success') {
                        console.log("Yaaaay, temperaturedata in abundance!");
                        console.log(json.sampleListDto.list);
                        connection.close();
                    } else {
                        console.log("Couldn't get samples.");
                        connection.close();
                    }

                    break;
                case 'GetUnitsResponse':
                    if (json.responseCode.name == 'success') {
                        var _UnitsCounter = 0;
                        var _OnlineUnitsCounter = 0;

                        //setTimeout(sendGetUnitsRequest, 30000);
                        for (let index = 0; index < json.list.length; index++) {
                            if (json.list[index].isChassis) {
                                console.log(json.list[index].chassisDid,
                                    json.list[index].isChassis,
                                    json.list[index].lifeCycleState.name,

                                );
                                _units.push(json.list[index].chassisDid);
                                _UnitsCounter++;
                                if (json.list[index].lifeCycleState.name == 'present') {
                                    _OnlineUnitsCounter++;
                                }
                            }
                        }
                        console.log(_UnitsCounter + " Units in Location: " + LocationId + ' while ' + _OnlineUnitsCounter + ' online');

                    } else {
                        console.log("Couldn't get Units");
                    }

                    break;
                case 'PeriodicResponse':
                    setTimeout(sendPeriodicRequest, 60000);
                    console.log(_Counter + '# ' + "periodic response-keepalive");
                    break;
                case 'SubscribeResponse':
                    var now = new Date().getTime();
                    setTimeout(sendGetLocationsRequest, json.expireTime - now);
                    _t1.setTime(json.expireTime);
                    console.log("susbscribe renew in (min)： " + (json.expireTime - now) / 60000); //100min
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
                                    var motionFlag = ' ? '; //update new value 
                                    sensorArray[json.list[0].dataSourceAddress.did] = json.list[0].list[0].value;
                                    if (temp1 == (json.list[0].list[0].value - 1)) { //Value changed!
                                        console.log("motion!");
                                        motionFlag = ' + ';
                                        motionTimeStamps = motionTimeStamps + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","in":"' + _t1.toLocaleTimeString() + '"},';
                                    } else if (temp1 == json.list[0].list[0].value) {
                                        console.log("no motion!");
                                        motionFlag = ' - ';
                                        motionTimeStamps = motionTimeStamps + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","ot":"' + _t1.toLocaleTimeString() + '"},';

                                    } else {
                                        console.log("first seen! cannot tell");
                                    };


                                    console.log(_Counter + '# ' + _t3.toLocaleTimeString() + ' Motion ' + json.list[0].dataSourceAddress.did + motionFlag +
                                        _t1.toLocaleTimeString() + ' # ' + json.list[0].list[0].value +
                                        ' Last: ' + _t2.toLocaleTimeString() + ' static：(s) ' +
                                        (json.list[0].list[0].sampleTime - json.list[0].list[0].timeLastMotion) / 1000);
                                    break;
                                case 'assetUtilization': //SampleUtilization
                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' AsstUT ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() +
                                        ' free:' + json.list[0].list[0].free + ' occupied:' + json.list[0].list[0].occupied);
                                    break;
                                case 'unitState': //sampleAsset free occupied ismotion isnomotion

                                    //algorithm based on SampleAsset；

                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    //    var temp1 = sensorArray[json.list[0].dataSourceAddress.did];
                                    var motionFlag = ' ? '; //update new value 
                                    //     sensorArray[json.list[0].dataSourceAddress.did] = json.list[0].list[0].value;
                                    switch (json.list[0].list[0].assetState.name) {

                                        case 'isMotion':
                                            console.log("motion");
                                            assetTimeStamps1 = assetTimeStamps1 + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","mo":"' + _t3.toLocaleTimeString() + '"},';
                                            break;
                                        case 'isNoMotion':

                                            console.log("nomotion");
                                            assetTimeStamps1 = assetTimeStamps1 + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","nm":"' + _t3.toLocaleTimeString() + '"},';
                                            break;
                                        case 'free':
                                            console.log("nomotion");
                                            assetTimeStamps2 = assetTimeStamps2 + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","fr":"' + _t3.toLocaleTimeString() + '"},';
                                            break;
                                        case 'occupied':
                                            console.log("occupy");
                                            assetTimeStamps2 = assetTimeStamps2 + '{"ID":' + '"' + json.list[0].dataSourceAddress.did + '","oc":"' + _t3.toLocaleTimeString() + '"},';
                                            break;
                                        default:
                                            break;
                                    };
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' SMPAST ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() + '  ' +
                                        json.list[0].list[0].assetState.name);
                                    break;
                                case 'percentage': //SamplePercentage
                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' PCTAGE ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() +
                                        ' Occu%:' + json.list[0].list[0].value);
                                    break;
                                case 'uplog':
                                    _t2.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' ' + json.list[0].dataSourceAddress.did + ' ' + json.list[0].list[0].resourceType);

                                    break;
                                case 'volatileOrganicCompound':
                                case 'temperatureK':
                                case 'relativeHumidity':
                                case 'pressure':
                                case 'soundPressureLevel':
                                case 'illuminance':
                                case 'carbonDioxide':
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t3.toLocaleTimeString() + ' Envrmt ' + json.list[0].dataSourceAddress.did + ' ' + json.list[0].list[0].resourceType + ' ' + json.list[0].list[0].value);
                                    break;
                                default:
                                    console.log(_Counter + '# ' + "Sample List Other " + json.list[0].dataSourceAddress.variableName.name);
                            }
                            break;
                        case 'EventDTO':
                            //console.log('   Event DTO : ' + json.list[0].eventType.name);
                            switch (json.list[0].eventType.name) {
                                case 'newUnAcceptedDeviceSeenByDiscovery':
                                case 'physicalDeviceIsNowUP':
                                case 'physicalDeviceIsNowDOWN':
                                case 'remoteLocationGatewayIsNowDOWN':
                                case 'remoteLocationGatewayIsNowUP':
                                    _t2.setTime(json.list[0].timeOfEvent);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' EVENTS' + json.list[0].unitAddress.did + ' ' + json.list[0].eventType.name);
                                    break;
                                default:
                                    console.log('    Event DTO : ' + json.list[0].eventType.name);
                            }
                            break;
                        default:
                    }
                    break;

                default:
                    console.log("Unknown message type!!!! cannot understand");
                    //connection.close();
                    break;
            }

        } else { console.log("No UTF， cannot understand"); }
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
                "locationId": LocationId,
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