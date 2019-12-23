/* eslint-disable camelcase */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-redeclare */
/*
首先拉回历史数据dtolist,根据counter推测in 还是 ot,写入motionstamp数组;
counter+1就是in,反之ot,否则抛弃;
根据motionstamp数组来结算占用;得到time数组

TODO:有个数据先来后到的问题,所以需要先把DTO存起来排序,再进行处理.

*/

var WebSocketClient = require('websocket').client
const fs = require('fs')

var cirrusAPIendpoint = 'cirrus11.yanzi.se'
var username = '653498331@qq.com'
var password = '000000'
var client = new WebSocketClient()
var connection
var c = console.log
var locationId = '229349' // fangtang

const startDate = '2019/11/01/15:00:00'
const endDate = '2019/11/01/16:59:59'

var TimeoutId = setTimeout(doReport, 30000)

// const tenDay = 8640000;
const _12Hour = 43200000
var motionTimeStamps = []
var DTO = []
var DTO1 = []

var DTOs = []
DTOs[0] = DTO
DTOs[1] = DTO1
const logStream = fs.createWriteStream('./' + locationId + '_' + startDate.replace(/[/:]/gi, '_') + '_' + endDate.replace(/[/:]/gi, '_') + '.json', { encoding: 'utf8' })

// 文件有关
logStream.on('error', (err) => {
    console.log('发生异常:', err)
})
logStream.on('open', (fd) => {
    console.log('文件已打开:', fd)
})
logStream.on('finish', () => {
    console.log('写入已完成..')
})
logStream.on('close', () => {
        console.log('文件已关闭！')
    })
    // var t1 = new Date()
    // var t2 = new Date()
    // var t1m = new Date()
    // var t0 = new Date()
    // var t2m = new Date()
    // var timeArray = []
    //     // var _timeObj
    // var timeObj = {
    //     ID: '',
    //     timeStamp: '',
    //     value: ''
    // }

var _Units = []

var unitObj = {
    did: '',
    locationId: '',
    serverDid: '',
    productType: '',
    lifeCycleState: '',
    isChassis: '',
    chassisDid: '',
    nameSetByUser: '',
    type: ''

}

client.on('connectFailed', function(error) {
    c('Connect Error: ' + error.toString())
    connection.close()
})

client.on('connect', function(connection) {
    c('Websocket open!')
    c('Checking API service status with ServiceRequest.')
    sendServiceRequest()

    // Handle messages
    connection.on('message', function(message) {
        clearTimeout(TimeoutId)
        TimeoutId = setTimeout(doReport, 30000)

        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data)
        }

        if (json.messageType === 'ServiceResponse') {
            c('ServiceRequest succeeded, sending LoginRequest')
            sendLoginRequest()
        } else if (json.messageType === 'LoginResponse') {
            if (json.responseCode.name === 'success') {

            } else {
                c(json.responseCode.name)
                c("Couldn't login, check your username and passoword")
                connection.close()
            }
        } else if (json.messageType === 'GetUnitsResponse') {
            if (json.responseCode.name === 'success') {
                // console.log(JSON.stringify(json) + '\n\n');

                var _tempunitObj

                console.log('seeing ' + json.list.length + ' in  ' + json.locationAddress.locationId)
                for (let index = 0; index < json.list.length; index++) { // process each response packet
                    if (json.list[index].unitTypeFixed.name === 'gateway' || json.list[index].unitAddress.did.indexOf('AP') != -1) { // console.log(json.list[index].unitAddress.did);
                        console.log('GW or AP in ' + json.locationAddress.locationId) // GW and AP are not sensor
                    } else {
                        // record all sensors
                        unitObj.did = json.list[index].unitAddress.did //
                        unitObj.locationId = json.locationAddress.locationId
                        unitObj.chassisDid = json.list[index].chassisDid
                        unitObj.productType = json.list[index].productType
                        unitObj.lifeCycleState = json.list[index].lifeCycleState.name
                        unitObj.isChassis = json.list[index].isChassis
                        unitObj.nameSetByUser = json.list[index].nameSetByUser
                        unitObj.serverDid = json.list[index].unitAddress.serverDid

                        unitObj.type = json.list[index].unitTypeFixed.name

                        // console.log(json.list[index].unitTypeFixed.name + '\n\n');

                        _tempunitObj = JSON.parse(JSON.stringify(unitObj))
                        _Units.push(_tempunitObj)
                            // _UnitsCounter++;

                        if (unitObj.type === 'inputMotion' || unitObj.Did.indexOf('UUID') > 0) { sendGetSamplesRequest(unitObj.did, startDate, endDate) }
                    }
                };
            }

            // console.log(_UnitsCounter + ' Units in Location:  while ' + _OnlineUnitsCounter + ' online');
        } else {
            console.log("Couldn't get Units")
        }
    })

    connection.on('error', function(error) {
        c('Connection Error: ' + error.toString())
    })

    connection.on('close', function(error) {
        c('Connection closed!' + error.message)
    })

    function sendMessage(message) {
        if (connection.connected) {
            // Create the text to be sent
            var json = JSON.stringify(message, null, 1)
                // c('sending' + JSON.stringify(json));
            connection.sendUTF(json)
        } else {
            c("sendMessage: Couldn't send message, the connection is not open")
        }
    }

    function sendServiceRequest() {
        var request = {
            messageType: 'ServiceRequest',
            clientId: 'client-fangtang'
        }
        sendMessage(request)
    }

    function sendLoginRequest() {
        var request = {
            messageType: 'LoginRequest',
            username: username,
            password: password
        }
        sendMessage(request)
    }

    function sendGetSamplesRequest(deviceID, timeStart_mili, timeEnd_mili) {
        if (timeStart_mili > timeEnd_mili) {
            c('Wrong Date.')
            return null
        }
        if (timeEnd_mili - timeStart_mili >= _12Hour) {
            var request = {
                messageType: 'GetSamplesRequest',
                dataSourceAddress: {
                    resourceType: 'DataSourceAddress',
                    did: deviceID,
                    locationId: locationId
                },
                timeSerieSelection: {
                    resourceType: 'TimeSerieSelection',
                    timeStart: timeStart_mili,
                    timeEnd: timeStart_mili + _12Hour
                }
            }
            sendMessage(request)
            c('requesting : ' + request.timeSerieSelection.timeStart)
            sendGetSamplesRequest(
                deviceID,
                timeStart_mili + _12Hour,
                timeEnd_mili
            )
        } else {
            var request = {
                messageType: 'GetSamplesRequest',
                dataSourceAddress: {
                    resourceType: 'DataSourceAddress',
                    did: deviceID,
                    locationId: locationId
                },
                timeSerieSelection: {
                    resourceType: 'TimeSerieSelection',
                    timeStart: timeStart_mili,
                    timeEnd: timeEnd_mili
                }
            }
            c('requesting : ' + request.timeSerieSelection.timeStart)
            sendMessage(request)
        }
    }
})

function sendGetUnitsRequest(locationID) {
    var now = new Date().getTime()
    var request = {

        messageType: 'GetUnitsRequest',
        timeSent: now,
        locationAddress: {
            resourceType: 'LocationAddress',
            locationId: locationID
        }
    }
    console.log('sending request for ' + locationID)
    sendMessage(request)
}

function beginPoll() {
    if (!username) {
        console.error('The username has to be set')
        return
    }
    if (!password) {
        console.error('The password has to be set')
        return
    }
    client.connect('wss://' + cirrusAPIendpoint + '/cirrusAPI')
    c(
        'Connecting to wss://' +
        cirrusAPIendpoint +
        '/cirrusAPI using username ' +
        username
    )
}

function doReport() {
    // logStream.end()
    logStream.close()
    process.exit()
}

beginPoll()