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

const tenDay = 8640000;
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

var t1 = new Date();
var t2 = new Date();
var t1m = new Date();
var t0 = new Date();
var t2m = new Date();
var timeArray = new Array();
var timeObj = {
    "ID": '',
    "timeStamp": '',
    "value": ''
}

var minDiff, t1toNext, PrevTot2;

//处理一下 record，每一个ID分开成一个Array

var motionTimeStamps = new Array();
var id = 'EUI64-0080E1030005453A-4-Motion';

var lastValue = -1;

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

    for (let i = 1; i < motionTimeStamps.length; i++) {
        console.log('循环处理数据,这是第:' + i);


        t1.setTime(motionTimeStamps[i - 1].timeStamp); //前一个事件时间
        t1.setMilliseconds(0); //得到整秒
        t1m.setTime(motionTimeStamps[i - 1].timeStamp); //t1m：前一个事件的整分
        t1m.setMilliseconds(0);
        t1m.setSeconds(0); //得到整分

        t2.setTime(motionTimeStamps[i].timeStamp); //当前事件时间
        t2.setMilliseconds(0); //得到整秒
        t2m.setTime(motionTimeStamps[i].timeStamp);
        t2m.setMilliseconds(0);
        t2m.setSeconds(0); //second=0
        timeObj.ID = motionTimeStamps[i].Did;

        //得到分钟差和秒数零头

        minDiff = Math.floor((t2m - t1m) / 60 / 1000); //整分差
        t1ToNext = 60 - t1.getSeconds(); //前面的零头秒数
        PrevTot2 = t2.getSeconds(); //后面的零头秒数

        console.log('seeing  ' + t1.toLocaleTimeString() + '-前  ' + t1m.toLocaleTimeString() + '整  ' + minDiff + ' 分 ' + t1ToNext + '前 ' + PrevTot2 + ' 后  ' + t2.toLocaleTimeString() + '-后  ' + t2m.toLocaleTimeString());

        if (motionTimeStamps[i - 1].value == 'in') { //全部=1
            console.log('--is a ' + motionTimeStamps[i - 1].value)

            console.log("头尾在一分钟内? " + (t1m == t2m) ? true : False);

            if (t1m >= t2m) {
                console.log("头尾在同样的一分钟");
                t1ToNext = (t1ToNext + PrevTot2 - 60); ///计算缝隙
                PrevTot2 = 0; //计算头部即可
            }

            t0.setTime(t1m.getTime()); //前一整分

            let _RecordExist = false; //记录不存在
            let _ExistValue = 0;

            for (const key in timeArray) { //already exits in Array?
                if (timeArray[key].timeStamp == t0.toLocaleTimeString()) {
                    console.log('----这一分存在！增加头部的数值' + t0.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]))
                    _RecordExist = true;
                    //_ExistValue = timeArray[key].value;
                    timeArray[key].value += t1ToNext / 60; //增加新的占用
                    break;
                }
            }

            if (!_RecordExist) { //这一分不存在
                timeObj.timeStamp = t0.toLocaleTimeString();
                timeObj.value = t1ToNext / 60;
                var _timeObj = JSON.parse(JSON.stringify(timeObj));
                timeArray.push(_timeObj); //增加记录
                console.log('----这一分不存在！头部加入新记录：' + t0.toLocaleTimeString())

            }

            { //tail会重复？
                t0.setTime(t2m.getTime()); //tail
                for (const key in timeArray) { //already exits in Array?
                    if (timeArray[key].timeStamp == t0.toLocaleTimeString()) {
                        console.log('----这一分存在！增加尾部数值  ' + t0.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(motionTimeStamps[i]))
                        _RecordExist = true;
                        timeArray[key].value += PrevTot2 / 60;
                        break;
                    }
                }

                if (!_RecordExist) {
                    timeObj.timeStamp = t2m.toLocaleTimeString();
                    timeObj.value = PrevTot2 / 60;
                    var _timeObj = JSON.parse(JSON.stringify(timeObj));
                    timeArray.push(_timeObj);
                    console.log('----这一分不存在，加入新尾部记录：' + t2m.toLocaleTimeString());
                }

            }

            //process middle 
            let j = 1;
            console.log('----准备加入中部记录?');
            while (j < minDiff) {
                t0.setTime(t1m.getTime() + j * 60 * 1000); //下一分
                timeObj.timeStamp = t1m.toLocaleTimeString();
                timeObj.value = 1;

                var _timeObj = JSON.parse(JSON.stringify(timeObj));
                timeArray.push(_timeObj);
                console.log('------加入中部记录：' + t0.toLocaleTimeString());
                j++

            }


        } else { //全部标0

            console.log('--is a ' + motionTimeStamps[i - 1].value);

            console.log("头尾在一分钟内? " + (t1m == t2m) ? true : False);

            if (t1m >= t2m) {
                console.log("头尾在相同的一分钟");
                t1ToNext = (t1ToNext + PrevTot2 - 60); ///计算缝隙
                PrevTot2 = 0; //计算头部即可

            } else {
                console.log('not same')
            };

            t0.setTime(t1m); //Previous
            let _RecordExist = false;

            for (const key in timeArray) { //already exits in Array?
                if (timeArray[key].timeStamp == t0.toLocaleTimeString()) {
                    console.log('----这一分存在！头部原值不变 ' + t0.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(motionTimeStamps[i]))
                    _RecordExist = true;
                    _ExistValue = timeArray[key].value;
                    break;
                }
            }

            if (!_RecordExist) { //这一分不存在
                timeObj.timeStamp = t0.toLocaleTimeString();
                timeObj.value = 0;

                var _timeObj = JSON.parse(JSON.stringify(timeObj));
                timeArray.push(_timeObj); //增加记录
                console.log('----这一分不存在！头部加入新记录：' + t0.toLocaleTimeString())

            }

            { //tail会重复？
                t0.setTime(t2m); //tail

                for (const key in timeArray) { //already exits in Array?
                    if (timeArray[key].timeStamp == t0.toLocaleTimeString()) {
                        console.log('----这一分存在！尾部原值不变 ' + t0.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(motionTimeStamps[i]))
                        _RecordExist = true;
                        // _ExistValue = timeArray[key].value;
                        break
                    }
                }
                //do nothing
                if (!_RecordExist) {
                    timeObj.timeStamp = t2m.toLocaleTimeString();
                    timeObj.value = 0;
                    var _timeObj = JSON.parse(JSON.stringify(timeObj));
                    timeArray.push(_timeObj);
                    console.log('----不存在，加入新尾部记录：' + t2m.toLocaleTimeString());
                }
            }
        }
        //process middle 
        let j = 1;
        console.log('----准备加入中部记录：');
        while (j < minDiff) {
            t0.setTime(t1m.getTime() + j * 60 * 1000);
            timeObj.timeStamp = t0.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
            console.log('------加入中部记录：' + t0.toLocaleTimeString());
            j++

        }

    }


    //console.log(JSON.stringify(timeArray))

    // timeArray.sort(function (a, b) {
    //     //if (a.ID > b.ID) { return true } else
    //     if (a.timeStamp > b.timeStamp) {
    //         return true
    //     };
    //     return false;

    // });

    console.log('timearray:');

    for (let i = 0; i < timeArray.length; i++) {
        const element = timeArray[i];

        if (!element.ID || !element.timeStamp) continue;
        console.log(element.ID + ' @ ' + element.timeStamp + ' = ' + element.value + '')

    };
    process.exit();
}

beginPoll();