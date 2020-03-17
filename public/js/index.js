var menu = document.getElementById('menu')
var myMenu = document.getElementById("contextmenu")
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cavnasClickStatus = null;
var elastic = new Elastic();
var contextmenuPoint = new Point();
var cmdArr = [];
var cmdStack = [];
var fileName = "";
var target;
window.onload = initContextMenu();
update();



canvas.addEventListener("mousedown",(e)=>{
    if(e.button == 0){
        elastic.clear();
        cavnasClickStatus = 1;
        elastic.setStartPoint(e.clientX+window.scrollX,e.clientY+window.scrollY)
    } else if(e.button == 1){
        // e.preventDefault();
    }
})
canvas.addEventListener("mousemove",(e)=>{
    if(e.button == 0){
        if(cavnasClickStatus == 1){
            cavnasClickStatus = 2;
        }
        if(cavnasClickStatus == 2){
            elastic.setEndPoint(e.clientX+window.scrollX,e.clientY+scrollY)
        }
    }
})
canvas.addEventListener("mouseup",(e)=>{
    if(e.button == 0){
        elastic.setEndPoint(e.clientX+window.scrollX,e.clientY+scrollY);
        if(elastic.isRight()){
            cmdArr.push(new ChoseRect(elastic,target))
        } else {
            elastic.clear();
        }
        cavnasClickStatus = 3;
    }
})
function initContextMenu(){
    document.addEventListener("contextmenu",function(e){
        e.preventDefault();
        myMenu.style.visibility = "visible";
        myMenu.style.display = "block";
        //获取鼠标视口位置
        let y = e.clientY +window.scrollY;
        let x = e.clientX +window.scrollX
        myMenu.style.top = y + "px";
        myMenu.style.left = x + "px";
        contextmenuPoint.x = x;
        contextmenuPoint.y = y;
        elastic.clear();
    })
    document.addEventListener("click",()=>{
        myMenu.style.visibility = "hidden";
        contextmenuPoint.x = null;
        contextmenuPoint.y = null;
    })
}

function reset(){
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    menu.hidden = false;
    clearTarget();
}
function cancel(){
    if(cmdStack.length){
        let cmd = cmdStack.pop();
        cmd.restore();
    }
    elastic.clear();
}
function downloadImg(){
    let index = target.checkPointInRect(contextmenuPoint.x,contextmenuPoint.y);
    let dataURL = target.saveRectByIndex(index);
    this.saveToServer(dataURL,index)
}
function saveToServer(dataURL,name){
    let data = {
        type:"image",
        name:"a_"+name,
        data:dataURL,
        fileName:fileName
    }
    data = JSON.stringify(data);
    SaveNet.saveFile(data,()=>{
    })
}
function downloadAllImg(){
    let data = target.data;
    let length = data.length;
    for(let i = 0;i<length;i++){
        let dataURL = target.saveRectByIndex(i);
        this.saveToServer(dataURL,i);
    }
}
function loadPng(input){
    var file = input.files[0];
    fileName = file.name.replace(".png","")
    input.value = null;
    var reader = new FileReader();
    reader.onload = function(e){
        let texture = e.target.result;
        menu.hidden = true;
        let img = new Image();
        img.onload = ()=>{
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0,img.width,img.height)
            let imgPix =ctx.getImageData(0,0,img.width,img.height);
            let tool = new AltasTool(ctx);
            let clipTool = new ClipTool();
            clipTool.init(imgPix);
            tool.data = clipTool.getAllImgData();
            tool.img = img;
            target = tool;

            clipTool.dispose();
        }
        img.src = texture;
    }
    reader.readAsDataURL(file);
}
function drawRect(ctx,top,bottom,left,right,color){
    ctx.beginPath();
    ctx.moveTo(left,top);
    ctx.strokeStyle = color || "#ff0000";
    ctx.lineTo(right,top)
    ctx.lineTo(right,bottom)
    ctx.lineTo(left,bottom)
    ctx.lineTo(left,top)
    ctx.stroke();
}
function drawElastic(){
    let left = elastic.startPoint.x;
    let top = elastic.startPoint.y;
    let right = elastic.endPoint.x;
    let bottom = elastic.endPoint.y;
    if(left != null && top != null && right != null && bottom != null){
        drawRect(ctx,top,bottom,left,right,"#0000ff");
    }
}
function clearTarget(){
    target.dispose();
    target = null;
}
function update(){
    if(target && target.isActive()){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
        target.update();
        drawElastic();
        while(this.cmdArr.length){
            let cmd = cmdArr.shift();
            cmd.exe();
            cmdStack.push(cmd);
        }
    }
    requestAnimationFrame(()=>{
        update();
    })
}