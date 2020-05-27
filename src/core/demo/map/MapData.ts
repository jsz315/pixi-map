import { Point } from "./Point";
import { NumberTooler } from "./NumberTooler";

export class MapData{
    
    static TYPE_FREE:number = 0;
    static TYPE_BLOCK:number = 1;

    row:number;
    col:number;
    size:number;

    points:Array<Array<Point>> = [];

    constructor(row:number, col:number, size:number){
        this.row = row;
        this.col = col;
        this.size = size;
        this.reset();
        console.log("MapData init");
    }

    clearParent(){
        for(var i = 0; i < this.row; i++){
            for(var j = 0; j < this.col; j++){
                this.points[i][j].parent = null;
            }
        }
    }

    reset(){
        this.points = [];
        for(var i = 0; i < this.row; i++){
            this.points[i] = [];
            for(var j = 0; j < this.col; j++){
                this.points[i][j] = new Point(i, j);
                this.points[i][j].type = MapData.TYPE_FREE;
            }
        }
    }

    find(type:number):any{
        for(var i = 0; i < this.row; i++){
            for(var j = 0; j < this.col; j++){
                if(this.points[i][j].type == type){
                    return this.points[i][j];
                }
            }
        }
        return null;
    }

    getMapMinString():string{
        var list:Array<any> = [];
        for(var i = 0; i < this.row; i++){
            var temp:Array<any> = [];
            for(var j = 0; j < this.col; j++){
                temp.push(this.points[i][j].type);
            }
            var str2:string = temp.join("");
            var str16:string = NumberTooler.string2T16(str2);
            list.push(str16);
        }
        var map = list.join(".");
        return map;
    }

}