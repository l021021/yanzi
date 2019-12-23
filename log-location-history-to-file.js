/* eslint-disable no-fallthrough */
/* eslint-disable eqeqeq */
// 列出所有的Location已经其下的传感器;可能需要几分钟才能收全

var WebSocketClient = require('websocket').client
const fs = require('fs')

var cirrusAPIendpoint = 'cirrus11.yanzi.se'

var username = 'frank.shen@pinyuaninfo.com'
var password = 'Internetofthing'
const locationId = '229349' // fangtang
const startDate = '2019/11/01/15:00:00'
const endDate = '2019/11/01/16:59:59'
var c = console.log

const dataFile = fs.createWriteStream('./' + locationId + '_' + startDate.replace(/[/:]/gi, '_') + '_' + endDate.replace(/[/:]/gi, '_') + '.json', { encoding: 'utf8' })

// var username = "653498331@qq.com";
// var password = "000000";

// ################################################

// For log use only
var _Counter = 0 // message counter
var _OnlineUnitsCounter = 0
var _Locations = []
var _Units = []
var TimeoutId = setTimeout(doReport, 10000)
    // Create a web socket client initialized with the options as above
var client = new WebSocketClient()

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

// Program body
client.on('connectFailed', function(error) {
    console.log('Connect Error: reconnect' + error.toString())
    beginPOLL()
})

client.on('connect', function(connection) {
    // console.log("Checking API service status with ServiceRequest.");
    sendServiceRequest()

    // Handle messages
    connection.on('message', function(message) {
            clearTimeout(TimeoutId)
            TimeoutId = setTimeout(doReport, 10000) // exit after 10 seconds idle
            console.log('timer reset  ')

            if (message.type === 'utf8') {
                var json = JSON.parse(message.utf8Data)
                var t = new Date().getTime()
                var timestamp = new Date()
                timestamp.setTime(t)
                _Counter = _Counter + 1 // counter of all received packets

                // Print all messages with type
                console.log(_Counter + '# ' + timestamp.toLocaleTimeString() + ' RCVD_MSG:' + json.messageType)
                switch (json.messageType) {
                    case 'ServiceResponse':
                        sendLoginRequest()
                        break
                    case 'LoginResponse':
                        if (json.responseCode.name == 'success') {
                            // sendPeriodicRequest() // as keepalive
                            // sendGetLocationsRequest() // not mandatory
                            sendGetUnitsRequest(locationId) // get units from location
                                // sendSubscribeRequest(LocationId); //test one location
                                // sendSubscribeRequest_lifecircle(LocationId); //eventDTO
                        } else {
                            console.log(json.responseCode.name)
                            console.log("Couldn't login, check your username and passoword")
                            connection.close()
                            process.exit()
                        }
                        break
                    case 'GetLocationsResponse':

                        break
                    case 'GetSamplesResponse':
                        if (json.responseCode.name === 'success' && json.sampleListDto.list) {
                            c('receiving ' + json.sampleListDto.list.length + ' lists') // json.sampleListDto.list.length json.sampleListDto.dataSourceAddress.variableName.name

                            logStream.write(JSON.stringify(json.sampleListDto.list)) // log very lists to file

                            // Process records
                        } else {
                            c('no samples.')
                        }
                } else {
                    c("Couldn't understand")
                    connection.close()
                }

                break
                case 'GetUnitsResponse':
                    if (json.responseCode.name == 'success') {
                        // console.log(JSON.stringify(json) + '\n\n');

                        var _tempunitObj

                        console.log('seeing ' + json.list.length + ' in  ' + json.locationAddress.locationId)
                        for (let index = 0; index < json.list.length; index++) { // process each response packet
                            if (json.list[index].unitTypeFixed.name == 'gateway' || json.list[index].unitAddress.did.indexOf('AP') != -1) { // console.log(json.list[index].unitAddress.did);
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
                                    // if (json.list[index].lifeCycleState.name == 'present') {
                                    //     _OnlineUnitsCounter++
                                    // }
                            };
                        }

                        // console.log(_UnitsCounter + ' Units in Location:  while ' + _OnlineUnitsCounter + ' online');
                    } else {
                        console.log("Couldn't get Units")
                    }

                    break
                case 'PeriodicResponse':
                    // setTimeout(sendPeriodicRequest, 60000)
                    // console.log(_Counter + '# ' + "periodic response-keepalive");
                    break
                case 'SubscribeResponse':

                case 'SubscribeData':

                default:
                    console.log('!!!! cannot understand')
                        // connection.close();
                    break
            }
        }
    })

connection.on('error', function(error) {
    console.log('Connection Error: reconnect' + error.toString())
    beginPOLL()
})

connection.on('close', function() {
    console.log('Connection closed!')
})

function sendMessage(message) {
    if (connection.connected) {
        // Create the text to be sent
        var json = JSON.stringify(message, null, 1)
            //    console.log('sending' + JSON.stringify(json));
        connection.sendUTF(json)
    } else {
        console.log("sendMessage: Couldn't send message, the connection is not open")
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

function sendGetLocationsRequest() {
    var now = new Date().getTime()
        // var nowMinusOneHour = now - 60 * 60 * 1000;
    var request = {
        messageType: 'GetLocationsRequest',
        timeSent: now
    }
    sendMessage(request)
}

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

function sendPeriodicRequest() {
    var now = new Date().getTime()
    var request = {
        messageType: 'PeriodicRequest',
        timeSent: now
    }
    sendMessage(request)
}
})

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

function beginPOLL() {
    client.connect('wss://' + cirrusAPIendpoint + '/cirrusAPI')
        // console.log("Connecting to wss://" + cirrusAPIendpoint + "/cirrusAPI using username " + username);
}

function doReport() {
    var output = ''
    var t = new Date().getTime()
    var timestamp = new Date()
    timestamp.setTime(t)
    console.log('Reporting：')
    console.log(timestamp.toLocaleTimeString() + '')
        // sorting
    _Locations.sort(function(a, b) {
        var x = a.locationId
        var y = b.locationId
        if (x > y) return 1
        if (x < y) return -1
        return 0
    })
    _Units.sort(function(a, b) {
        var x = a.locationId
        var y = b.locationId
        if (x > y) return 1
        if (x < y) return -1
        return 0
    })

    // record all  Locations

    for (const key in _Locations) {
        output += _Locations[key].locationId + ' or ' + _Locations[key].name + '\n'
    }
    console.log('total ' + _Locations.length + ' locations: \n' + output) // print all locations with name
    console.log('total ' + _Units.length + ' Units: \n') // print all Units with name

    // match sensor to locations
    for (let i = 0; i < _Units.length; i++) { // TODO: for each could be wrong
        for (let j = 0; j < _Locations.length; j++) { // update to its locations
            if (_Locations[j].locationId == _Units[i].locationId) { // Location match
                _Locations[j].Allunits++
                    if (_Units[i].lifeCycleState == 'present') { // mark live gateways
                        _Locations[j].gwOnline = true // Location Online
                        _Locations[j].Onlineunits++ // mark online sensors
                    }
                if (_Units[i].isChassis == 'true') {
                    _Locations[j].units++
                } // mark physical sensors
                break // 跳出循环
            }
        }
    }

    // list each active location with sensors
    for (let j = 0; j < _Locations.length; j++) { // TODO：for each
        if (_Locations[j].gwOnline) { console.log('' + _Locations[j].locationId + '-' + _Locations[j].name + ' is online  with ' + _Locations[j].Onlineunits + ' active sensors, ' + _Locations[j].Allunits + ' logical') }
    }
    console.log('total ' + _Units.length + ' logical sensors live while ' + _OnlineUnitsCounter + ' sensors online') // sum up

    // //list all online physical sensors
    // for (let j = 0; j < _Units.length; j++) {
    //     if (_Units[j].lifeCycleState == 'present')
    //         console.log(_Units[j].did + ' in ' + _Units[j].locationId);
    // }

    // //list all online logical  sensors
    // for (let j = 0; j < _Units.length; j++) {
    //     if (_Units[j].lifeCycleState == 'subUnit' && _Units[j].isChassis == false)
    //         console.log(_Units[j].did + ' as a ' + _Units[j].type + ' in ' + _Units[j].locationId);
    // }

    // _Units.forEach(function (x, i, a) {
    //     if (a[1].lifeCycleState == 'subUnit' && a[i].isChassis == false) console.log(_Units[key1].did + ' as a ' + _Units[key1].type + ' in ' + _Units[key1].locationId);

    // });
    t = new Date().getTime()
    timestamp = new Date()
    timestamp.setTime(t)
    console.log(timestamp.toLocaleTimeString() + 'ok!')
    clearTimeout(TimeoutId)
    process.exit()
}

beginPOLL()