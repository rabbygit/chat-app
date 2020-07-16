<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "app"
  };
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    margin: 20px;
  }
</style>
