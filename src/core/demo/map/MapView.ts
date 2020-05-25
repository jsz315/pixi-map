import * as PIXI from 'pixi.js';
import {MapData} from './MapData'
import {ViewFactory} from './ViewFactory'
import { RectView } from './RectView';
import { GlobalData } from '../GlobalData';

export class MapView extends PIXI.Container {

    mapData:MapData;
    views:any;
    size:number;

    dog:PIXI.Sprite;
    food:PIXI.Sprite;
    target:any;

    static COLOR_BLOCK:number = 0x000000;
    static COLOR_FREE:number = 0xffffff;
    static COLOR_AIM:number = 0xd3fde2;
    static COLOR_PLAYER:number = 0xfdf6d3;

    constructor(width:number, height:number, size:number){
        super();
        this.size = size;
        var col = Math.ceil(width / this.size);
        var row = Math.ceil(height / this.size);
        this.mapData = new MapData(row, col, this.size);
        this.width = width;
        this.height = height;
        this.createViews();
        this.addDog();
        this.addFood();
    }

    addDog(){
        this.dog = ViewFactory.makeImage(GlobalData.URL_DOG);
        this.dog.anchor.set(0.5, 0.5);
        var scale = this.size / this.dog.width;
        this.dog.scale.set(scale, scale);
        this.dog.position.set(this.size / 2, this.size / 2);
        this.addChild(this.dog);
    }

    addFood(){
        this.food = ViewFactory.makeImage(GlobalData.URL_FOOD);
        this.food.anchor.set(0.5, 0.5);
        var scale = this.size / this.food.width;
        this.food.scale.set(scale, scale);
        this.food.position.set(this.size / 2, this.size / 2);
        this.addChild(this.food);
    }

    changeType(i:number, j:number, type:number){
      if(i >= 0 && i < this.mapData.row){
        if(j >= 0 && j < this.mapData.col){
          this.mapData.points[i][j].type = type;
          this.update();
        }
      }
    }

    click(point:any){
        var col = Math.floor(point.x / this.size);
        var row = Math.floor(point.y / this.size);
        var data = this.mapData.points;
        console.log(point);
        if(data[row] && data[row][col]){
            if(data[row][col].type == MapData.TYPE_FREE){
                data[row][col].type = MapData.TYPE_BLOCK;
            }
            else{
                data[row][col].type = MapData.TYPE_FREE;
            }
            this.update();
        }
        if(this.getDistance(point, this.food) < this.size / 2){
            this.target = this.food;
        }
        else if(this.getDistance(point, this.dog) < this.size / 2){
            this.target = this.dog;
        }
        else{
            this.target = null;
        }
    }

    getDistance(a:any, b:any){
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    getClick(){
        return this.target;
    }

    updateDragPosition(){
        if(this.target){
            var x = Math.floor(this.target.position.x / this.size) * this.size + this.size / 2;
            var y = Math.floor(this.target.position.y / this.size) * this.size + this.size / 2;
            this.target.position.set(x, y);
        }
    }

    setFree(i:number, j:number){
        if(this.mapData.points[i] && this.mapData.points[i][j]){
            this.mapData.points[i][j].type = MapData.TYPE_FREE;
            this.update();
        }
    }

    setBlock(i:number, j:number){
        if(this.mapData.points[i] && this.mapData.points[i][j]){
            this.mapData.points[i][j].type = MapData.TYPE_BLOCK;
            this.update();
        }
    }

    createViews(){
        this.views = [];
        for(var i = 0; i < this.mapData.row; i++){
            this.views[i] = [];
            for(var j = 0; j < this.mapData.col; j++){
                // var view = ViewFactory.makeRect(this.scene, this.getColor(i, j), this.size, this.size);
                var view = new RectView(MapView.COLOR_FREE, this.size);
                view.x = j * this.size;
                view.y = i * this.size;
                this.views[i][j] = view;
                this.addChild(view);
            }
        }
        
        this.update();
    }

    getColor(type:number):number{
      var color:number = 0;
      switch(type){
        case MapData.TYPE_FREE:
          color = MapView.COLOR_FREE;
          break
        case MapData.TYPE_BLOCK:
          color = MapView.COLOR_BLOCK;
          break
        case MapData.TYPE_AIM:
          color = MapView.COLOR_AIM;
          break
        case MapData.TYPE_PLAYER:
          color = MapView.COLOR_PLAYER;
          break
      }
      return color;
    }

    reset(){
      this.mapData.reset();
      this.update();
    }

    update(){
        for(var i = 0; i < this.mapData.row; i++){
            for(var j = 0; j < this.mapData.col; j++){
                // this.views[i][j].fillColor = Math.floor(Math.random() * 0xffffff);
                var point = this.mapData.points[i][j];
                this.views[i][j].changeColor(this.getColor(point.type));
                this.views[i][j].changeNumber(point.toStart, point.toEnd, point.cost);
            }
        }
    }

}