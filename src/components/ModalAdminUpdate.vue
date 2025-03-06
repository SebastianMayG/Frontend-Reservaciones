<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { actualizarReservacion } from '@/services/UpdateService';

export default {
    name: 'ModalAdminUpdate',
    props: {
        reservacionId: {
            type: Number,
            required: true
        }
    },
    data() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return {
            reservacionData: {
                nameSala: '',
                descripcion: '',
                capacidad: null,
                fecha: formattedDate,
                hour: '',
                maestro: '',
            },
            horariosDisponibles: [],
            horariosDeSala: [],
            todasLasReservaciones: [],
            salas: [],
            maestros: [],
            date: formattedDate, // Inicializa 'date' con la fecha actual
        };
    },
    methods: {
        async obtenerSalas() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/spaces', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                this.salas = data.data;
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
            }
        },
        async obtenerMaestros() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/users', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                if (data && data.data) {
                    this.maestros = data.data.filter(user => user.role === 2);
                } else {
                    this.maestros = [];
                }
            } catch (error) {
                console.error('Error al obtener los maestros:', error.message);
            }
        },
        async obtenerMaestrosAll() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/users', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                //console.log("maestrosAll", data.data);
                return data.data;
                
            } catch (error) {
                console.error('Error al obtener los maestros:', error.message);
            }
        },
        async guardarReservacion() {
            try {
                const horarioSeleccionado = this.reservacionData.hour;
                const start_time = horarioSeleccionado.start
                const end_time = horarioSeleccionado.end;
                //const select = document.getElementById('horarioSelect');
               // const textoSeleccionado = select.options[select.selectedIndex].text;
                
                //const [start_time, end_time] = textoSeleccionado.split(' - ');

                //const profesorId = document.getElementById('nombreDelMaestro').value;

                const reservacion = {
                    space_id: this.getSalaId(this.reservacionData.nameSala),
                    date: this.reservacionData.fecha,
                    start_time: start_time,
                    end_time: end_time,
                    user_id: this.reservacionData.maestro
                };
                console.log("reservacion enviando", reservacion);

                await actualizarReservacion(this.reservacionId,reservacion);
                const modal = bootstrap.Modal.getInstance(document.getElementById('adminModalUpdate'));
                modal.hide();
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar la reservación:', error);
            }
        },
        async obtenerReservacionesExistente(salaId, fecha) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${fecha}/${salaId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error('Error al obtener reservaciones:', error.message);
                return [];
            }
        },
        async obtenerHorariosSala(salaId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/schedules/space/${salaId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error('Error al obtener reservaciones:', error.message);
                return [];
            }
        },
        async actualizarHorariosDisponibles() {
            if (this.reservacionData.nameSala && this.reservacionData.fecha) {
                const salaId = this.getSalaId(this.reservacionData.nameSala);
                this.todasLasReservaciones = await this.obtenerReservacionesExistente(salaId, this.reservacionData.fecha);
                this.horariosDeSala = await this.obtenerHorariosSala(salaId);

                const todosLosHorarios = this.horariosDeSala.map(horario => ({
                    value: horario.id?.toString() || '',
                    start: horario.start_time,
                    end: horario.end_time
                }));

                this.horariosDisponibles = todosLosHorarios.filter(horario => {
                    
                    return !this.todasLasReservaciones.some(reserva => {
                        return reserva.start_time === horario.start && reserva.end_time === horario.end;
                    });
                });
            }
        },
        getSalaId(salaName) {
            const sala = this.salas.find(sala => sala.name === salaName);
            return sala ? sala.id : null;
        },
        actualizarDescripcionYCapacidad() {
            const salaSeleccionada = this.salas.find(sala => sala.name === this.reservacionData.nameSala);
            if (salaSeleccionada) {
                this.reservacionData.descripcion = salaSeleccionada.description;
                this.reservacionData.capacidad = salaSeleccionada.capacity;
                this.actualizarHorariosDisponibles();
            } else {
                this.reservacionData.descripcion = '';
                this.reservacionData.capacidad = null;
            }
        },

        async cargarReservacion() {
        if (this.reservacionId) {
            try {
                // 1. Obtener los datos de la reservación
                const responseReservacion = await fetch(`http://127.0.0.1:8000/api/reservations/${this.reservacionId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!responseReservacion.ok) {
                    throw new Error(`Error HTTP: ${responseReservacion.status}`);
                }

                const dataReservacion = await responseReservacion.json();
                const reservacion = dataReservacion.data;

                
                // 2. Obtener los detalles de la sala usando el space_id
                const responseSala = await fetch(`http://127.0.0.1:8000/api/spaces/${reservacion.space_id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!responseSala.ok) {
                    throw new Error(`Error HTTP: ${responseSala.status}`);
                }

                const dataSala = await responseSala.json();
                const sala = dataSala.data;

                //const salaSeleccionada = this.salas.find(sala => sala.name === this.reservacionData.nameSala);
            if (sala) {
                this.reservacionData.nameSala = sala.name;
                this.reservacionData.descripcion = sala.description;
                this.reservacionData.capacidad = sala.capacity;
                this.maestrosAll = await this.obtenerMaestrosAll();
                console.log("id del maestro", reservacion.user_id);
                console.log(this.maestrosAll[reservacion.user_id-1].name + " " + this.maestrosAll[reservacion.user_id-1].last_name);
                this.reservacionData.maestro = reservacion.user_id;
                this.reservacionData.hour = `${reservacion.start_time} - ${reservacion.end_time}`;
                this.actualizarHorariosDisponibles();
            } else {
                this.reservacionData.descripcion = '';
                this.reservacionData.capacidad = null;
            }
/*
                // 3. Obtener los horarios disponibles para la sala en la fecha de la reservación
                const responseHorarios = await fetch(`http://127.0.0.1:8000/api/schedules/space/${reservacion.space_id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!responseHorarios.ok) {
                    throw new Error(`Error HTTP: ${responseHorarios.status}`);
                }

                const dataHorarios = await responseHorarios.json();
                const horarios = dataHorarios.data;

                // 4. Actualizar el estado del componente con los datos obtenidos
                this.reservacionData = {
                    nameSala: sala.name, // Nombre de la sala
                    descripcion: sala.description, // Descripción de la sala
                    capacidad: sala.capacity, // Capacidad de la sala
                    fecha: reservacion.date, // Fecha de la reservación
                    hour: `${reservacion.start_time} - ${reservacion.end_time}`, // Horario de la reservación
                };

                // 5. Actualizar los horarios disponibles
                this.horariosDisponibles = horarios.map(horario => ({
                    value: horario.id?.toString() || '',
                    start: horario.start_time,
                    end: horario.end_time
                }));*/

            } catch (error) {
                console.error('Error al cargar la reservación:', error.message);
            }
        }
    },

    },
    watch: {
    reservacionId: {
        immediate: true,
        handler(newId) {
            console.log("Nuevo ID de la reservación:", newId); // Verifica que el ID sea correcto
            if (newId) {
                this.cargarReservacion();
            }
        }
    }
},
    mounted() {
        this.obtenerSalas();
        this.obtenerMaestros();
        console.log("ID de la reservación:", this.reservacionId);
        console.log("preuba")
    }
};
</script>

<template>
    <div class="modal fade" id="adminModalUpdate" tabindex="-1" aria-labelledby="adminModalUpdateLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="adminModalUpdateLabel">Modificar Reservación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarReservacion">
                        <div class="mb-3">
                            <select class="form-select" v-model="reservacionData.nameSala"
                                @change="actualizarDescripcionYCapacidad" required>
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option v-for="sala in salas" :key="sala.id" :value="sala.name">
                                    {{ sala.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="reservacionData.descripcion"
                                placeholder="Descripción" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="number" class="form-control" v-model="reservacionData.capacidad"
                                placeholder="Capacidad" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="date" id="fecha" class="form-control" name="fecha" placeholder="Fecha" required v-model="reservacionData.fecha">
                        </div>
                        <div class="mb-3">
                            <select id="horarioSelect" class="form-select" v-model="reservacionData.hour" required>
                                <option value="" disabled selected>Seleccione un horario</option>
                                <option v-for="(horario , index) in horariosDisponibles" :key="index"
                                    :value="horario">
                                    {{ horario.start }} - {{ horario.end }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <select class="form-select" name="nombreDelMaestro" id="nombreDelMaestro" v-model="reservacionData.maestro" required>
                                <option value="" disabled selected>Nombre del profesor</option>
                                <option v-for="maestro in maestros" :key="maestro.id" :value="maestro.id">
                                    {{ maestro.name }} {{ maestro.last_name }}
                                </option>
                            </select>
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
<style>
.bordes {
    border-radius: 10px;
}
</style>
