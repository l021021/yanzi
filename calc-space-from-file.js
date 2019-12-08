/*
从 log-sapce-history-to-file 产生的文件中计算占用数据,精确到分

TODO:移植算法

*/
const FS = require('fs')
var str
var json
var recordObj = {
    type: '',
    Did: '',
    timeStamp: '',
    value: ''
}

var t1 = new Date()
var t2 = new Date()
var t1m = new Date()
var t0 = new Date()
var t2m = new Date()
var timeArray = []
var motionTimeStamps = []
// var _timeObj
var timeObj = {
    ID: '',
    timeStamp: '',
    value: ''
}

var minDiff, t1ToNext, PrevTot2

var lastValue = -1
const c = console.log
FS.readFile('UUID-17B30675BC5849C2AD81F2448E772705_2019_11_08_0_00_00_2019_11_08_23_59_59.json', 'utf-8', function (err, data) {
    if (err) {
        return err
    }
    str = data.toString()
    str = str.replace(/\]\[/gi, ',') // change ][ to , which was caused by consecutive packets

    json = JSON.parse(str)
    c(JSON.stringify(json))
})

for (var i = 0; i < json.length; i++) {
    c('receiving ' + json.sampleListDto.list.length + ' lists') // json.sampleListDto.list.length json.sampleListDto.dataSourceAddress.variableName.name

    // Process records
    var temprecordObj
    switch (json.sampleListDto.dataSourceAddress.variableName.name) { // json.sampleListDto.list[0].resourceType  json.sampleListDto.list[0].sampleTime  json.sampleListDto.list[0].value
        case 'motion':
            for (let index = 1; index < json.sampleListDto.list.length; index++) {
                lastValue = json.sampleListDto.list[index - 1].value // update new value ,if the first ,take -1
                recordObj.type = json.sampleListDto.list[index].resourceType
                recordObj.Did = json.sampleListDto.dataSourceAddress.did
                recordObj.timeStamp = json.sampleListDto.list[index].sampleTime
                if (lastValue !== json.sampleListDto.list[index].value) { // Value changed!
                    recordObj.value = 'in'
                    temprecordObj = JSON.parse(JSON.stringify(recordObj))
                    motionTimeStamps.push(temprecordObj)
                } else if (lastValue === json.sampleListDto.list[index].value) { // Value unchanged!
                    recordObj.value = 'ot'
                    temprecordObj = JSON.parse(JSON.stringify(recordObj))
                    motionTimeStamps.push(temprecordObj)
                } else { // do not write to recordarray
                    c('        Sensor first seen, cannot tell')
                };
            }
            break
        case 'unitState':
            // json.sampleListDto.list[0].assetState.name 'free'
            // json.sampleListDto.list[0].sampleTime 'mili'

            for (let index = 0; index < json.sampleListDto.list.length; index++) {
                // lastValue = json.sampleListDto.list[index - 1].value // update new value ,if the first ,take -1
                recordObj.type = json.sampleListDto.list[index].resourceType // json.sampleListDto.list[1].assetState.resourceType
                recordObj.Did = json.sampleListDto.dataSourceAddress.did
                recordObj.timeStamp = json.sampleListDto.list[index].sampleTime
                if (json.sampleListDto.list[index].assetState.name === 'occupied') { //
                    recordObj.value = 'in'
                    temprecordObj = JSON.parse(JSON.stringify(recordObj))
                    motionTimeStamps.push(temprecordObj)
                } else if (json.sampleListDto.list[index].assetState.name === 'free') { // Value unchanged!
                    recordObj.value = 'ot'
                    temprecordObj = JSON.parse(JSON.stringify(recordObj))
                    motionTimeStamps.push(temprecordObj)
                } else {
                    recordObj.value = 'ms'
                    temprecordObj = JSON.parse(JSON.stringify(recordObj))
                    motionTimeStamps.push(temprecordObj)
                };
            }
            break
        case 'EventDTO':
            // c('    ' + _Counter + '#    Event DTO : ' + json.list[0].eventType.name)
            break
        default:
            c('!!!! cannot understand this rsourcetype ' + json.list[0].resourceType)
    }
}

// json[0].assetState.name

// json[0].sampleTime
