/**
 * @author doudou
 */
const http = require("http")
const fs = require("fs")
const opn = require("opn")
var port = 3881
var ClipServer = function(){
    function anlysisUrl(url){
        if(url == "/"){
            return "/index.html"
        }
        return url;
    }
    function saveFile(saveObj,callback){
        let data =saveObj.data;
        let name = saveObj.name;
        let dirName = saveObj.fileName
        if(!name){
            name = Date.now();
        }
        let dirPath = "./" + dirName;
        let path = dirPath +"/" + name + '.png';
        fs.exists(dirPath,(hasFile)=>{
            let fun = ()=>{
                data = data.toString("utf-8")
                var base64Data = data.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = Buffer.from(base64Data, 'base64');
                fs.writeFile(path,dataBuffer,callback)
                console.log("保存图片",path)
            }
            if(!hasFile){
                fs.mkdir(dirPath,fun);
            } else {
                fun();
            }
        })
    }
    let server = http.createServer((req,res)=>{
        let m = req.method;
        var chunk = "";
       if(m == "POST"){
            let url = anlysisUrl(req.url);
            if(url.indexOf("save") > -1){
                req.on("data", (data)=>{
                    chunk+=data;
                })
                req.on("end", ()=>{
                    data = chunk.toString("utf-8");
                    let obj = JSON.parse(data)
                    saveFile(obj,()=>{
                        res.write(`${obj.name}`)
                        res.end();
                    })
                })
            }
        }else if(m == "GET"){
            let url = "./public"+anlysisUrl(req.url)
            fs.readFile(url,(err,data)=>{
                if(err){
                    res.write("no search file")
                } else {
                    res.write(data)
                }
                res.end();
            })
        } 
    })
    function listen(s,port){
        server.on("error",function(e){
            if(e.code == "EADDRINUSE"){
                let path = "http://localhost:" + port;
                console.log("端口号" + port +"被占用 或应用已打开")
                console.log("正在启动页面")
                console.log(path)
                opn(path)
            } else {
                console.log(e)
            }
        })
        s.listen(port,(err)=>{
            console.log('工具启动成功')
            let path = "http://localhost:" + port;
            opn(path)
            console.log(path)
        })
    }
    listen(server,port);
    return server;
}
ClipServer();
