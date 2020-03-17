/**
 * @author doudou
 */
const http = require("http")
const fs = require("fs")
const opn = require("opn")
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
    }).listen(3881,()=>{
        console.log('服务器启动成功')
        console.log("http://localhost:3881")
        opn("http://localhost:3881")
    })
    return server;
}
ClipServer();
