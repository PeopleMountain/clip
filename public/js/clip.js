//总图片
class ImgManager{
    constructor(){
        this.cache = []; //缓存的图片
        this.imgArr = [] //完整图片
        this.$curRow;
    }
    dispose(){
        this.$curRow = null;
        this.cache = null;
        this.imgArr = null;
    }
    set curRow(row){
        row.data.forEach((item)=>{
            let imgObj = new ImgObj();
            imgObj.addRange(item,row.y);
            this.cache.push(imgObj)
        })
        this.$curRow = row;
    }
    get curRow(){
        return this.$curRow;
    }
    createImg(rowMgr){
        let data = rowMgr.data; 
        let y = rowMgr.y
        let newImg = [];
        let length = data.length
        for(let i = 0;i<length;i++){
            let rowItem = data[i];
            let rowItemMin = rowItem.min;
            let rowItemMax = rowItem.max;
            let imgObjIndex = [];
            for(let j = 0;j<this.cache.length;j++){
                let cacheItem = this.cache[j];
                if(cacheItem.bottom < y-1){ //图片没在本行
                    this.cache.splice(j,1);
                    this.imgArr.push(cacheItem);
                    j--;
                    continue;
                }
                if(!(rowItemMax < (cacheItem.left-1)) && !(rowItemMin > (cacheItem.right+1))){
                    imgObjIndex.push(j);
                    cacheItem.addRange(rowItem,y)
                }
            }
            if(!imgObjIndex.length){
                let imgObj = new ImgObj();
                imgObj.addRange(rowItem,y);
                newImg.push(imgObj)
            } else if(imgObjIndex.length > 1) {
                let offset = 0;
                let targetImg = this.cache[imgObjIndex[0]];
                for(let imgIndex = 1;imgIndex<imgObjIndex.length;imgIndex++){
                    let imgData = this.cache.splice(imgObjIndex[imgIndex]+offset,1)[0];
                    targetImg.concat(imgData);
                    offset--;
                }
            }
        }
        if(newImg){
            this.cache = this.cache.concat(newImg)
        }
    }
    isEnd(){
        this.imgArr = this.imgArr.concat(this.cache)
        let data = this.imgArr;
        for(let i = 0;i<data.length;i++){
            let target = data[i];
            target.rangeIndex = null;
            target.rangeArr = null;
            delete target.rangeIndex;
            delete target.rangeArr;
            if(target.top == target.bottom || target.left == target.right){
                data.splice(i,1)
                i--;
                continue;
            }
            for(let j = 0;j<data.length;j++){
                if(j == i){
                    continue
                }
                let cache = data[j];
                let isTarget = (
                    target.top > cache.bottom
                    || target.left > cache.right
                    || target.right < cache.left
                    || target.bottom < cache.top
                ) 
                let isCache = (
                    cache.top > target.bottom
                    || cache.left > target.right
                    || cache.right < target.left
                    || cache.bottom < target.top
                )
                if(!isTarget || !isCache){
                    target.concat(cache);
                    data.splice(j,1)
                    if(j<i){
                        i--;
                    }
                    j--;
                }
            }
        }
        this.cache = null;
    }
    //对下表现的图片对象
    getImgRange(){
        this.imgArr.map((item)=>{
            let top = item.bottom;
            let bottom = item.top;
            let left = item.left;
            let right = item.right;
            return [top,bottom,left,right]
        })
    }
}

//图片对象 单张图片
class ImgObj{
    constructor(){
        this.rangeIndex = [];
        this.rangeArr = [];
        this.top = -1;
        this.bottom = -1;
        this.left = -1;
        this.right = -1;
    }
    addRange(r,y){
        if(this.bottom == -1){
            this.top = y;
        }
        if(this.left==-1){
            this.left = r.min
        }
        let last = this.rangeIndex.length-1;
        let rangeIndex = this.rangeIndex[last] 
        if(rangeIndex == y && last > -1){    //同行 Y字形 同行覆盖
            let range = this.rangeArr[last]
            if(r.min < range.min){
                range.min = r.min;
            }
            if(r.max > range.max){
                range.max = r.max;
            }
        } else {    //不同行
            this.rangeIndex.push(y);
            this.rangeArr.push(r);
        }
        if(this.left > r.min){
            this.left = r.min;
        }
        if(this.right < r.max){
            this.right = r.max;
        }
        this.bottom = y;
    }
    //最靠下的表现数组
    getRange(r){
        for(let i = this.rangeIndex.length-1;i>=0;i--){
            if(this.rangeIndex[i] == r){
                return this.rangeArr[i]
            }
        }
    }
    concat(imgObj){
        this.top = Math.min(this.top,imgObj.top)
        this.bottom = Math.max(this.bottom,imgObj.bottom)
        this.left =  Math.min(this.left,imgObj.left)
        this.right = Math.max(this.right,imgObj.right)
    }
    
}
class Range{
    constructor(min,max){
        this.min = min;
        this.max = max;
    }
}
class RowMgr{
    constructor(){
        this.data = [];
        this.y;
    }
    add(min,max){
        this.data.push(new Range(min,max))
    }
    getDataByIndex(index){
        return this.data[index];
    }
    getData(){
        return this.data;
    }
}
class ClipTool{
    constructor(ctx,img){
        this.imgMgr = new ImgManager();
        this.result;
    }
    dispose(){
        this.result = null;
        this.imgMgr.dispose();
        this.imgMgr = null;
    }
    getAllImgData(){
        return this.imgMgr.imgArr
    }
    getPix(x,y){
        let data = this.allData.data;
        let index = (y*this.width + x) *4;
        return data[index+3];
    }
    init(data){
        this.width = data.width
        this.height = data.height
        this.allData = data
        this.initRowData();
        this.mergeImg();
        this.imgMgr.isEnd()
    }
    mergeImg(){
        let arr = this.result;
        let imgMgr = this.imgMgr;
        let length = arr.length;
        imgMgr.curRow = arr[0]
        for(let i = 1;i<length;i++){
            imgMgr.createImg(arr[i])
        }
    }
    initRowData(){
        let w = this.width;
        let h = this.height;
        let arr = [];
        for(let y = 0;y<h;y++){
            let min = -1;
            let max = -1;
            let rowArr = new RowMgr();
            rowArr.y = y;
            for(let x = 0;x<w;x++){
                let pix = this.getPix(x,y);
                if(pix == 0){   //透明
                    if(min != -1){ 
                        rowArr.add(min,max)
                        min = -1;
                        max = -1;
                    }
                } else {    //不透明
                    if(min == -1){
                        min = x;
                    }
                    max = x;
                    if(max == (w-1)){
                        rowArr.add(min,max)
                    }
                }
            }
            if(rowArr.data.length > 0){
                arr.push(rowArr);
            }
        }
        this.result = arr;
    }
    
}
