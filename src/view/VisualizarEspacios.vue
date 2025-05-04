<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'primevue/datatable';
import DataTableColumn from 'primevue/column';
import ActionButton from 'primevue/button';
import ModalAdminEspacios from '@/components/ModalAdminEspacios.vue';
import ModalAdminSpaceUpdate from '@/components/ModalAdminSpaceUpdate.vue';

export default {
    name: 'VisualizarEspacios',
    components: {
        DataTable,
        DataTableColumn,
        ActionButton,
        ModalAdminEspacios,
        ModalAdminSpaceUpdate,
    },
    data() {
        return {
            espacios: [],
            horarios: {},
            SpaceId: null,
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
                console.error("Error: El ID de la reservación es undefined");
                return;
            }
            const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta reservación?");
            if (!confirmacion) return;

            try {
                const response = await fetch(`http://localhost:8000/api/spaces/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                alert("Espacio eliminada con éxito");
                await this.cargarDatos();
            } catch (error) {
                console.error('Error al eliminar el espacio:', error.message);
                alert("Error al eliminar el espacio");
            }
        },
        async obtenerSalas() {
            return this.fetchData('http://localhost:8000/api/spaces');
        },
        async obtenerHorarios() {
            return this.fetchData('http://localhost:8000/api/schedules');
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

    <div class="d-flex justify-content-end mb-3 m-4">
        <ActionButton icon="pi pi-check" label="Crear Espacio" severity="info" @click="abrirModal"></ActionButton>
    </div>

    <div class="container">
        <DataTable class="p-datatable-striped p-datatable-gridlines" autoLayout :value="espacios" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
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
</template>