import * as PIXI from 'pixi.js';
import { Point } from './Point';

export class PathView extends PIXI.Container {
    view:PIXI.Graphics;
    size:number;
    constructor(size:number){
        super();
        this.size = size;
        this.view = new PIXI.Graphics();
        this.addChild(this.view);
    }

    show(points:Array<Point>){
        var weight:number = 8;
        var size:number = this.size;
        this.view.visible = true;
        this.view.clear();

        this.view.lineStyle(weight, 0x999999, 0.4);
        for(var i = 0; i < points.length; i++){
            var sp = points[i];
            // var ep = points[i + 1];
            if(i == 0){
                this.view.moveTo((sp.col + 0.5) * size, (sp.row + 0.5) * size);
            }
            else{
                this.view.lineTo((sp.col + 0.5) * size, (sp.row + 0.5) * size);
            }
            
        }
    }

    hide(){
        this.view.visible = false;
    }
}