class Point{
    constructor(){
        this.x = null;
        this.y = null;
    }
}
class Elastic{
    constructor(){
        this.startPoint = new Point();
        this.endPoint = new Point();
    }
    setStartPoint(x,y){
        this.startPoint.x = x;
        this.startPoint.y = y;
    }
    setEndPoint(x,y){
        this.endPoint.x = x;
        this.endPoint.y = y;
    }
    /**从左到右 从上到下的框 */
    isRight(){
        let isX = this.startPoint.x < this.endPoint.x;
        let isY = this.startPoint.y < this.endPoint.y;
        return isX && isY;
    }
    clear(){
        this.startPoint.x = null;
        this.startPoint.y = null;
        this.endPoint.x = null;
        this.endPoint.y = null;
    }
}
