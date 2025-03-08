<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { actualizarReservacion } from '@/services/UpdateService';

export default {
    name: 'ModifyEventForm',
    props: {
        event: Object,
        date: String,
    },
    data() {
        return {
            reservarConMaestro: false,
            selectedHour: null,
            selectedTitle: null,
            reservacionId: null,
            reservacionData: {
                nameSala: "",
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
    computed: {
        startDate() {
            if (this.event && this.event.start) {
                return this.event.start.toISOString().split('T')[0];
            }
            return null;
        },
    },
    methods: {
        showId() {
            console.log("ID de la reservación:", this.reservacionId);
        },
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
                //console.log("Salas obtenidas:", this.salas);
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
            }
        },
        async updateReservacion() {
            try {

                const hoy = new Date().toISOString().split('T')[0];
                console.log(hoy)

                if (this.reservacionData.fecha <= hoy) {
                    alert("No puede modificar una reservacion en menos de 24 horas a esta");
                    return; // Detiene la ejecución del método
                }
                const horarioSeleccionado = this.reservacionData.hour;
                const start_time = horarioSeleccionado.start
                const end_time = horarioSeleccionado.end;
                const reservacion = {
                    space_id: this.getSalaId(this.reservacionData.nameSala),
                    user_id: parseInt(localStorage.getItem('id')),
                    date: this.reservacionData.fecha,
                    start_time: start_time,
                    end_time: end_time,
                };
                console.log("reservacion enviando", reservacion);

                await actualizarReservacion(this.reservacionId, reservacion);
                const modal = bootstrap.Modal.getInstance(document.getElementById('modifyModal'));
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
        async eliminarReservacion(id) {
            if (!id) {
                console.error("Error: El ID de la reservación es undefined");
                return;
            }
            // Mostrar alerta de confirmación
            const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta reservación?");
            if (!confirmacion) {
                return; // Si el usuario cancela, no se ejecuta la eliminación
            }
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`

                    }
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                console.log("Reservación eliminada:", data);
                // Opcional: Mostrar alerta de éxito
                alert("Reservación eliminada con éxito");
                // Recargar la página o actualizar la lista de reservaciones
                window.location.reload();
            } catch (error) {
                console.error('Error al guardar la reservación:', error);
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
            console.log("Nombre de la sala:", this.reservacionData.nameSala);
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
        async obtenerReservacion(id) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log("Reservación obtenida:", data);

                // Asignar los valores a las propiedades del componente
                this.fechaReservacion = data.data.date || '';
                this.reservacionData.fecha = data.data.date;
                this.horaReservacion = data.data.start_time || '';
                this.salaSeleccionada = data.data.space_id || '';

                // Marcar el modal como listo para mostrarse
                this.isModalReady = true;
            } catch (error) {
                console.log('Error al obtener la reservación:', error.message);
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
        },
        async ejecutarProcesos() {
            try {
                await this.obtenerReservacion(this.reservacionId);
                await this.actualizarDescripcionYCapacidad();
                await this.actualizarHorariosDisponibles();
            } catch (error) {
                console.error(error)
            }
        },
    },
    mounted() {
        this.obtenerSalas();

    },
    watch: {

        'event.title': {
            handler(newTitle) {
                this.selectedTitle = newTitle;
                console.log('titulo', this.selectedTitle)
                this.reservacionData.nameSala = newTitle;
            },
            immediate: true
        },
        'event.id': {
            handler(newId) {
                this.reservacionId = newId;
                this.ejecutarProcesos();

                console.log("ID de la reservación desde watch:", this.reservacionId);
                console.log("nombre de la sala desde el watch ", this.reservacionData.nameSala)
                console.log("fecha de la sala desde el watch", this.reservacionData.fecha)
                console.log("horarios disponibles desde el watch", this.horariosDisponibles);
                this.selectedTitle = this.reservacionData.nameSala;
                console.log('titulo', this.selectedTitle)
                //this.reservacionData.nameSala = newTitle;
            },
            immediate: true
        },

        'reservacionData.nameSala': 'actualizarHorariosDisponibles',
        'reservacionData.fecha': 'actualizarHorariosDisponibles'
    }
};
</script>

<template>
    <div class="modal fade" id="modifyModal" tabindex="-1" aria-labelledby="reservacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservacionModalLabel">Actualizar Reservación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateReservacion">
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
                            <input type="date" id="fecha" class="form-control" name="fecha"
                                v-model="reservacionData.fecha" required>
                        </div>
                        <div class="mb-3">
                            <select id="horarioSelect" class="form-select" v-model="reservacionData.hour" required>
                                <option value="" disabled selected>Seleccione un horario</option>
                                <option v-for="(horario, index) in horariosDisponibles" :key="index" :value="horario">
                                    {{ horario.start }} - {{ horario.end }}
                                </option>
                            </select>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-warning m-2">Modificar</button>
                            <button type="button" class="btn btn-danger"
                                @click="eliminarReservacion(event._def.publicId)">Eliminar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>