const path = require("path")
const BASE_PATH = "./public/js/"
module.exports = {
    entry:[
        BASE_PATH + 'jszip.min.js'
        ,BASE_PATH + 'FileSaver.js'
        ,BASE_PATH + 'Point.js'
        ,BASE_PATH + 'Elastic.js'
        ,BASE_PATH + 'JszipTool.js'
        ,BASE_PATH + 'AltasTool.js'
        ,BASE_PATH + 'cmd.js'
        ,BASE_PATH + 'clip.js'
        ,BASE_PATH + 'index.js'
],
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"bundle.js"
    }
}