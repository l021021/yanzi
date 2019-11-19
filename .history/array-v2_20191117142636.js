//处理逻辑：一分钟切片
//每一分钟 ：12:01:00 有一个对应的占用 0-1，比如0.5 :代表50%的利用率
//算法:每一个时间戳看前一个： 当前占用-前一个占用，标记为100%
// 当前占用 前一个空闲 标记为0
// 当前空闲 均标记为0
// 标记举例 1:01.11 in 1:05:44 in
//         1:01:00 49/60 
//         1:02:00 1 
//         1:03:00 1 
//         1:04:00 1 
//         1:05:00 1 
//         标记举例 1:01.11 out 1:05:44 in
//         1:01:00 0 
//         1:02:00 0 
//         1:03:00 0 
//         1:04:00 0 
//         1:05:00 16/60


var RecordArray;
RecordArray = [{
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800169356,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800187785,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800193759,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800200187,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800235327,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800235357,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800237766,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800246845,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800260737,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800268210,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800269725,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800271957,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800301336,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800303202,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800304213,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800320331,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800343563,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800344112,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800345080,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800362922,
    "value": "ot"
}, {
    "type": "samplemotion",
    "Did": "EUI64-D0CF5EFFFE793057-3-Motion",
    "timeStamp": 1573800376392,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800377419,
    "value": "in"
}, {
    "type": "samplemotion",
    "Did": "EUI64-90FD9FFFFEA9505A-3-Motion",
    "timeStamp": 1573800415527,
    "value": "in"
}]

//console.log(RecordArray);
var t1 = new Date();
var t2 = new Date();
var t1m = new Date();
var timeArray = new Array();
var timeObj = {
    "ID": '',
    "timeStamp": '',
    "value": ''
}
//var t1s = new Date();
var t = new Date();
var t2m = new Date();
//t2s = new Date();

//处理一下 record，每一个ID分开成一个Array
var minDiff, t1toNext, PrevTot2;

var sArray = new Array();
var id = 'EUI64-90FD9FFFFEA9505A-3-Motion';


//var recordArraybyId = new Array();

for (let i = 0; i < RecordArray.length; i++) {

    if (id == RecordArray[i].Did) {
        sArray.push({
            "Did": id,
            "timeStamp": RecordArray[i].timeStamp,
            "value": RecordArray[i].value
        });
    }

}
// sArray = RecordArray.groupby("EUI64 - 90 FD9FFFFEA9505A - 3 - Motion");

for (let i = 1; i < sArray.length; i++) {

    t1.setTime(sArray[i - 1].timeStamp); //前一个事件时间
    t1.setMilliseconds(0); //得到整秒
    t1m.setTime(sArray[i - 1].timeStamp); //t1m：前一个事件的整分
    t1m.setMilliseconds(0);
    t1m.setSeconds(0); //得到整分

    t2.setTime(sArray[i].timeStamp); //当前事件时间
    t2.setMilliseconds(0); //得到整秒
    t2m.setTime(sArray[i].timeStamp);
    t2m.setMilliseconds(0);
    t2m.setSeconds(0); //second=0
    timeObj.ID = sArray[i].Did;

    //得到分钟差和秒数零头

    minDiff = Math.floor((t2m - t1m) / 60 / 1000); //整分差
    t1ToNext = 60 - t1.getSeconds(); //前面的零头秒数
    PrevTot2 = t2.getSeconds(); //后面的零头秒数

    console.log('seeing  ' + t1.toLocaleTimeString() + '-前  ' + t1m.toLocaleTimeString() + '整  ' + minDiff + ' 分 ' + t1ToNext + '前 ' + PrevTot2 + ' 后  ' + t2.toLocaleTimeString() + '-后  ' + t2m.toLocaleTimeString());

    if (sArray[i - 1].value == 'in') { //全部=1
        console.log('--is a in' + sArray[i - 1].value)

        console.log("same min"+(t1m-t2m)?;
        
        if (t1m == t2m) {

            console.log("same min");
            t1ToNext = (t1ToNext + PrevTot2 - 60);///计算缝隙
            PrevTot2 = 0; //计算头部即可

        }
        t.setTime(t1m); //前一整分

        let _RecordExist = false; //记录不存在
        let _ExistValue = 0;

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                console.log('----这一分存在！加头部的数值' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]))

                _RecordExist = true;
                //_ExistValue = timeArray[key].value;
                timeArray[key].value += t1ToNext / 60; //增加新的占用


                break;
            }


        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = t1ToNext / 60;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录
            console.log('----这一分不存在！头部加入记录：' + t.toLocaleTimeString())

        }

        { //tail会重复？
            t.setTime(t2m); //tail
            for (const key in timeArray) { //already exits in Array?

                if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                    console.log('----这一分存在！加尾部数值  ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
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

                console.log('----不存在，加入新尾部记录：' + t2m.toLocaleTimeString());
            }

        }

        //process middle 
        let j = 1;
        console.log('----加入中部记录：');
        while (j < minDiff) {
            t1m.setTime(t1m.getTime + j * 60 * 1000);
            timeObj.timeStamp = t1m.toLocaleTimeString();
            timeObj.value = 1;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj);
            // timeArray.push(t1m.toLocaleTimeString(), 1);
            j++
            console.log('------加入中部记录：' + t1m.toLocaleTimeString());
        }


    } else { //全部标0

        console.log('--is out ' + sArray[i - 1].value);
        t.setTime(t1m); //Previous

        let _RecordExist = false;

        if (t1m == t2m) {
            t1ToNext = (t1ToNext + PrevTot2 - 60);///计算缝隙
            PrevTot2 = 0; //计算头部即可

        }

        for (const key in timeArray) { //already exits in Array?

            if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                console.log('----这一分存在！头部原值不变 ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
                _RecordExist = true;
                _ExistValue = timeArray[key].value;
                break;
            }

            //do nothing
        }
        if (!_RecordExist) { //这一分不存在
            timeObj.timeStamp = t.toLocaleTimeString();
            timeObj.value = 0;

            var _timeObj = JSON.parse(JSON.stringify(timeObj));
            timeArray.push(_timeObj); //增加记录
            console.log('----这一分不存在！头部加入新记录：' + t.toLocaleTimeString())

        }

        { //tail会重复？
            t.setTime(t2m); //tail

            for (const key in timeArray) { //already exits in Array?

                if (timeArray[key].timeStamp == t.toLocaleTimeString()) {

                    console.log('----这一分存在！尾部原值不变 ' + t.toLocaleTimeString() + '   ' + JSON.stringify(timeArray[key]) + '  ' + JSON.stringify(sArray[i]))
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
    console.log('----加入中部记录：');
    while (j < minDiff) {
        t1m.setTime(t1m.getTime + j * 60 * 1000);
        timeObj.timeStamp = t1m.toLocaleTimeString();
        timeObj.value = 0;

        var _timeObj = JSON.parse(JSON.stringify(timeObj));
        timeArray.push(_timeObj);
        console.log('----加入中部记录：' + t1m.toLocaleTimeString());
        // timeArray.push(t1m.toLocaleTimeString(), 1);
        j++

    }

}


console.log(JSON.stringify(timeArray))

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