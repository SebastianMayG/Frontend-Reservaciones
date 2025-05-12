<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalAdmin from '@/components/ModalAdmin.vue';
import ModalAdminUpdate from '@/components/ModalAdminUpdate.vue';
import DataTable from 'primevue/datatable';
import DataTableColumn from 'primevue/column';
import ActionButton from 'primevue/button';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { config } from '@/config';

export default {
  inject: ['urlBack'],
  name: 'VisualizarReservas',
  components: {
    ModalAdmin,
    ModalAdminUpdate,
    DataTable,
    DataTableColumn,
    ActionButton,
    Dialog,
    Button
  },
  data() {
    return {
      reservaciones: [],
      reservacionId: null,
      showDeleteDialog: false,
      showResultDialog: false,
      dialogData: {
        title: '',
        message: '',
        icon: ''
      },
      reservationToDelete: null,
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    listaAsistencia(reserva) {
      this.$router.push({
        path: '/ListaAsistencia',
        query: {
          id: reserva.id,
          sala_name: reserva.name,
          date: reserva.fecha.split(' | ')[0],
          description: reserva.descripcion,
          capacity: reserva.capacidad,
          teacher: reserva.maestro,
          reservation: reserva.fecha.split(' | ')[1]
        }
      });
    },
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
        this.showResult('Error', 'El ID de la reservación es inválido', 'pi pi-times-circle text-red-500');
        return;
      }

      this.reservationToDelete = id;
      this.dialogData = {
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que quieres eliminar esta reservación?',
        icon: 'pi pi-exclamation-triangle'
      };
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      this.showDeleteDialog = false;

      try {
        const response = await fetch(`${config.API_URL}/api/reservations/${this.reservationToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        this.showResult('Éxito', 'Reservación eliminada con éxito', 'pi pi-check-circle text-green-500');
        this.cargarDatos(); // Recargar los datos después de eliminar
      } catch (error) {
        console.error('Error al eliminar la reservación:', error);
        this.showResult('Error', 'No se pudo eliminar la reservación', 'pi pi-times-circle text-red-500');
      }
    },
    showResult(title, message, icon) {
      this.dialogData = { title, message, icon };
      this.showResultDialog = true;
    },
    closeResultDialog() {
      this.showResultDialog = false;
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
            maestro: `${maestro.name || ''} ${maestro.last_name || ''}`.trim() || 'Desconocido',
            capacidad: space.capacity || 'N/A',
            fecha: `${reserva.date} | ${reserva.start_time} - ${reserva.end_time}`,
          };
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        this.showResult('Error', 'Error al cargar los datos', 'pi pi-times-circle text-red-500');
      }
    },
    async obtenerReservaciones() {
      return this.fetchData(`${config.API_URL}/api/reservations`);
    },
    async obtenerSalas() {
      return this.fetchData(`${config.API_URL}/api/spaces`);
    },
    async obtenerMaestros() {
      return this.fetchData(`${config.API_URL}/api/users`);
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
  <div class="mb-4">
    <div class="d-flex justify-content-end mb-3 m-4">
      <ActionButton icon="pi pi-check" label="Crear Reservación" severity="info" @click="abrirModal"></ActionButton>
    </div>
    <div class="container">
      <DataTable class="p-datatable-striped p-datatable-gridlines" :value="reservaciones" paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
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
              <ActionButton label="Lista de Asistencia" icon="pi pi-pen-to-square" severity="succes"
                @click="listaAsistencia(slotProps.data)"></ActionButton>
            </div>
          </template>
        </DataTableColumn>
      </DataTable>
    </div>

    <ModalAdmin />
    <ModalAdminUpdate :reservacionId="reservacionId" />

    <!-- Diálogo de Confirmación -->
    <Dialog v-model:visible="showDeleteDialog" :header="dialogData.title" :style="{ width: '30vw' }" :modal="true">
      <div class="center">
        <i :class="dialogData.icon" style="font-size: 2rem"></i>
      </div>
      <div class="flex align-items-center gap-3">
        <span>{{ dialogData.message }}</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="showDeleteDialog = false" class="p-button-text" />
        <Button label="Eliminar" icon="pi pi-trash" @click="confirmDelete" severity="danger" autofocus />
      </template>
    </Dialog>

    <!-- Diálogo de Resultado -->
    <Dialog v-model:visible="showResultDialog" :header="dialogData.title" :style="{ width: '350px' }" :modal="true">
      <div class="center">
        <i :class="dialogData.icon" style="font-size: 2rem"></i>
      </div>
      <div class="flex align-items-center gap-3">
        <span>{{ dialogData.message }}</span>
      </div>
      <template #footer>
        <Button label="Aceptar" icon="pi pi-check" @click="closeResultDialog" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.text-red-500 {
  color: #ef4444;
}

.text-green-500 {
  color: #22c55e;
}

.center {
  display: flex;
  justify-content: center;
}
</style>