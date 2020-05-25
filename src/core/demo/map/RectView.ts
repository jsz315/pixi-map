import * as PIXI from 'pixi.js';
import {MapData} from './MapData'
import { MapView } from './MapView';
import { ViewFactory } from './ViewFactory';
import { GlobalData } from '../GlobalData';

export class RectView extends PIXI.Container {

    size:number;
    startTxt:PIXI.Text;
    endTxt:PIXI.Text;
    costTxt:PIXI.Text;
    color:number;
    background:PIXI.Graphics;
    // wall:PIXI.Sprite;
    graphics: PIXI.Graphics;

    constructor(color:number, size:number){
        super();

        this.color = color;
        this.size = size;
        this.createViews();
    }

    changeBackground(){
        this.background.clear();
        if(this.color == MapView.COLOR_BLOCK){
            var texture = PIXI.Loader.shared.resources[GlobalData.URL_WALL].texture;
            var matrix = new PIXI.Matrix();
            matrix.scale(this.size / texture.width, this.size / texture.height);
            this.background.beginTextureFill({
                texture: texture,
                matrix: matrix
            })
        }
        else{
            this.background.beginFill(this.color);
        }
        
        this.background.lineStyle(1, 0x999999, 0.4);
        this.background.drawRect(0, 0, this.size, this.size);
        this.background.endFill();
    }

    changeColor(color:number){
        this.color = color;
        this.changeBackground();
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

        // this.wall = ViewFactory.makeImage('man.jpg');

        this.addChild(this.background);
        this.addChild(this.startTxt);
        this.addChild(this.endTxt);
        this.addChild(this.costTxt);

        this.startTxt.x = 12;
        this.startTxt.anchor.set(0, 1);
        this.startTxt.y = this.size - 12;

        this.endTxt.x = this.size - 12;
        this.endTxt.anchor.set(1, 1);
        this.endTxt.y = this.size - 12;

        this.costTxt.x = this.size / 2;
        this.costTxt.anchor.set(0.5, 0);
        this.costTxt.y = 12;
    }
}