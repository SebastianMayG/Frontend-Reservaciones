<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
    name: 'ModifyEventForm',
    props: {
        event: Object,
        date: String
    },
    data() {
        return {
            reservarConMaestro: false,
            selectedHour: null,
            selectedTitle: null
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
        updateSelectedHour() {
            const start_time1 = this.startTime();
            const end_time1 = this.endTime();
            console.log("start_time:", start_time1);
            console.log("end_time:", end_time1);
            if (this.event && this.event.start) {
                const hours = this.event.start.getHours().toString().padStart(2, '0');
                const minutes = this.event.start.getMinutes().toString().padStart(2, '0');
                const time_start= `${hours}:${minutes}`;

                if (time_start >= '07:00' && time_start < '09:00') {
                    this.selectedHour = '1';
                } else if (time_start >= '09:00' && time_start < '11:00') {
                    this.selectedHour = '2';
                } else if (time_start >= '11:00' && time_start < '13:00') {
                    this.selectedHour = '3';
                } else if (time_start >= '13:00' && time_start < '15:00') {
                    this.selectedHour = '4';
                } else if (time_start >= '15:00' && time_start < '17:00') {
                    this.selectedHour = '5';
                }
            }
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
    mounted() {
        console.log("this.event:", this.event);
        console.log("this.event.start:", this.event?.start);
        console.log("this.event.end:", this.event?.end);
        this.updateSelectedHour();
        if (this.event && this.event.title) {
            this.selectedTitle = this.event.title;
        }
    },
    watch: {
        event: {
            handler: 'updateSelectedHour',
            immediate: true
        },
        'event.title': {
            handler(newTitle) {
                this.selectedTitle = newTitle;
            },
            immediate: true
        }
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
                            <select class="form-select" name="nameSala" id="nameSala" required v-model="selectedTitle">
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option value="CIC Sala 1">CIC Sala 1</option>
                                <option value="CIC Sala 2">CIC Sala 2</option>
                                <option value="CIC Sala 3">CIC Sala 3</option>
                                <option value="CIC Sala 4">CIC Sala 4</option>
                                <option value="Sala de Actos">Sala de Actos</option>
                            </select>
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