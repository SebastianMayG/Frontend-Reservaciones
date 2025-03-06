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
      reservaciones: []
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    abrirModal() {
      let modal = new bootstrap.Modal(document.getElementById('adminModal'));
      modal.show();
    },
    abrirModalModificar() {
      let modal = new bootstrap.Modal(document.getElementById('adminModalUpdate'));
      modal.show();
    },
    async eliminarReservacion(id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        this.reservaciones = this.reservaciones.filter(reserva => reserva.id !== id);
      } catch (error) {
        console.error('Error al eliminar la reservación:', error.message);
      }
    },
    async cargarDatos() {
      try {
        const [reservaciones, salas, maestros] = await Promise.all([
          this.obtenerReservaciones(),
          this.obtenerSalas(),
          this.obtenerMaestros()
        ]);

        this.reservaciones = reservaciones.data.map(reserva => {
          let space = salas.data.find(sala => sala.id === reserva.space_id) || {};
          let maestro = maestros.data.find(m => m.id === reserva.user_id) || {};
          return {
            id: reserva.id,
            name: space.name || 'Desconocido',
            descripcion: space.description || 'Sin descripción',
            maestro: maestro.name || 'Desconocido',
            capacidad: space.capacity || 'N/A',
            fecha: `${reserva.date} | ${reserva.start_time} - ${reserva.end_time}`
          };
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
      }
    },
    async obtenerReservaciones() {
      return this.fetchData('http://127.0.0.1:8000/api/reservations');
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
              <button class="btn btn-warning mx-2" @click="abrirModalModificar(reserva)">Modificar</button>
              <button class="btn btn-danger mx-2" @click="eliminarReservacion(reserva.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalAdmin />
    <ModalAdminUpdate/>
  </div>
</template>

<style></style>