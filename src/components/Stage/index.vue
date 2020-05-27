<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="control">
            <div class="btn" @click="findPath">开始寻路</div>
        </div>

        <div class="tip" v-if="tip">{{tip}}</div>
        <div class="checks">
            <CheckBox tip="绘制地图" @select="onDraw"/>
            <CheckBox tip="拖动地图" @select="onDrag"/>
        </div>
    </div>

</template>

<script>

import {Game} from '../../core/Game'
import {MapTest} from '../../core/demo/MapTest'
import listener from '../../core/listener'
import CheckBox from '../CheckBox'

let game;
let timer;
export default {
    data(){
        return {
            name: '',
            edit: false,
            tip: '',
            list: [
                {
                    name: '地图',
                    component: MapTest
                }
            ]
        }
    },
    components: {CheckBox},
    mounted(){
        game = new Game(this.$refs.canvas);
        this.show(this.list[0]);

        listener.on("noWay", ()=>{
            clearTimeout(timer);
            this.tip = "";
            this.$nextTick(() => {
                this.tip = "寻路失败";
            })
            timer = setTimeout(()=>{
                this.tip = "";
            }, 3000)
            
        })
    },
    methods: {
        show(item) {
            this.name = item.name;
            game.reset(new item.component);
        },
        findPath(){
            listener.emit("findPath");
        },
        onDraw(data){
            listener.emit("onDraw", data);
        },
        onDrag(data){
            listener.emit("onDrag", data);
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>