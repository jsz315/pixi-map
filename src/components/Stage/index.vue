<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(item, $event)" v-for="(item, index) in list" v-bind:key="index">{{item.name}}</div>
        </div>

        <div class="control">
            <div class="btn" @click="findPath">开始寻路</div>
            <div class="btn" @click="editMap">{{edit ? '点击停止编辑地图' : '点击开始编辑地图'}}</div>
            <div class="btn" @click="fitCenter">居中显示</div>
        </div>

        <div class="tip" v-if="tip">{{tip}}</div>
    </div>

</template>

<script>

import {Game} from '../../core/Game'
import {MapTest} from '../../core/demo/MapTest'
import {TextTest} from '../../core/demo/TextTest'
import listener from '../../core/listener'

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
                },
                {
                    name: '文字',
                    component: TextTest
                }
            ]
        }
    },
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
        show(item, e) {
            console.log(e);
            this.name = item.name;
            game.reset(new item.component);
        },
        findPath(){
            listener.emit("findPath");
        },
        editMap(){
            this.edit = !this.edit;
            listener.emit("editMap", this.edit);
        },
        fitCenter(){
            listener.emit("fitCenter");
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>