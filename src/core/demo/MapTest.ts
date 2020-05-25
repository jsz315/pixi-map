import * as PIXI from 'pixi.js';
import { BaseScene } from './BaseScene';
import { MapView } from './map/MapView';
import { Point } from './map/Point';
import { ShortPath } from './map/ShortPath';
import { MapData } from './map/MapData';

export class MapTest extends BaseScene{
    
    // man:PIXI.Sprite;
    url:string = 'man.jpg';
    box:PIXI.Container;
    dragging:boolean;
    startPot:any;
    distance:number;
    center:any;
    txt:PIXI.Text;
    points:any[] = [];
    shortPath: ShortPath;
    mapView:MapView;

    constructor(){
        super();
    }   

    init(width:number, height:number, app:PIXI.Application):void{
        super.init(width, height, app);
        this.setup();

        setTimeout(() => {
            this.test();
        }, 4000);
    }

    test(){
        this.mapView.changeType(2, 3, MapData.TYPE_PLAYER);
        this.mapView.changeType(8, 9, MapData.TYPE_AIM);

        var start: Point = this.mapView.mapData.find(MapData.TYPE_PLAYER);
        var end: Point = this.mapView.mapData.find(MapData.TYPE_AIM);
        var list = this.shortPath.find(start, end);
        list.forEach(item => {
            item.type = MapData.TYPE_PLAYER;
        })
        this.mapView.update();
    }
    
    async setup(){
        await this.load(this.url);

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
    
    addMan():PIXI.Sprite{
        var man = new PIXI.Sprite(this.loader.resources[this.url].texture);
        man.interactive = true;
        man.scale.set(0.4, 0.4);
        return man;
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

    getDistance(a:any, b:any){
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    getCenter(a:any, b:any){
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }

    onDragStart(e:any){
        console.log(e);
        var local = e.data.getLocalPosition(this.box);
        this.dragging = true;
        this.startPot = local;

        this.points.push({
            data: e.data.getLocalPosition(this.mapView),
            global: e.data.global,
            id: e.data.identifier
        });

        if(this.points.length == 2){
            this.center = this.getCenter(this.points[0].data, this.points[1].data);
        }
        else{
            this.mapView.click(e.data.getLocalPosition(this.mapView));
        }

        // this.txt.text = "手指数：" + ps.length + ", identifier" + e.data.identifier;
    }

    onDragMove(e:any){
        if(!this.dragging) return;
        // var ps = e.data.originalEvent.changedTouches;
        if(this.points.length == 2){
            var size = this.getDistance(this.points[0].global, this.points[1].global);
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
                else if(scale > 2){
                    scale = 2;
                }
                this.mapView.scale.set(scale, scale);
                var ox = this.mapView.width - width;
                var oy = this.mapView.height - height;
                this.mapView.x -= ox * this.center.x / this.mapView.width;
                this.mapView.y -= oy * this.center.y / this.mapView.height;
            }
            else{
                this.distance = size;
                this.txt.text = "设置距离:" + size.toFixed(0);
            }
        }
        else{
            var local = e.data.getLocalPosition(this.box);
            this.mapView.x += local.x - this.startPot.x;
            this.mapView.y += local.y - this.startPot.y;
            this.startPot = local;
        }
    }

    onDragEnd(e:any){
        this.points = this.points.filter(item => item.id != e.data.identifier);
        if(this.points.length != 2){
            this.distance = 0;
            this.dragging = false;
            this.center = null;
            this.txt.text = "清除距离";
        }
        // this.txt.text = "手指数：" + this.points.length + ", identifier" + e.data.identifier;
    }

    update(){
        
    }

    destory(): void {
        super.destory();
        this.container.interactive = false;
        this.container.off('pointerdown', this.onDragStart.bind(this));
        this.container.off('pointerup', this.onDragEnd, this);
        this.container.off('pointerupoutside', this.onDragEnd, this);
        this.container.off('pointermove', this.onDragMove, this);
    }

}