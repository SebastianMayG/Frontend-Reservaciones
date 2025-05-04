<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { crearReservacion } from '@/services/reservacionService';

export default {
    name: 'CrearReservaciones',
    props: {
        date: String
    },
    data() {
        return {
            reservacionData: {
                nameSala: '',
                descripcion: '',
                capacidad: null,
                fecha: this.date,
                hour: '',
            },
            horariosDisponibles: [], // Array para almacenar los horarios disponibles
            horariosDeSala: [], // Array para almacenar los horarios de una sala en especifico
            todasLasReservaciones: [], // Array para almacenar las reservaciones existentes
            salas: [] // Array para almacenar las salas obtenidas del backend
        };
    },
    methods: {
        async obtenerSalas() {
            try {
                const response = await fetch('http://localhost:8000/api/spaces', {
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
                const select = document.getElementById('horarioSelect');
                const textoSeleccionado = select.options[select.selectedIndex].text; // obtiene el texto
                const [start_time, end_time] = textoSeleccionado.split(' - '); // separa las horas
                console.log(start_time, end_time);
                const reservacion = {
                    space_id: this.getSalaId(this.reservacionData.nameSala),
                    date: this.reservacionData.fecha,
                    start_time: start_time,
                    end_time: end_time,
                    user_id: parseInt(localStorage.getItem('id'))
                };
                const reservacionCreada = await crearReservacion(reservacion);
                console.log(reservacionCreada)
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar la reservación:', error);
            }
        },
        async obtenerReservacionesExistente(salaId, fecha) {
            try {
                const response = await fetch(`http://localhost:8000/api/reservations/${fecha}/${salaId}`, {
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
        async obtenerHorariosSala(salaId) {
    try {
        const response = await fetch(`http://localhost:8000/api/schedules/space/${salaId}`, {
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
        console.log("Horarios de la sala ", salaId, ": ", data.data);

        // Dividir el horario en intervalos de 2 horas
        const horariosDivididos = this.dividirHorario(data.data);

        return horariosDivididos; // Retorna el horario dividido en intervalos de 2 horas
    } catch (error) {
        console.error('Error al obtener reservaciones:', error.message);
        return [];
    }
},

// Método para dividir el horario en intervalos de 2 horas
dividirHorario(horario) {
    const horariosDivididos = [];
    const { space_id, start_time, end_time } = horario[0]; // Asumiendo que solo hay un horario en el array

    let horaInicio = this.parseHora(start_time);
    let horaFin = this.parseHora(end_time);

    while (horaInicio < horaFin) {
        const horaFinIntervalo = new Date(horaInicio);
        horaFinIntervalo.setHours(horaFinIntervalo.getHours() + 2);

        if (horaFinIntervalo > horaFin) {
            horaFinIntervalo.setTime(horaFin.getTime());
        }

        horariosDivididos.push({
            space_id: space_id,
            start_time: this.formatHora(horaInicio),
            end_time: this.formatHora(horaFinIntervalo)
        });

        horaInicio = horaFinIntervalo;
    }

    return horariosDivididos;
},

// Método para convertir una hora en formato 'HH:MM' a un objeto Date
parseHora(hora) {
    const [horas, minutos] = hora.split(':');
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0);
    return fecha;
},

// Método para formatear un objeto Date a 'HH:MM'
formatHora(fecha) {
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
},
        async actualizarHorariosDisponibles() {
            if (this.reservacionData.nameSala && this.reservacionData.fecha) {
                const salaId = this.getSalaId(this.reservacionData.nameSala);
                this.todasLasReservaciones = await this.obtenerReservacionesExistente(salaId, this.reservacionData.fecha);
                this.horariosDeSala = await this.obtenerHorariosSala(salaId);

                // Reemplazar el array fijo con los horarios obtenidos del método
                const todosLosHorarios = this.horariosDeSala.map(horario => ({
                    value: horario.id?.toString() || '',
                    start: horario.start_time,
                    end: horario.end_time
                }));

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
    <div class="modal fade" id="reservacionModal" tabindex="-1" aria-labelledby="reservacionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservacionModalLabel">Crear Reservación</h5>
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
                            <input type="date" class="form-control" readonly :value="date">
                        </div>
                        <div class="mb-3">
                            <select id= "horarioSelect" class="form-select" v-model="reservacionData.hour" required>
                                <option value="" disabled selected>Seleccione un horario</option>
                                <option v-for="horario in horariosDisponibles" :key="horario.value"
                                    :value="horario.value">
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