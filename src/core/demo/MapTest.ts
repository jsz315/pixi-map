import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { MapView } from './map/MapView';
import { Point } from './map/Point';
import { ShortPath } from './map/ShortPath';
import { GlobalData } from './GlobalData';
import listener from '../listener'
import { ViewFactory } from './map/ViewFactory';

export class MapTest extends BaseScene{

    box:PIXI.Container;
    dragging:boolean;
    startPot:any;
    distance:number;
    center:any;
    txt:PIXI.Text;
    points:any[] = [];
    shortPath: ShortPath;
    mapView:MapView;
    dragTarget:any;
    findPathEvents:any;
    edit:boolean;
    drag:boolean;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();
        
        var e1 = listener.on("findPath", () => {
            this.findPath();
        })

        var e2 = listener.on("onDraw", (edit:boolean) => {
            this.edit = edit;
        })

        var e3 = listener.on("onDrag", (drag:boolean) => {
            this.drag = drag;
            this.mapView.scale.set(0.9, 0.9);
            this.mapView.x = (this.width - this.mapView.width) / 2;
            this.mapView.y = (this.height - this.mapView.height) / 2;

            var mapStr = this.mapView.mapData.getMapMinString();
            var start: Point = this.mapView.findViewPoint(this.mapView.dog);
            var end: Point = this.mapView.findViewPoint(this.mapView.food);
            var minStr = [mapStr, this.mapView.mapData.row, this.mapView.mapData.col, start.row, start.col, end.row, end.col].join(",");
            console.log("minStr");
            console.log(minStr);

        })

        this.findPathEvents = [e1, e2, e3];
    }

    findPath(){
        var start: Point = this.mapView.findViewPoint(this.mapView.dog);
        var end: Point = this.mapView.findViewPoint(this.mapView.food);
        var list = this.shortPath.find(start, end);
        if(list.length == 0){
            this.mapView.hidePath();
            listener.emit("noWay");
        }
        else{
            this.mapView.update();
            this.mapView.showPath(list);
        }
    }
    
    async setup(){
        await this.load(GlobalData.URL_WALL);
        await this.load(GlobalData.URL_FOOD);
        await this.load(GlobalData.URL_DOG);
        
        this.container.interactive = true;
        this.mapView = new MapView(this.width, this.height, 80);
        var background = ViewFactory.makeRect(0xaeaeae, this.width, this.height);
        this.container.addChild(background);
        this.container.addChild(this.mapView);
        this.shortPath = new ShortPath(this.mapView.mapData);

        this.container.interactive = true;
        this.container.on('pointerdown', this.onDragStart.bind(this));
        this.container.on('pointerup', this.onDragEnd, this);
        this.container.on('pointerupoutside', this.onDragEnd, this);
        this.container.on('pointermove', this.onDragMove, this);
    }

    addText(){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 28,
            fill: "#ffffff",
            stroke: '#333333',
            strokeThickness: 6,
            wordWrap: true,
            wordWrapWidth: this.width - 60,
            breakWords: true,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 3,
            dropShadowAngle: Math.PI / 3,
            dropShadowDistance: 4,
        });
        var txt = new PIXI.Text("点击图片", style);
        txt.anchor.set(0, 1);
        return txt;
    }

    getDistance(p1:any, p2:any){
        var a = p1.global;
        var b = p2.global;
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    getCenter(p1:any, p2:any){
        var a = p1.getLocalPosition(this.mapView);
        var b = p2.getLocalPosition(this.mapView);
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }

    onDragStart(e:any){
        this.dragging = true;
        this.points.push(e.data);

        if(this.points.length == 2){
            this.center = this.getCenter(this.points[0], this.points[1]);
        }
        else{
            this.mapView.click(e.data.getLocalPosition(this.mapView), this.edit);
            this.dragTarget = this.mapView.getClick() || this.mapView;
            if(this.dragTarget == this.mapView){
                this.startPot = e.data.getLocalPosition(this.container);
            }
            else{
                this.startPot = e.data.getLocalPosition(this.mapView);
            }
        }
    }

    onDragMove(e:any){
        if(!this.dragging) return;
        if(this.points.length == 2 && this.drag){

            this.center = this.getCenter(this.points[0], this.points[1]);

            var size = this.getDistance(this.points[0], this.points[1]);
            if(this.distance){
                var width = this.mapView.width;
                var height = this.mapView.height;
                var scale = this.mapView.scale.x;
                if(size > this.distance){
                    scale *= 1.04;
                }
                else{
                    scale *= 0.96;
                }

                if(scale < 0.1){
                    scale = 0.1;
                }
                else if(scale > 8){
                    scale = 8;
                }
                this.mapView.scale.set(scale, scale);
                var ox = this.mapView.width - width;
                var oy = this.mapView.height - height;
                this.mapView.x -= ox * (this.center.x - this.mapView.x) / this.mapView.width;
                this.mapView.y -= oy * (this.center.y - this.mapView.y) / this.mapView.height;
            }
            else{
                this.distance = size;
                this.txt.text = "设置距离:" + size.toFixed(0);
            }
        }
        else{
            var local;
            var offsetX:number, offsetY:number;
            var canMove = true;
            if(this.dragTarget == this.mapView){
                local = e.data.getLocalPosition(this.container);
                offsetX = local.x - this.startPot.x;
                offsetY = local.y - this.startPot.y;
                this.startPot = e.data.getLocalPosition(this.container);
                if(!this.drag){
                    canMove = false;
                    this.mapView.click(e.data.getLocalPosition(this.mapView), this.edit, true);
                }
            }
            else{
                local = e.data.getLocalPosition(this.mapView);
                offsetX = local.x - this.startPot.x;
                offsetY = local.y - this.startPot.y;
                this.startPot = e.data.getLocalPosition(this.mapView);
                this.mapView.hidePath();
            }
            if(canMove){
                this.dragTarget.x += offsetX;
                this.dragTarget.y += offsetY;
            }
            
        }
    }

    onDragEnd(e:any){
        this.points = this.points.filter(item => item.identifier != e.data.identifier);
        if(this.points.length != 2){
            this.distance = 0;
            this.dragging = false;
            this.center = null;
            this.mapView.updateDragPosition();
        }
    }

    update(){
        
    }

    destory(): void {
        this.findPathEvents.forEach((item:any) => item.destory());
        super.destory();
        this.container.interactive = false;
        this.container.off('pointerdown', this.onDragStart.bind(this));
        this.container.off('pointerup', this.onDragEnd, this);
        this.container.off('pointerupoutside', this.onDragEnd, this);
        this.container.off('pointermove', this.onDragMove, this);
    }

}