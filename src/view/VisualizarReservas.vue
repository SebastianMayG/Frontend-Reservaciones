<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalAdmin from '@/components/ModalAdmin.vue';
import ModalAdminUpdate from '@/components/ModalAdminUpdate.vue';

export default {
  name: 'VisualizarReservas',
  components: {
    ModalAdmin,
    ModalAdminUpdate
  },
  data() {
    return {
      reservaciones: [],
      reservacionId: null,
      pagination: {
        current_page: 1,
        last_page: 1,
      },
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    abrirModal() {
      new bootstrap.Modal(document.getElementById('adminModal')).show();
    },
    abrirModalModificar(id) {
      this.reservacionId = id;
      this.$nextTick(() => {
        new bootstrap.Modal(document.getElementById('adminModalUpdate')).show();
      });
    },
    async eliminarReservacion(id) {
      if (!id) {
        console.error("Error: El ID de la reservación es undefined");
        return;
      }
      const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta reservación?");
      if (!confirmacion) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        alert("Reservación eliminada con éxito");
        this.cargarDatos(this.pagination.current_page);
      } catch (error) {
        console.error('Error al eliminar la reservación:', error.message);
        alert("Error al eliminar la reservación");
      }
    },
    async cargarDatos(page = 1) {
      try {
        const [reservaciones, salas, maestros] = await Promise.all([
          this.obtenerReservaciones(page),
          this.obtenerSalas(),
          this.obtenerMaestros()
        ]);

        this.reservaciones = reservaciones.data.data.map(reserva => {
          let space = salas.data.find(sala => sala.id === reserva.space_id) || {};
          let maestro = maestros.data.find(m => m.id === reserva.user_id) || {};
          return {
            id: reserva.id,
            name: space.name || 'Desconocido',
            descripcion: space.description || 'Sin descripción',
            maestro: maestro.name || 'Desconocido',
            capacidad: space.capacity || 'N/A',
            fecha: `${reserva.date} | ${reserva.start_time} - ${reserva.end_time}`,
          };
        });
        this.pagination = reservaciones.data;
      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        alert("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      }
    },
    async obtenerReservaciones(page) {
      return this.fetchData(`http://127.0.0.1:8000/api/reservations?page=${page}`);
    },
    async obtenerSalas() {
      return this.fetchData('http://127.0.0.1:8000/api/spaces');
    },
    async obtenerMaestros() {
      return this.fetchData('http://127.0.0.1:8000/api/users');
    },
    async fetchData(url) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error(`Error al obtener datos de ${url}:`, error.message);
        return { data: [] };
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3 m-4">
      <button class="btn btn-primary" @click="abrirModal">Crear Reservación</button>
    </div>
    <div class="table-responsive m-4">
      <table class="table table-dark table-striped table-responsive">
        <thead>
          <tr>
            <td>Nombre</td>
            <td>Descripción</td>
            <td>Maestro</td>
            <td>Capacidad</td>
            <td>Fecha y hora</td>
            <td>Opciones</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservaciones" :key="reserva.id">
            <td>{{ reserva.name }}</td>
            <td>{{ reserva.descripcion }}</td>
            <td>{{ reserva.maestro }}</td>
            <td>{{ reserva.capacidad }}</td>
            <td>{{ reserva.fecha }}</td>
            <td>
              <button class="btn btn-warning mx-2" @click="abrirModalModificar(reserva.id)">Modificar</button>
              <button class="btn btn-danger mx-2" @click="eliminarReservacion(reserva.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
      <button class="btn btn-secondary mx-2" 
              :disabled="pagination.current_page === 1" 
              @click="cargarDatos(pagination.current_page - 1)">
        Anterior
      </button>
      
      <span>Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
      
      <button class="btn btn-secondary mx-2" 
              :disabled="pagination.current_page === pagination.last_page" 
              @click="cargarDatos(pagination.current_page + 1)">
        Siguiente
      </button>
    </div>
    <ModalAdmin />
    <ModalAdminUpdate :reservacionId="reservacionId" />
  </div>
</template>

<style></style>