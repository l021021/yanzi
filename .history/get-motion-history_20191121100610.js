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

const startDate = '2019/11/1/0:00:00'
const endDate = '2019/11/11/23:59:59'



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

                    //Process records
                    switch (json.list[0].resourceType) {
                        case 'SampleList':
                            //Sensor DATA
                            //console.log('    ' + _Counter + '# ' + 'SampleList: ' + json.list[0].list[0].resourceType)
                            switch (json.list[0].list[0].resourceType) {
                                case 'SampleMotion': //sampleMotion
                                    _t1.setTime(json.list[0].list[0].sampleTime);
                                    _t2.setTime(json.list[0].list[0].timeLastMotion); //sensor motion-detected time
                                    _t3.setTime(json.timeSent); //packet sent 

                                    //algorithm based on SampleMotion；
                                    var temp1 = sensorArray[json.list[0].dataSourceAddress.did];
                                    var temprecordObj;
                                    var motionFlag = ' ?? '; //update new value 
                                    recordObj.type = 'samplemotion';
                                    recordObj.Did = json.list[0].dataSourceAddress.did
                                    recordObj.timeStamp = _t1.getTime()
                                    sensorArray[json.list[0].dataSourceAddress.did] = json.list[0].list[0].value; //setup sensor array
                                    if (temp1 == (json.list[0].list[0].value - 1)) { //Value changed!
                                        motionFlag = ' ++ ';
                                        recordObj.value = 'in'
                                        temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                        motionTimeStamps.push(temprecordObj)
                                    } else if (temp1 == json.list[0].list[0].value) {
                                        motionFlag = ' == ';
                                        recordObj.value = 'ot'
                                        temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                        motionTimeStamps.push(temprecordObj)
                                            // motionTimeStamps.push(json.list[0].dataSourceAddress.did + ',ot,' + _t1.getTime());

                                    } else { //do not record to record 
                                        //console.log("        Sensor first seen, cannot tell");
                                    };

                                    console.log('      ' + _Counter + '# ' + _t3.toLocaleTimeString() + ' SampleMotion ' + json.list[0].dataSourceAddress.did + motionFlag +
                                        _t1.toLocaleTimeString() + ' # ' + json.list[0].list[0].value +
                                        ' Last: ' + _t2.toLocaleTimeString() + ' static(s)：  ' +
                                        (json.list[0].list[0].sampleTime - json.list[0].list[0].timeLastMotion) / 1000);
                                    break;
                                case 'SampleAsset': //sampleAsset- free occupied ismotion isnomotion 

                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    var motionFlag = ' ? '; //update new value 
                                    var temprecordObj;
                                    //var motionFlag = ' ?? '; //update new value 
                                    recordObj.type = 'sampleAsset';
                                    recordObj.Did = json.list[0].dataSourceAddress.did
                                    recordObj.timeStamp = _t1.getTime()
                                    console.log('      ' + _Counter + '# ' + json.list[0].list[0].assetState.name + ' ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() + '  ' +
                                        json.list[0].list[0].assetState.name);
                                    switch (json.list[0].list[0].assetState.name) {

                                        case 'isMotion':
                                            //assetTimeStamps1 += json.list[0].dataSourceAddress.did + ',mo,' + _t3.getTime() + '\n';
                                            recordObj.value = 'mo';
                                            temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                            assetTimeStamps1.push(temprecordObj);

                                            break;
                                        case 'isNoMotion':
                                            // assetTimeStamps1 += json.list[0].dataSourceAddress.did + ',nm,' + _t3.getTime() + '\n';
                                            recordObj.value = 'nm';
                                            temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                            assetTimeStamps1.push(temprecordObj);
                                            break;
                                        case 'free':
                                            // assetTimeStamps2 += json.list[0].dataSourceAddress.did + ',fr,' + _t3.getTime() + '\n';
                                            recordObj.value = 'fr';
                                            temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                            assetTimeStamps2.push(temprecordObj);
                                            break;
                                        case 'occupied':
                                            //assetTimeStamps2 += json.list[0].dataSourceAddress.did + ',oc,' + _t3.getTime() + '\n';
                                            recordObj.value = 'oc';
                                            temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                            assetTimeStamps2.push(temprecordObj);
                                            break;
                                        case 'missingInput':
                                            // assetTimeStamps2 += json.list[0].dataSourceAddress.did + ',mi,' + _t3.getTime() + '\n';
                                            recordObj.value = 'mi';
                                            temprecordObj = JSON.parse(JSON.stringify(recordObj));
                                            assetTimeStamps2.push(temprecordObj);
                                            break;
                                        default:
                                            console.log("!!!! cannot understand assetname " + json.list[0].list[0].assetState.name);
                                            break;
                                    };

                                    break;
                                case 'SamplePercentage': //SamplePercentage
                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log('      ' + _Counter + '# ' + _t2.toLocaleTimeString() + ' SamplePercentage ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() +
                                        ' Occu%:' + json.list[0].list[0].value);
                                    break;
                                case 'SampleUtilization': //SampleUtilization

                                    _t2.setTime(json.timeSent);
                                    _t3.setTime(json.list[0].list[0].sampleTime);
                                    console.log('      ' + _Counter + '# ' + _t2.toLocaleTimeString() + ' SampleUtilization ' + json.list[0].dataSourceAddress.did + ' @ ' + _t3.toLocaleTimeString() +
                                        ' free:' + json.list[0].list[0].free + ' occupied:' + json.list[0].list[0].occupied);
                                    assetTimeStamps3 += _t2.toLocaleTimeString() + ' AsstUT ' + json.list[0].dataSourceAddress.did + ' free:' + json.list[0].list[0].free + ' occupied:' + json.list[0].list[0].occupied + '\n';

                                    break;

                                case 'SampleUpState':
                                    _t2.setTime(json.list[0].list[0].sampleTime);
                                    console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' ' + json.list[0].dataSourceAddress.did + ' ' + json.list[0].list[0].deviceUpState.name);
                                    //console.log(JSON.stringify(json));
                                    break;

                                case 'SlotDTO':
                                    console.log('      ' + _Counter + '# SlotDTO ' + json.list[0].dataSourceAddress.did + '=' + (json.list[0].list[0].maxValue + json.list[0].list[0].minValue) / 2)
                                    break;
                                case 'SampleEndOfSlot':
                                    console.log('     ' + _Counter + '# EndofDTO ' + json.list[0].dataSourceAddress.did + ' ' + json.list[0].list[0].sample.assetState.name);
                                    break;
                                case 'SampleVOC':
                                case 'SampleTemp':
                                case 'SampleHumidity':
                                case 'SamplePressure':
                                case 'SampleSoundPressureLevel':
                                case 'SampleIlluminance':
                                case 'SampleCO2':
                                    //console.log('     ' + _Counter + '# Sample ' + _t3.toLocaleTimeString() + ' ' + json.list[0].dataSourceAddress.did + ' ' + json.list[0].list[0].value);
                                    break;
                                default:
                                    console.log("!!!! cannot understand samplelist resourcetype" + json.list[0].list[0].resourceType);
                            }
                            break;
                        case 'EventDTO':
                            console.log('    ' + _Counter + '#    Event DTO : ' + json.list[0].eventType.name);
                            switch (json.list[0].eventType.name) {
                                case 'newUnAcceptedDeviceSeenByDiscovery':
                                case 'physicalDeviceIsNowUP':
                                case 'physicalDeviceIsNowDOWN':
                                case 'remoteLocationGatewayIsNowDOWN':
                                case 'remoteLocationGatewayIsNowUP':
                                    // _t2.setTime(json.list[0].timeOfEvent);
                                    // console.log(_Counter + '# ' + _t2.toLocaleTimeString() + ' EVENTS' + json.list[0].unitAddress.did + ' ' + json.list[0].eventType.name);
                                    //  break;
                                default:
                                    //console.log(_Counter + '#    Event DTO : ' + json.list[0].eventType.name);
                                    console.log("!!!! cannot understand this Event" + json.list[0].eventType.name);
                            }
                            break;
                        default:
                            console.log("!!!! cannot understand this rsourcetype " + json.list[0].resourceType);
                    }
                    break;
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
    console.log("Time is Up...")
    process.exit();
}

beginPoll();