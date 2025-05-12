<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'primevue/datatable';
import DataTableColumn from 'primevue/column';
import ActionButton from 'primevue/button';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ModalAdminEspacios from '@/components/ModalAdminEspacios.vue';
import ModalAdminSpaceUpdate from '@/components/ModalAdminSpaceUpdate.vue';
import { config } from '@/config';

export default {
    inject: ['urlBack'],
    name: 'VisualizarEspacios',
    components: {
        DataTable,
        DataTableColumn,
        ActionButton,
        Dialog,
        Button,
        ModalAdminEspacios,
        ModalAdminSpaceUpdate,
    },
    data() {
        return {
            espacios: [],
            horarios: {},
            SpaceId: null,
            showDeleteDialog: false,
            showResultDialog: false,
            dialogData: {
                title: '',
                message: '',
                icon: ''
            },
            spaceToDelete: null,
        };
    },
    async mounted() {
        await this.cargarDatos();
    },
    methods: {
        async cargarDatos() {
            try {
                const [espaciosResponse, horariosResponse] = await Promise.all([
                    this.obtenerSalas(),
                    this.obtenerHorarios(),
                ]);

                this.espacios = espaciosResponse.data;
                this.horarios = horariosResponse.data.reduce((acc, horario) => {
                    acc[horario.space_id] = horario;
                    return acc;
                }, {});

                this.espacios.forEach(espacio => {
                    const horario = this.horarios[espacio.id];
                    if (horario) {
                        espacio.start_time = horario.start_time;
                        espacio.end_time = horario.end_time;
                    } else {
                        espacio.start_time = 'No disponible';
                        espacio.end_time = 'No disponible';
                    }
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                this.showResult('Error', 'Error al cargar los datos', 'pi pi-times-circle text-red-500');
            }
        },
        abrirModal() {
            new bootstrap.Modal(document.getElementById('adminModalEspacios')).show();
        },
        abrirModalModificar(id) {
            this.SpaceId = id;
            this.$nextTick(() => {
                new bootstrap.Modal(document.getElementById('adminModalEspaciosUpdate')).show();
            });
        },
        async eliminarSala(id) {
            if (!id) {
                this.showResult('Error', 'El ID del espacio es inválido', 'pi pi-times-circle text-red-500');
                return;
            }

            this.spaceToDelete = id;
            this.dialogData = {
                title: 'Confirmar eliminación',
                message: '¿Estás seguro de que quieres eliminar este espacio?',
                icon: 'pi pi-exclamation-triangle'
            };
            this.showDeleteDialog = true;
        },
        async confirmDelete() {
            this.showDeleteDialog = false;

            try {
                const response = await fetch(`${config.API_URL}/api/spaces/${this.spaceToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                this.showResult('Éxito', 'Espacio eliminado con éxito', 'pi pi-check-circle text-green-500');
                await this.cargarDatos(); // Recargar los datos después de eliminar
            } catch (error) {
                console.error('Error al eliminar el espacio:', error);
                this.showResult('Error', 'No se pudo eliminar el espacio', 'pi pi-times-circle text-red-500');
            }
        },
        showResult(title, message, icon) {
            this.dialogData = { title, message, icon };
            this.showResultDialog = true;
        },
        closeResultDialog() {
            this.showResultDialog = false;
        },
        async obtenerSalas() {
            return this.fetchData(`${config.API_URL}/api/spaces`);
        },
        async obtenerHorarios() {
            return this.fetchData(`${config.API_URL}/api/schedules`);
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
        },
    },
};
</script>

<template>
    <div class="mb-4">
        <div class="d-flex justify-content-end mb-3 m-4">
            <ActionButton icon="pi pi-check" label="Crear Espacio" severity="info" @click="abrirModal"></ActionButton>
        </div>

        <div class="container">
            <DataTable class="p-datatable-striped p-datatable-gridlines" autoLayout :value="espacios" paginator :rows="5" 
                :rowsPerPageOptions="[5, 10, 20, 50]">
                <DataTableColumn field="name" header="Nombre"></DataTableColumn>
                <DataTableColumn field="description" header="Descripción"></DataTableColumn>
                <DataTableColumn field="capacity" header="Capacidad"></DataTableColumn>
                <DataTableColumn header="Horario">
                    <template #body="slotProps">
                        {{ slotProps.data.start_time }} - {{ slotProps.data.end_time }}
                    </template>
                </DataTableColumn>
                <DataTableColumn header="Opciones">
                    <template #body="slotProps">
                        <div style="display: inline-flex; gap: 5px;">
                            <ActionButton label="Editar" icon="pi pi-pencil" severity="warn"
                                @click="abrirModalModificar(slotProps.data.id)"></ActionButton>
                            <ActionButton label="Eliminar" icon="pi pi-trash" severity="danger"
                                @click="eliminarSala(slotProps.data.id)"></ActionButton>
                        </div>
                    </template>
                </DataTableColumn>
            </DataTable>
        </div>

        <ModalAdminEspacios />
        <ModalAdminSpaceUpdate :SpaceId="SpaceId" />

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