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
            }
        };
    },
    methods: {
        async guardarReservacion() {
            try {
                // Mapear los datos del formulario al formato esperado por tu backend
                const reservacion = {
                    space_id: this.getSalaId(this.reservacionData.nameSala), // Ajusta según tu lógica de sala_id
                    date: this.reservacionData.fecha,
                    start_time: this.getHoraInicio(this.reservacionData.hour),
                    end_time: this.getHoraFin(this.reservacionData.hour),
                    user_id: 1, // Asume un user_id por ahora (deberías obtenerlo del usuario autenticado)
                };
                await crearReservacion(reservacion);
                const modal = bootstrap.Modal.getInstance(document.getElementById('reservacionModal'));
                modal.hide();
                window.location.reload();

            } catch (error) {
                // Manejar el error, por ejemplo, mostrar un mensaje al usuario
                console.error('Error al guardar la reservación:', error);
            }
        },
        getSalaId(salaName) {
            // Lógica para obtener el sala_id basado en el nombre de la sala
            switch (salaName) {
                case 'CIC Sala 1':
                    return 1;
                case 'CIC Sala 2':
                    return 2;
                case 'CIC Sala 3':
                    return 3;
                case 'CIC Sala 4':
                    return 4;
                case 'Sala de actos':
                    return 5;
                default:
                    return null;
            }
        },
        getHoraInicio(hour) {
            // Lógica para obtener la hora de inicio basada en la selección de hora
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
            // Lógica para obtener la hora de fin basada en la selección de hora
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
        }
    },
    watch: {
        date(newDate) {
            this.reservacionData.fecha = newDate;
        },
    },
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
                            <select class="form-select" v-model="reservacionData.nameSala" required>
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option value="CIC Sala 1">CIC Sala 1</option>
                                <option value="CIC Sala 2">CIC Sala 2</option>
                                <option value="CIC Sala 3">CIC Sala 3</option>
                                <option value="CIC Sala 4">CIC Sala 4</option>
                                <option value="Sala de actos">Sala de Actos</option>
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
                            <select class="form-select" v-model="reservacionData.hour">
                                <option value="" disable selected> Seleccione un horario </option>
                                <option value="1"> 07:00 - 09:00</option>
                                <option value="2"> 09:00 - 11:00</option>
                                <option value="3"> 11:00 - 13:00</option>
                                <option value="4"> 13:00 - 15:00</option>
                                <option value="5"> 15:00 - 17:00</option>
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