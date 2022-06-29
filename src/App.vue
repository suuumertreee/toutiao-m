<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App', // 建议每个组件都给一个 name 属性值
  data () {
    return {

    }
  }
}
</script>
<style lang="less">
.aa {
  width: 100px;
  height: 100px;
  font-size: 40px;
  background-color: skyblue;
}
</style>
