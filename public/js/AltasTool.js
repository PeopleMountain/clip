class AltasTool{
    constructor(ctx){
        this.ctx = ctx;
        this.img;
        this.data;
        this.copyCanvas = document.createElement("canvas");
    }
    isActive(){
        return !!this.data;
    }

    saveRectByIndex(i){
        let data = this.data[i]
        let ctx = this.copyCanvas.getContext("2d");
        let width = data.right +1 - data.left;
        let height = data.bottom +1 - data.top;
        this.copyCanvas.width = width;
        this.copyCanvas.height = height;
        ctx.drawImage(this.img,-data.left,-data.top,this.img.width,this.img.height)
        return this.copyCanvas.toDataURL("image/png")
    }
    drawRect(){
        let r = this.data;
        r.forEach((item)=>{
            drawRect(this.ctx,item.top,item.bottom,item.left,item.right)
        })
    }
    drawImage(){
        let img = this.img;
        this.ctx.drawImage(img,0,0,img.width,img.height)
    }
    update(){
        this.drawImage();
        this.drawRect();
    }
    dispose(){
        this.ctx = null;
        this.img = null;
        this.data = null;
    }
    /**检测点在某一个矩形内 */
    checkPointInRect(x,y){
        let index = this.data.findIndex((item)=>{
            if(item.top < y 
                && item.bottom > y
                && item.left < x
                && item.right > x){
                    return true;
                }
        })
        return index;
    }
    /**检测是否在某矩形内 */
    margeImg(startX,startY,endX,endY){
        let target;
        let mateTarget;
        let changeImgArr = [];
        let dataArr = this.data;
        for(let i = 0;i<dataArr.length;i++){
            let item = dataArr[i];
            if(!(item.bottom < startY
                || item.right < startX
                || item.top > endY
                || item.left > endX))
            {
                if(!target){
                    target = item;
                    mateTarget = {
                        top:target.top,
                        bottom:target.bottom,
                        left:target.left,
                        right:target.right,
                        index:i
                    }
                    continue;
                }
                target.concat(item)
                dataArr.splice(i,1)
                changeImgArr.push({
                    index:i,
                    target:item
                })
                i--;
            }
        }
        if(!target)
            return;
        startX = target.left;   //懒得优化
        startY = target.top;
        endX = target.right;
        endY = target.bottom; 
        for(let i = 0;i<dataArr.length;i++){
            let item = dataArr[i];
            if(item == target){
                mateTarget.index = i;
                continue
            }

            if(!(item.bottom < startY
                || item.right < startX
                || item.top > endY
                || item.left > endX))
            {
                target.concat(item)
                dataArr.splice(i,1)
                changeImgArr.push({
                    target:item,
                    index:i
                })
                i--;
            }
        }
        return [mateTarget,changeImgArr]
    }
}