<template>
  <div id="app">
    <tangram></tangram>
  </div>
</template>

<script>
import tangram from './components/tangram.vue';
export default {
  name: 'App',
  components: {
    tangram,
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
