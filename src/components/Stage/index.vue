<template>
    <div class="stage">
        <div class="title">{{name}}</div>
        <canvas class="canvas" ref="canvas"></canvas>
        <div class="btns">
            <div class="btn" @click="show(item, $event)" v-for="(item, index) in list" v-bind:key="index">{{item.name}}</div>
        </div>

        <div class="control">
            <div class="btn" @click="findPath">开始寻路</div>
        </div>
    </div>

</template>

<script>

import {Game} from '../../core/Game'
import {MapTest} from '../../core/demo/MapTest'
import {TextTest} from '../../core/demo/TextTest'
import listener from '../../core/listener'

let game;
export default {
    data(){
        return {
            name: '',
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
    },
    methods: {
        show(item, e) {
            console.log(e);
            this.name = item.name;
            game.reset(new item.component);
        },
        findPath(){
            listener.emit("findPath");
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>