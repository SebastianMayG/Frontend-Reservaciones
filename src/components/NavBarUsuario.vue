<script setup>
import { RouterLink } from 'vue-router';
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
            <RouterLink to = "/AgendarReservas" class="nav-link active palabras" aria-current="page" >Agendar Reservas</RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink to = "/TusReservacion" class="nav-link active palabras" aria-current="page" >Tus Reservaciones</RouterLink>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle palabras" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Usuario
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item " href="#">no se</a></li>
            <li><a class="dropdown-item " href="#">lo puso luis en el figma</a></li>
            <li><a class="dropdown-item" href="#">preguntenle a el</a></li>
          </ul>
        </li>
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