<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalAdmin from '@/components/ModalAdmin.vue';
import ModalAdminUpdate from '@/components/ModalAdminUpdate.vue';
import DataTable from 'primevue/datatable';
import DataTableColumn from 'primevue/column';
import ActionButton from 'primevue/button';

export default {
  name: 'VisualizarReservas',
  components: {
    ModalAdmin,
    ModalAdminUpdate,
    DataTable,
    DataTableColumn,
    ActionButton
  },
  data() {
    return {
      reservaciones: [],
      reservacionId: null,
      // pagination: {
      //   current_page: 1,
      //   last_page: 1,
      // },
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
        // this.cargarDatos(this.pagination.current_page);
      } catch (error) {
        console.error('Error al eliminar la reservación:', error.message);
        alert("Error al eliminar la reservación");
      }
    },
    async cargarDatos() {
      try {
        const [reservaciones, salas, maestros] = await Promise.all([
          this.obtenerReservaciones(),
          this.obtenerSalas(),
          this.obtenerMaestros()
        ]);

        this.reservaciones = reservaciones.data.map(reserva => { // Ajuste aquí
          let space = salas.data.find(sala => sala.id === reserva.space_id) || {};
          let maestro = maestros.data.find(m => m.id === reserva.user_id) || {};
          return {
            id: reserva.id,
            name: space.name || 'Desconocido',
            descripcion: space.description || 'Sin descripción',
            maestro: `${maestro.name || ''} ${maestro.last_name || ''}`.trim() || 'Desconocido',
            capacidad: space.capacity || 'N/A',
            fecha: `${reserva.date} | ${reserva.start_time} - ${reserva.end_time}`,
          };
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        alert("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      }
    },
    async obtenerReservaciones() {
      // return this.fetchData(`http://127.0.0.1:8000/api/reservations/pagination?page=${page}`);
      return this.fetchData(`http://127.0.0.1:8000/api/reservations`);
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
      <ActionButton icon="pi pi-check" label="Crear Reservación" severity="info" @click="abrirModal"></ActionButton>
    </div>
    <div class="container">
      <DataTable class="p-datatable-striped p-datatable-gridlines" :value="reservaciones" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
        <DataTableColumn field="name" header="Nombre"></DataTableColumn>
        <DataTableColumn field="descripcion" header="Descripción"></DataTableColumn>
        <DataTableColumn header="Maestro">
          <template #body="slotProps">
            {{ slotProps.data.maestro }}
          </template>
        </DataTableColumn>
        <DataTableColumn field="capacidad" header="Capacidad"></DataTableColumn>
        <DataTableColumn field="fecha" header="Fecha y hora"></DataTableColumn>
        <DataTableColumn header="Opciones">
          <template #body="slotProps">
            <div style="display: inline-flex; gap: 5px;">
              <ActionButton label="Editar" icon="pi pi-pencil" severity="warn"
                @click="abrirModalModificar(slotProps.data.id)"></ActionButton>
              <ActionButton label="Eliminar" icon="pi pi-trash" severity="danger"
                @click="eliminarReservacion(slotProps.data.id)"></ActionButton>
            </div>
          </template>
        </DataTableColumn>
      </DataTable>
    </div>

    <ModalAdmin />
    <ModalAdminUpdate :reservacionId="reservacionId" />
  </div>
</template>

<style>
.p-paginator {
  min-width: 300px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.p-paginator .p-paginator-pages {
  display: inline-block;
}
</style>