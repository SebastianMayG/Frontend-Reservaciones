<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavBar from './components/NavBar.vue';
import {RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    NavBar,
    RouterView,
  }

}
</script>

<template>
  <NavBar></NavBar>
  <RouterView></RouterView>
  <footer> Soy el footer, no soy necesario pero es para probar errores</footer>
</template>



<style>

</style>
