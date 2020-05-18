<template>
  <div id="app">
    <div id="top-container">
      <top id="top" />
    </div>
    <div id="main-fraime-container">
      <main-frame />
    </div>
  </div>
</template>

<script>
import mainFrame from './components/mainFrame.vue';
import top from './components/top';

export default {
  name: 'App',
  components: {
    mainFrame,
    top,
  },
  data: function() {
    return {
      date: '',
    };
  },
  watch: {
    date: () => {
      return new Date().toLocaleString();
    },
  },
};
</script>

<style lang="less">
@import './assets/css/main.less';

html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  display: grid;
  grid-template-rows: 2rem calc(100vw - 2rem);
  height: 100vh;
}
#top {
  color: @paragraph-lineNumber-color;
  text-align: center;
}
#top-container {
  height: 100%;
  position: relative;

  border-color: @paragraph-border-color;
  border-style: solid;
  border-width: 0.2rem 0.2rem 0rem 0.2rem;
}
#main-frame-container {
  height: auto;
  display: inline;
}
</style>
