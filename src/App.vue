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
  <div class="administrar">
    <header>
      <NavBar v-if="!['/IniciarSesion', '/SingIn', '/AgendarReservaciones'].includes($route.path)" ></NavBar>
    </header>
    <main>
          <RouterView></RouterView>
    </main>
    <footer>
      <FooterComponent v-if="$route.path !== '/IniciarSesion'"></FooterComponent>
    </footer>
  </div>

</template>


<style>
.administrar{
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
