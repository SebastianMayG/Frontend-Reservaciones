<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { computed } from 'vue';
import { inject } from 'vue'

const router = useRouter();
const urlBack = inject('urlBack') // Inyecta la variable
const isLoggedIn = computed(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
});

const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/IniciarSesion');
    return;
  }

  try {
    const response = await fetch(`${urlBack}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('id');
      router.push('/IniciarSesion');
    } else {
      console.error('Error al cerrar sesion:', response);
      alert('Error al cerrar sesion. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al cerrar sesion:', error);
    alert('Error al cerrar sesion. Inténtalo de nuevo.');
  }
};
</script>

<template>
  <nav class="navbar navbar-expand-lg margen-bottom" style="background-color: #265A9C;">
    <div class="container-fluid">
      <a class="navbar-brand palabras" href="/">ClassBooker</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/VisualizarReservas" class="nav-link active palabras" aria-current="page">Visualizar Reservas</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/VisualizarEspacios" class="nav-link palabras">Visualizar Espacios</RouterLink>
          </li>
        </ul>
        <div class="ms-auto d-flex align-items-center">
          <RouterLink v-if="!isLoggedIn" to="/IniciarSesion" class="btn btn-outline-light me-2">Iniciar sesión</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/SingIn" class="btn btn-outline-light me-2">Regístrate</RouterLink>
          <button v-if="isLoggedIn" @click="logout" class="btn btn-outline-light me-2">Salir</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.palabras {
  color: rgb(255, 255, 255) !important;
}

.margen-bottom {
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