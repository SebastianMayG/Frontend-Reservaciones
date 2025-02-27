<template>
  <div class="container">
    <button class="btn btn-primary" @click="obtenerSalas">Obtener Salas</button>
    <div v-if="salas.length > 0">
      <h2>Salas:</h2>
      <ul>
        <li v-for="sala in salas" :key="sala.id">{{ sala.nombre }}</li>
      </ul>
    </div>
    <div v-if="error">
      <p class="text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      salas: [],
      error: null
    };
  },
  methods: {
    async obtenerSalas() {
      fetch('http://127.0.0.1:8000/api/salas')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener las salas.');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.salas = data.data; // Ajusta según la estructura de tu respuesta
          this.error = null;
        })
        .catch(error => {
          console.error('Error al obtener salas:', error);
          this.error = 'Error al obtener las salas. Inténtalo de nuevo.';
          this.salas = [];
        });
    }
  }
};
</script>