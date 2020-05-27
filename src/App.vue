<template>
  <div id="app">
    <Stage/>
  </div>
</template>

<script>
import Stage from './components/Stage'

export default {
  name: 'App',
  components: {
    Stage
  }
}
</script>

<style>
html, body{
    margin: 0;
    padding: 0;
    width: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
