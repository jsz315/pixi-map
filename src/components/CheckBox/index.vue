<template>
    <div class="check-box" @click="onClick">
        <div class="cir" :class="{selected}"></div>
        <div class="tip">{{tip}}</div>
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
    props: ['tip'],
    data(){
        return {
            selected: false
        }
    },
    mounted(){
        
    },
    methods: {
        onClick(e){
            console.log(e);
            this.selected = !this.selected;
            this.$emit('select', this.selected);
        }
    },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>