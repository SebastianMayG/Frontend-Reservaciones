<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
    name: 'ModalAdminSpaceUpdate',
    props: {
        SpaceId: {
            type: [Number, null],
            required: true,
            default: 0,
        }
    },
    data() {
        return {
            espacioData: {
                nombre: '',
                descripcion: '',
                capacidad: 0,
                start_time: '',
                end_time: '',
            },
        };
    },
    methods: {
        async guardarEspacio() {
            try {
                const espacioActualizado = await this.actualizarEspacio(this.espacioData);
                await this.actualizarHorario(espacioActualizado.data.id, this.espacioData.start_time, this.espacioData.end_time);
                alert('Espacio y horario actualizados con éxito');
                this.espacioData = {
                    nombre: '',
                    descripcion: '',
                    capacidad: 0,
                    start_time: '',
                    end_time: '',
                };
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar el espacio:', error.message);
                alert('Error al actualizar el espacio. Por favor, inténtalo de nuevo.');
            }
        },
        async actualizarEspacio(espacio) {
            const response = await fetch(`http://127.0.0.1:8000/api/spaces/${espacio.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: espacio.nombre,
                    description: espacio.descripcion,
                    capacity: espacio.capacidad,
                }),

            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();
        },
        async actualizarHorario(id, start_time, end_time) {
            const response = await fetch(`http://127.0.0.1:8000/api/schedules/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    space_id: id,
                    start_time: start_time,
                    end_time: end_time,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();
        },

        async cargarEspacio() {
            try {
                const espacio = await this.obtenerEspacio(this.SpaceId);
                const horario = await this.obtenerEspacioHorario(this.SpaceId);

                this.espacioData = {
                    id: espacio.data.id,
                    nombre: espacio.data.name,
                    descripcion: espacio.data.description,
                    capacidad: espacio.data.capacity,
                    start_time: horario.data[0].start_time,
                    end_time: horario.data[0].end_time,
                };
                console.log('Espacio cargado:', this.espacioData);
            } catch (error) {
                console.error('Error al cargar el espacio:', error.message);
                alert('Error al cargar el espacio. Por favor, inténtalo de nuevo.');
            }
        },
        async obtenerEspacio(id) {
            const responseEspacio = await fetch(`http://127.0.0.1:8000/api/spaces/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!responseEspacio.ok) {
                return await responseEspacio.json();
            }
            console.log(responseEspacio.json);
            return responseEspacio.json();
        },
        async obtenerEspacioHorario(id) {
            const responseEspacioHorario = await fetch(`http://127.0.0.1:8000/api/schedules/space/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!responseEspacioHorario.ok) {
                return await responseEspacioHorario.json();
            }
            console.log(responseEspacioHorario.json);
            return responseEspacioHorario.json();
        },


    },
    watch: {
            SpaceId: {
                immediate: true,
                handler(newId) {
                    if (newId) {
                        this.cargarEspacio();
                    }
                }
            },
        }
}

</script>

<template>
    <div class="modal fade" id="adminModalEspaciosUpdate" tabindex="-1" aria-labelledby="adminModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="adminModalLabel">Actualizar Espacio</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarEspacio">
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="espacioData.nombre" placeholder="Nombre">
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="espacioData.descripcion"
                                placeholder="Descripción">
                        </div>
                        <div class="mb-3">
                            <input type="number" class="form-control" v-model="espacioData.capacidad"
                                placeholder="Capacidad">
                        </div>
                        <div class="row">
                            <div class="col mb-3">
                                <select id="horarioSelect" class="form-select" v-model="espacioData.start_time"
                                    required>
                                    <option value="" disabled selected>Hora de apertura</option>
                                    <option value="07:00">7:00</option>
                                    <option value="09:00">9:00</option>
                                    <option value="11:00">11:00</option>
                                </select>
                            </div>
                            <div class="col mb-3">
                                <select id="horarioSelectEnd" class="form-select" v-model="espacioData.end_time"
                                    required>
                                    <option value="" disabled selected>Hora de cierre</option>
                                    <option value="13:00">13:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="17:00">17:00</option>
                                </select>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-warning">Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>