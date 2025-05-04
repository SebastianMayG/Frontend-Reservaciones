<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

export default {
    name: 'CrearEspacios',
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
                const espacioCreado = await this.crearEspacio(this.espacioData);
                await this.crearHorario(espacioCreado.data.id, this.espacioData.start_time, this.espacioData.end_time);
                alert('Espacio y horario creados con éxito');
                this.espacioData = {
                    nombre: '',
                    descripcion: '',
                    capacidad: 0,
                    start_time: '',
                    end_time: '',
                };
                new bootstrap.Modal(document.getElementById('adminModalEspacios')).hide();
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar el espacio:', error);
                alert('Error al guardar el espacio. Por favor, inténtalo de nuevo.');
            }
        },
        async crearEspacio(espacio) {
            const response = await fetch('http://localhost:8000/api/spaces', {
                method: 'POST',
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
        async crearHorario(id, start_time, end_time) {
            const response = await fetch('http://localhost:8000/api/schedules', {
                method: 'POST',
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
    },
};
</script>

<template>
    <div class="modal fade" id="adminModalEspacios" tabindex="-1" aria-labelledby="adminModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="adminModalLabel">Crear Espacio</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarEspacio">
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="espacioData.nombre" placeholder="Nombre">
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="espacioData.descripcion" placeholder="Descripción">
                        </div>
                        <div class="mb-3">
                            <input type="number" class="form-control" v-model="espacioData.capacidad" placeholder="Capacidad">
                        </div>
                        <div class="row">
                            <div class="col mb-3">
                                <select id="horarioSelect" class="form-select" v-model="espacioData.start_time" required>
                                    <option value="" disabled selected>Hora de apertura</option>
                                    <option value="07:00">7:00</option>
                                    <option value="09:00">9:00</option>
                                    <option value="11:00">11:00</option>
                                </select>
                            </div>
                            <div class="col mb-3">
                                <select id="horarioSelectEnd" class="form-select" v-model="espacioData.end_time" required>
                                    <option value="" disabled selected>Hora de cierre</option>
                                    <option value="13:00">13:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="17:00">17:00</option>
                                </select>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">Crear</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>