<script setup>
import { RouterLink } from 'vue-router';

  const goToRegister = () => {
      window.location.href = '/IniciarSesion';
    };

</script>

<template>
<nav class="navbar navbar-expand-lg margen-bottom" style="background-color: #265A9C;">
  <div class="container-fluid" >
    <a class="navbar-brand palabras" href="/">MicroReservas</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
            <RouterLink to = "/VisualizarReservas" class="nav-link active palabras" aria-current="page" >Visualizar Reservas</RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink to = "/" class="nav-link active palabras" aria-current="page" >Crear Reservaciones</RouterLink>
        </li>
        <li>
          <RouterLink to = "/"  class="nav-link active palabras">Iniciar sesion</RouterLink>
        </li>
          <button type="button" class="btn btn-outline-success ms-3" @click="goToRegister">
              Regístrate
            </button>
      </ul>
    </div>
  </div>
</nav>
</template>

<style>
 .palabras{
    color:rgb(255, 255, 255) !important
 }
 .margen-bottom{
    margin-bottom: 2rem;
 }
</style>