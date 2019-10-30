//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";
var WebSocketClient = require('websocket').client;
// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production

//var username = "653498331@qq.com";
//var password = "000000";

var username = "bruce.li@sugarinc.cn";
var password = "000888";

//Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var LocationId = '229349' //Usually a 6 digit number 
var deviceID = "EUI64-0080E10300056EB7-3-Temp" //Found in Yanzi Live, ends with "-Temp"

// ################################################

//For log use only
var _Counter = 0; //message counter
var _logLimit = 5000; //will exit when this number of messages has been logged
var _t1 = new Date();
var _t2 = new Date();
var _t3 = new Date();

var _Locations = [];

var accountObj = {
    "resourceType": "",
    "userId": "",
    "systemUserAcl": {
        "resourceType": "",
        "name": ""
    }
}

var locationObj = {
    //"timeCreated": 1569232419461,
    //"locationAddress": {
    //  "resourceType": "LocationAddress",
    // "timeCreated": 1569232419461,
    "locationId": "123456",
    "serverDid": "EUI64-0090DAFFFF0040A9",
    // },
    // "timeModified": 1569232419761,
    "accountId": "262468578",
    "name": "Beach House",
    "gwdid": "EUI64-12411261342",
    "multiLocationParent": "991579",
    "isMultiLocation": false,
    //"propertyList": [{
    // "resourceType": "PropertyDTO",
    //   "name": 
    "activityLevel": "medium"

}

var sampleObj = {
    // "resourceType":"SampleList",
    // "dataSourceAddress":{
    // "resourceType":"DataSourceAddress",
    //  "timeCreated":1569232419466,
    "did": "EUI64-0080E10300099999-3-Humd",
    "locationId": "123456",
    // "variableName":{
    // "resourceType":"VariableName",
    "name": "relativeHumidity"
        //  },
        //  "instanceNumber":0
        // },"timeCreated":1569232419466,
        //  "range":{
        //  "resourceType":"Range",
        // "timeCreated":1569232419466,
        // "timeStart":1569232119466,
        // "timeEnd":1569232419466,
        // "numberOfSamples":50
        // },
        // "list":[
        // {
    "resourceType": "SampleHumidity",
    "timeCreated": 1569232419466,
    "sampleTime": 1569232419466,
    "value": 30.5,
    //  "temperature":296.45

}

var unitObj = {
    // "resourceType":"UnitDTO",
    //  "timeCreated":1569232419475,
    // "unitAddress":{
    // "resourceType":"UnitAddress",
    // "timeCreated":1569232419475,
    "did": "EUI64-0080E10300099999",
    "locationId": "123456",
    "serverDid": "EUI64-0080E10300012345"
        // },
    "productType": "09876543210987",
    "lifeCycleState": {
        "resourceType": "LifeCycleState",
        "name": "shadow"
    },
    "isChassis": true,
    "chassisDid": "0999999999999",
    "unitTypeFixed": {
        "resourceType": "UnitType",
        "name": "inputMotion"
    },
    "isNameSetByUser": true,
    "nameSetByUser": "Door's Motion",
    "defaultNameSetBySystem": "Motion-12AB",
    "userId": "giorgos@yanzi.se",
    "unitAcl": {
        "resourceType": "UnitAcl",
        "name": "operator"
    },
    "subunitIdentifier": 0

}

var susbscribeObj = {
    // "resourceType":"SampleList",
    //"dataSourceAddress":{
    // "resourceType":"DataSourceAddress",
    "timeCreated": 1569232419547,
    "did": "EUI64-0080E10300099999-3-Humd",
    "locationId": "123456",
    //  "variableName":{
    //  "resourceType":"VariableName",
    "name": "relativeHumidity"
        //   },
        //   "instanceNumber":0
        //   },
        //  "timeCreated":1569232419547,
        //  "list":[
        //  {
    "resourceType": "SampleHumidity",
    //"timeCreated":1569232419547,
    "sampleTime": 1569232419547,
    "value": 30.5
        //,"temperature":296.45
        //}
        //   ]
}


var eventObj = {
    // "resourceType":"EventDTO",
    // "timeCreated":1569232419674,
    "timeOfEvent": 1569232419674,
    // "unitAddress":{
    //  "resourceType":"UnitAddress",
    //  "timeCreated":1569232419674,
    "did": "EUI64-0080E10300099999",
    "locationId": "123456",
    "serverDid": "EUI64-0080E10300012345",
    //  },
    //  "list":[
    //  {
    "resourceType": "AcceptEntityDTO",
    //  "timeCreated":1569232419674,
    "timeWhenAccepted": 1428996894,
    "timeFirstSeen": 1569232409674,
    "acceptState": {
        "resourceType": "DeviceAcceptState",
        "name": "discovered"
    },
    //"acceptUserid":"giorgos@yanzi.se",
    // "did":"EUI64-0080E10300099999",
    // "productType":"0090DA12121212",
    //"inetAddress":"178.45.224.13",
    //"macAddress":"00-14-22-01-23-45",
    "gwdid": "EUI64-0080E10300012345",
    "locationId": "123456",
    //  }
    //  ],
    // "eventType":{"resourceType":"EventType",
    "name": "physicalDeviceIsNowUP"
}

// Create a web socket client initialized with the options as above
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: reconnect' + error.toString());
    beginPOLL();
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
                process.exit();
            } //for log use only

            // Print all messages with type
            console.log(_Counter + '# ' + timestamp.toLocaleTimeString() + ' RCVD_MSG:' + json.messageType);
            console.log(JSON.stringify(json));
            switch (json.messageType) {
                case 'ServiceResponse':
                    sendLoginRequest();
                    break;
                case 'LoginResponse':
                    if (json.responseCode.name == 'success') {
                        sendPeriodicRequest(); //as keepalive
                        sendGetLocationsRequest(); // not mandatory 
                        sendSubscribeRequest(LocationId); //test one location
                        sendSubscribeRequest_lifecircle(LocationId); //eventDTO

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
                                }
                            }
                        }
                    } else {
                        console.log(json.responseCode.name);
                        console.log("Couldn't get location");
                        connection.close();
                        process.exit();
                    }
                    sendSubscribeRequest(LocationId); //test
                    sendSubscribeRequest_lifecircle(LocationId); //eventDTO

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
                        console.log(json.sampleListDto.list);
                        connection.close();
                    } else {
                        console.log("Couldn't get samples.");

                        connection.close();
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
                                    console.log(_Counter + '# ' + _t3.toLocaleTimeString() + ' Motion ' + json.list[0].dataSourceAddress.did + ' @ ' +
                                        _t1.toLocaleTimeString() + ' # ' + json.list[0].list[0].value +
                                        ' Last: ' + _t2.toLocaleTimeString() + ' static_for(s) ' +
                                        (json.list[0].list[0].sampleTime - json.list[0].list[0].timeLastMotion) / 1000);
                                    break;
                                case 'assetUtilization': //SampleUtilization
                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' AsstUT ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() +
                                        ' free:' + json.list[0].list[0].free + ' occupied:' + json.list[0].list[0].occupied);
                                    break;
                                case 'unitState': //sampleAsset free occupied ismotion isnomotion
                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
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
                                    console.log(_Counter + '# ' + "Sample List Other parameters" + json.list[0].dataSourceAddress.variableName.name);
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
                    console.log("!!!! cannot understand");
                    //connection.close();
                    break;
            }

        }
    });

    connection.on('error', function(error) {
        console.log("Connection Error: reconnect" + error.toString());
        beginPOLL();
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