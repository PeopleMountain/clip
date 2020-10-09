var SaveNet ={
    address: "http://localhost:3881/save",
    saveFile:function(data,callback){
        let url = this.address;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    callback(xhr.responseText);
                } else {
                    console.warn('err')
                }
            }
        }
        
        xhr.responseType = "text"
        xhr.open("post",url,true)
        xhr.send(data)
    }
}