class ChoseRect{
    constructor(data,target){
        this.targetImgObj;
        this.otherImgObj;
        this.data = data;
        this.target = target;
    }
    exe(){
        let elastic = this.data;
        let left = elastic.startPoint.x;
        let top = elastic.startPoint.y;
        let right = elastic.endPoint.x;
        let bottom = elastic.endPoint.y;
        let data = this.target.margeImg(left,top,right,bottom)
        this.targetImgObj = data[0]
        this.otherImgObj = data[1].reverse();
    }
    restore(){
        let data = this.target.data;
        let t = data[this.targetImgObj.index]
        let imgObj = this.targetImgObj;
        t.top = imgObj.top;
        t.bottom = imgObj.bottom;
        t.left = imgObj.left;
        t.right = imgObj.right;
        this.otherImgObj.forEach((item)=>{
            let index = item.index;
            data.splice(index,0,item.target);            
        })
    }
}