import * as PIXI from 'pixi.js';
import { IScene } from './demo/IScene';

export class Game{
    canvas:any;
    app:PIXI.Application;
    loader: PIXI.Loader;
    width:number;
    height:number;
    man:PIXI.Sprite;
    url:string = 'man.jpg';

    scene:IScene;

    constructor(canvas:any){
        this.canvas = canvas;
        this.init();
    }

    init(){
        var size = window.innerWidth * window.devicePixelRatio;
        size = size > 1280 ? 1280 : size;
        this.width = size;
        this.height = size;
        this.app = new PIXI.Application({
            autoStart: true,
            width: this.width,
            height: this.height,
            view: this.canvas,
            antialias: false
        })

        this.app.renderer.backgroundColor = 0xf0f0f0;
        console.log(this.app, "app");
        this.app.ticker.add(this.loop.bind(this));

        window.onresize = () => {
            this.app.renderer.view.style.width = window.innerWidth + "px";
            this.app.renderer.view.style.height = window.innerWidth + "px";
            this.app.resize();
            this.app.renderer.resize(window.innerWidth, window.innerWidth);
        }
    }

    reset(scene:IScene){
        if(this.scene){
            this.scene.destory();
        }
        this.scene = scene;
        this.app.stage.addChild(this.scene.container);
        this.scene.init(this.width, this.height, this.app);
    }

    destroy(){
        console.log("destroy");
    }

    loop(){
        if(this.scene){
            this.scene.update();
        }
    }
}