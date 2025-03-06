<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
<nav class="navbar navbar-expand-lg margen-bottom" style="background-color: #265A9C;">
  <div class="container-fluid" >
    <a class="navbar-brand palabras">ClassBooker</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
            <RouterLink to = "/TusReservaciones" class="nav-link active palabras" aria-current="page" >Tus Reservaciones</RouterLink>
        </li>
      </ul>
      <div class="ms-auto d-flex align-items-center">
          <RouterLink to="/IniciarSesion" class="btn btn-outline-light me-2">Cerrar sesión</RouterLink>
      </div>
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
 .btn-outline-light {
  border-color: white;
  color: white;
  transition: all 0.3s ease-in-out;
}

.btn-outline-light:hover {
  background-color: white;
  color: #265A9C;
}
</style>