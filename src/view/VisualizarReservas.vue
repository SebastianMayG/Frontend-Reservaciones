<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalAdmin from '@/components/ModalAdmin.vue';
import ModalAdminUpdate from '@/components/ModalAdminUpdate.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
export default {
  name: 'VisualizarReservas',
  components: {
    ModalAdmin,
    ModalAdminUpdate,
    DataTable,
    Column,
    Button
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
    <!-- Botón para crear reservación -->
    <div class="d-flex justify-content-end mb-3 m-4">
      <button class="btn btn-primary" @click="abrirModal">Crear Reservación</button>
    </div>

    <!-- Contenedor de la tabla con altura fija -->
    <div class="px-5 table-container">
      <DataTable :value="reservaciones" tableStyle="min-width: 50rem">
        <Column field="name" header="Nombre"></Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column field="maestro" header="Maestro"></Column>
        <Column field="capacidad" header="Capacidad"></Column>
        <Column field="fecha" header="Fecha y hora"></Column>
        <Column header="Opciones">
          <template #body="slotProps">
            <Button label="Editar" icon="pi pi-pencil" severity="warn" @click="abrirModalModificar(slotProps.data.id)" class="me-2"/>
            <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="eliminarReservacion(slotProps.data.id)"/>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Botones de paginación -->
    <div class="d-flex justify-content-center pagination-buttons">
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

    <!-- Modal para crear y modificar reservaciones -->
    <ModalAdmin />
    <ModalAdminUpdate :reservacionId="reservacionId" />
  </div>
</template>

<style scoped>
  .table-container {
    height: 50rem; /* Ajusta esta altura según tus necesidades */
    overflow-y: auto; /* Añade un scroll vertical si el contenido es demasiado grande */
    margin-bottom: 1rem; /* Espacio entre la tabla y los botones de paginación */
  }

  .pagination-buttons {
    position: sticky;
    bottom: 0;
    background-color: white; /* Fondo blanco para que los botones no se mezclen con el contenido */
    padding: 10px 0; /* Espaciado para los botones */
    z-index: 1; /* Asegura que los botones estén por encima del contenido */
  }
</style>