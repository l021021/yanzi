/*
从 log-sapce-history-to-file 产生的文件中计算占用数据,精确到分

*/
const FS = require('fs')
var str
var json
const c = console.log
FS.readFile('UUID-17B30675BC5849C2AD81F2448E772705_2019_11_08_0_00_00_2019_11_08_23_59_59.json', 'utf-8', function(err, data) {
    if (err) {
        return err
    }
    str = data.toString()
    str = str.replace(/\]\[/gi, ',')

    json = JSON.parse(str)
    c(JSON.stringify(json))
})

for (var i = 0; i < json.length)

//json[0].assetState.name

//json[0].sampleTime