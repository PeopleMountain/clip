const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const BASE_PATH = "./public/js/"
module.exports = {
    mode:"development",
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
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html",
            title:"拆图小工具",
            filename:"index.html"
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    resolve:{
        
    },
    devServer:{
        host:"localhost",
        port:3000
    }
}