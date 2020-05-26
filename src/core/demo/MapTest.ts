import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { MapView } from './map/MapView';
import { Point } from './map/Point';
import { ShortPath } from './map/ShortPath';
import { MapData } from './map/MapData';
import { GlobalData } from './GlobalData';
import listener from '../listener'

export class MapTest extends BaseScene{
    
    // man:PIXI.Sprite;
    // url:string = 'man.jpg';
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
    findPathEvent:any;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();

        this.findPathEvent = listener.on("findPath", () => {
            console.log("findPath");
            this.test();
        })
    }

    test(){
        // this.mapView.changeType(2, 3, MapData.TYPE_PLAYER);
        // this.mapView.changeType(8, 9, MapData.TYPE_AIM);

        var start: Point = this.mapView.findViewPoint(this.mapView.dog);
        var end: Point = this.mapView.findViewPoint(this.mapView.food);
        var list = this.shortPath.find(start, end);
        // list.forEach(item => {
        //     item.type = MapData.TYPE_PLAYER;
        // })
        this.mapView.update();
        this.mapView.showPath(list);
    }
    
    async setup(){
        await this.load(GlobalData.URL_WALL);
        await this.load(GlobalData.URL_FOOD);
        await this.load(GlobalData.URL_DOG);

        this.box = this.addBox();
        var rect = this.addRect();
        // this.man = this.addMan();
        this.txt = this.addText();

        // this.man.x = 100;
        // this.man.y = 100;

        this.box.addChild(rect);
        // this.box.addChild(this.man);

        this.box.x = 100;
        this.box.y = 100;

        this.container.addChild(this.box);
        this.container.interactive = true;

        this.txt.x = 30;
        this.txt.y = this.height - 30;

        this.container.addChild(this.box);
        this.container.addChild(this.txt);

        
        this.mapView = new MapView(this.width, this.height, 80);
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

    addBox():PIXI.Container{
        var box = new PIXI.Container();
        this.container.addChild(box);
        return box;
    }

    addRect():PIXI.Graphics{
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0xff9900);
        graphics.beginFill(0x884422);
        graphics.drawRect(0, 0, 500, 400);
        graphics.endFill();
        return graphics;
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
        console.log(e, 'click');
        // var local = e.data.getLocalPosition(this.mapView);
        this.dragging = true;
        

        // this.points.push({
        //     data: e.data.getLocalPosition(this.mapView),
        //     global: e.data.global,
        //     id: e.data.identifier
        // });

        // var ed = new PIXI.interaction.InteractionData();

        this.points.push(e.data);

        if(this.points.length == 2){
            this.center = this.getCenter(this.points[0], this.points[1]);
        }
        else{
            this.mapView.click(e.data.getLocalPosition(this.mapView));
            this.dragTarget = this.mapView.getClick() || this.mapView;
            if(this.dragTarget == this.mapView){
                this.startPot = e.data.getLocalPosition(this.container);
            }
            else{
                this.startPot = e.data.getLocalPosition(this.mapView);
            }
            console.log(this.dragTarget, 'dragTarget', this.startPot);
        }

        // this.txt.text = "手指数：" + ps.length + ", identifier" + e.data.identifier;
    }

    onDragMove(e:any){
        if(!this.dragging) return;
        // var ps = e.data.originalEvent.changedTouches;
        if(this.points.length == 2){

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
            if(this.dragTarget == this.mapView){
                local = e.data.getLocalPosition(this.container);
                offsetX = local.x - this.startPot.x;
                offsetY = local.y - this.startPot.y;
                this.startPot = e.data.getLocalPosition(this.container);
            }
            else{
                local = e.data.getLocalPosition(this.mapView);
                offsetX = local.x - this.startPot.x;
                offsetY = local.y - this.startPot.y;
                this.startPot = e.data.getLocalPosition(this.mapView);
            }
            this.dragTarget.x += offsetX;
            this.dragTarget.y += offsetY;
            console.log("move", offsetX.toFixed(0), offsetY.toFixed(0));
            // this.startPot = e.data;
        }
    }

    onDragEnd(e:any){
        this.points = this.points.filter(item => item.identifier != e.data.identifier);
        if(this.points.length != 2){
            this.distance = 0;
            this.dragging = false;
            this.center = null;
            this.txt.text = "清除距离";
            this.mapView.updateDragPosition();
        }
        // this.txt.text = "手指数：" + this.points.length + ", identifier" + e.data.identifier;
    }

    update(){
        
    }

    destory(): void {
        this.findPathEvent.destory();
        super.destory();
        this.container.interactive = false;
        this.container.off('pointerdown', this.onDragStart.bind(this));
        this.container.off('pointerup', this.onDragEnd, this);
        this.container.off('pointerupoutside', this.onDragEnd, this);
        this.container.off('pointermove', this.onDragMove, this);
    }

}