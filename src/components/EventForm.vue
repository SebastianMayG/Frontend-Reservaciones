<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { crearReservacion } from '@/services/reservacionService';

export default {
    name: 'CrearReservaciones',
    props: {
        date: String
    },
    data() {
        return {
            reservarConMaestro: false,
            reservacionData: {
                nameSala: '',
                descripcion: '',
                capacidad: null,
                fecha: this.date,
                hour: '',
            },
            horariosDisponibles: [], // Array para almacenar los horarios disponibles
            todasLasReservaciones: [], // Array para almacenar las reservaciones existentes
            salas: [] // Array para almacenar las salas obtenidas del backend
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
                this.salas = data.data; // Asumiendo que la respuesta es un array de salas
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
            }
        },
        async guardarReservacion() {
            try {
                const reservacion = {
                    space_id: this.getSalaId(this.reservacionData.nameSala),
                    date: this.reservacionData.fecha,
                    start_time: this.getHoraInicio(this.reservacionData.hour),
                    end_time: this.getHoraFin(this.reservacionData.hour),
                    user_id: parseInt(localStorage.getItem('rol'))
                };
                await crearReservacion(reservacion);
                const modal = bootstrap.Modal.getInstance(document.getElementById('reservacionModal'));
                modal.hide();
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar la reservación:', error);
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
                return data.data; // Retorna las reservaciones existentes
            } catch (error) {
                console.error('Error al obtener reservaciones:', error.message);
                return [];
            }
        },
        async actualizarHorariosDisponibles() {
            if (this.reservacionData.nameSala && this.reservacionData.fecha) {
                const salaId = this.getSalaId(this.reservacionData.nameSala);
                this.todasLasReservaciones = await this.obtenerReservacionesExistente(salaId, this.reservacionData.fecha);

                // Definir todos los horarios posibles
                const todosLosHorarios = [
                    { value: '1', start: '07:00', end: '09:00' },
                    { value: '2', start: '09:00', end: '11:00' },
                    { value: '3', start: '11:00', end: '13:00' },
                    { value: '4', start: '13:00', end: '15:00' },
                    { value: '5', start: '15:00', end: '17:00' }
                ];

                // Filtrar horarios disponibles
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
        getHoraInicio(hour) {
            switch (hour) {
                case '1':
                    return '07:00';
                case '2':
                    return '09:00';
                case '3':
                    return '11:00';
                case '4':
                    return '13:00';
                case '5':
                    return '15:00';
                default:
                    return null;
            }
        },
        getHoraFin(hour) {
            switch (hour) {
                case '1':
                    return '09:00';
                case '2':
                    return '11:00';
                case '3':
                    return '13:00';
                case '4':
                    return '15:00';
                case '5':
                    return '17:00';
                default:
                    return null;
            }
        },
        actualizarDescripcionYCapacidad() {
            const salaSeleccionada = this.salas.find(sala => sala.name === this.reservacionData.nameSala);
            if (salaSeleccionada) {
                this.reservacionData.descripcion = salaSeleccionada.description;
                this.reservacionData.capacidad = salaSeleccionada.capacity;
            } else {
                this.reservacionData.descripcion = '';
                this.reservacionData.capacidad = null;
            }
        }
    },
    watch: {
        date(newDate) {
            this.reservacionData.fecha = newDate;
        },
        'reservacionData.nameSala': 'actualizarHorariosDisponibles',
        'reservacionData.fecha': 'actualizarHorariosDisponibles'
    },
    mounted() {
        this.obtenerSalas();
    }
};
</script>

<template>
    <div class="modal fade" id="reservacionModal" tabindex="-1" aria-labelledby="reservacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservacionModalLabel">Crear Reservación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarReservacion">
                        <div class="mb-3">
                            <select class="form-select" v-model="reservacionData.nameSala" @change="actualizarDescripcionYCapacidad" required>
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option v-for="sala in salas" :key="sala.id" :value="sala.name">
                                    {{ sala.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" v-model="reservacionData.descripcion" placeholder="Descripción" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="number" class="form-control" v-model="reservacionData.capacidad" placeholder="Capacidad" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="date" class="form-control" readonly :value="date">
                        </div>
                        <div class="mb-3">
                            <select class="form-select" v-model="reservacionData.hour" required>
                                <option value="" disabled selected>Seleccione un horario</option>
                                <option v-for="horario in horariosDisponibles" :key="horario.value" :value="horario.value">
                                    {{ horario.start }} - {{ horario.end }}
                                </option>
                            </select>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">Reservar</button>
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