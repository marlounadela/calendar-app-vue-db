<template>
  <div id="app">
    <CalendarComponent />
  </div>
</template>

<script lang="ts">
import CalendarComponent from './components/CalendarComponent.vue'

export default {
  name: 'App',
  components: {
    CalendarComponent,
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

</style>
