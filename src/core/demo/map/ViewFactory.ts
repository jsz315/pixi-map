import * as PIXI from 'pixi.js';

export class ViewFactory{

    static normal(obj:PIXI.Sprite | PIXI.Graphics | PIXI.Text){
        // obj.setData("ratio", 1);
    }

    static makeImage(url:string):PIXI.Sprite{
        var img = new PIXI.Sprite(PIXI.Loader.shared.resources[url].texture);
        return img;
    }

    static makeText(word:string, color:string = '#999999', fontSize:number = 24):PIXI.Text{
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: fontSize,
            fill: color,
        });
        let txt = new PIXI.Text(word, style);
        return txt;
    }

    static makeRect(color:number, width:number, height:number):PIXI.Graphics{
        var graphics = new PIXI.Graphics();
        graphics.beginFill(color, 1);
        graphics.lineStyle(1, 0x999999, 0.4);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        ViewFactory.normal(graphics);
        return graphics;
    }
}