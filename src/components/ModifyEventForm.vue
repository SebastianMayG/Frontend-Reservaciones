<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
    name: 'ModifyEventForm',
    props: {
        event: Object //Se espera un objeto como entrada porque los eventos son de este tipo
        /*
            Esto facilita la recopilacion de la informacion
            Hora,
            Titulo
            Fecha
            ETC
        */ 
    },
    data() {
        return {
            reservarConMaestro: false,
            selectedHour: null
        };
    },
    computed: {
        startDate() {
            if (this.event && this.event.start) {
                return this.event.start.toISOString().split('T')[0];
            }
            return null;
        },
        startTime() {
            if (this.event && this.event.start) {
                const hours = this.event.start.getHours().toString().padStart(2, '0');
                const minutes = this.event.start.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            }
            return null;
        },
        endTime() {
            if (this.event && this.event.end) {
                const hours = this.event.end.getHours().toString().padStart(2, '0');
                const minutes = this.event.end.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            }
            return null;
        }
    },
    methods: {
        updateSelectedHour() {
            if (this.event && this.event.start) {
                const hours = this.event.start.getHours().toString().padStart(2, '0');
                const minutes = this.event.start.getMinutes().toString().padStart(2, '0');
                const time = `${hours}:${minutes}`;

                if (time >= '07:00' && time < '09:00') {
                    this.selectedHour = '1';
                } else if (time >= '09:00' && time < '11:00') {
                    this.selectedHour = '2';
                } else if (time >= '11:00' && time < '13:00') {
                    this.selectedHour = '3';
                } else if (time >= '13:00' && time < '15:00') {
                    this.selectedHour = '4';
                } else if (time >= '15:00' && time < '17:00') {
                    this.selectedHour = '5';
                }
            }
        }
    },
    mounted() {
        console.log("this.event:", this.event);
        console.log("this.event.start:", this.event?.start);
        this.updateSelectedHour();
    },
    watch: {
        event: 'updateSelectedHour'
    }
};
</script>

<template>
    <div class="modal fade" id="modifyModal" tabindex="-1" aria-labelledby="reservacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservacionModalLabel">Modificar Reservación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="modificar_reservacion" method="post">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="title" name="title" :value="event?.title" placeholder="Titulo" required>
                        </div>
                        <div class="mb-3">
                            <input type="date" id="fecha" class="form-control" name="fecha" readonly :value="startDate">
                        </div>
                        <div class="mb-3">
                            <select name="hour" id="hour-input" v-model="selectedHour">
                                <option value="" disable selected> Seleccione un horario </option>
                                <option value="1"> 07:00 - 09:00</option>
                                <option value="2"> 09:00 - 11:00</option>
                                <option value="3"> 11:00 - 13:00</option>
                                <option value="4"> 13:00 - 15:00</option>
                                <option value="5"> 15:00 - 17:00</option>
                            </select>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">Modificar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>