<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavBar from './components/NavBar.vue';
import FooterComponent from './components/FooterComponent.vue';
import {RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    NavBar,
    FooterComponent,
    RouterView,
  }

}
</script>

<template>
  <NavBar v-if="!['/IniciarSesion', '/SingIn'].includes($route.path)" ></NavBar>
  <RouterView></RouterView>
  <FooterComponent v-if="$route.path !== '/IniciarSesion'"></FooterComponent>
</template>


<style>

</style>
