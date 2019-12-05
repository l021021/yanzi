
const FS = require('fs')
var str

FS.readFile('mylog.json', 'utf-8', function (err, data) {
    if (err) {
        return err
    }
    str = data.toString()
    str = str.replace(/\]\[/gi, ",")
    console.log(str)
    FS.writeFile('mylog1.json', str, 'utf-8', function (err) {
        if (err) return err
    })


}
)
