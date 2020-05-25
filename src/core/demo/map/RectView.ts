import * as PIXI from 'pixi.js';
import {MapData} from './MapData'
import { MapView } from './MapView';
import { ViewFactory } from './ViewFactory';

export class RectView extends PIXI.Container {

    size:number;
    startTxt:PIXI.Text;
    endTxt:PIXI.Text;
    costTxt:PIXI.Text;
    color:number;
    background:PIXI.Graphics;
    wall:PIXI.Sprite;
    graphics: PIXI.Graphics;

    constructor(color:number, size:number){
        super();

        this.color = color;
        this.size = size;
        this.createViews();
    }

    changeColor(color:number){
        this.color = color;
        // this.background = ViewFactory.makeRect(this.color, this.size, this.size);

        this.background.clear();
        this.background.beginFill(this.color);
        this.background.lineStyle(1, 0x999999, 0.4);
        this.background.drawRect(0, 0, this.size, this.size);
        this.background.endFill();

        if(this.color == MapView.COLOR_BLOCK){
            this.wall.visible = true;
        }
        else{
            this.wall.visible = false;
        }
    }

    changeNumber(s:number, e:number, c:number){
        this.startTxt.text = s.toString();
        this.endTxt.text = e.toString();
        this.costTxt.text = c.toString();
    }

    createViews(){
        this.background = ViewFactory.makeRect(this.color, this.size, this.size);
        this.startTxt = ViewFactory.makeText('1', "#229922", 16);
        this.endTxt = ViewFactory.makeText('2', "#666666", 16);
        this.costTxt = ViewFactory.makeText('3', "#ff0000", 20);

        this.wall = ViewFactory.makeImage('man.jpg');

        this.addChild(this.background);
        this.addChild(this.startTxt);
        this.addChild(this.endTxt);
        this.addChild(this.costTxt);
        this.addChild(this.wall);

        this.wall.visible = false;

        this.startTxt.x = 12;
        this.startTxt.anchor.set(0, 1);
        this.startTxt.y = this.size - 12;

        this.endTxt.x = this.size - 12;
        this.endTxt.anchor.set(1, 1);
        this.endTxt.y = this.size - 12;

        this.costTxt.x = this.size / 2;
        this.costTxt.anchor.set(0.5, 0);
        this.costTxt.y = 12;

        var scale = this.size / this.wall.texture.width;
        this.wall.scale.set(scale, scale);
    }
}