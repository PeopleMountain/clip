function JszipTool(){

}
JszipTool.prototype.saveFile = function(name,type="png",imgData){
    let dataURL = imgData.replace("image/png", "image/octet-stream");
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = dataURL;
    save_link.download = name +"." + type;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
}

JszipTool.prototype.saveFileArr = function(arr,callback){
    var zip = new JSZip();
    for(let i = 0;i<arr.length;i++){
        let item = arr[i]
        let imgData = item.data;
        imgData = imgData.replace(/^data:image\/\w+;base64,/, "");
        zip.file(item.name+"."+"png", imgData,{base64: true});
    }
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        let name = arr[0].fileName + ".zip"
        saveAs(content, name);
        callback(name)
    });
}
