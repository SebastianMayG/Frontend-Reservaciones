<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TimeGridPlugin from '@fullcalendar/timegrid';
import ListPlugin from '@fullcalendar/list';
import EventForm from '@/components/EventForm.vue';
import NavBarUsuario from '@/components/NavBarUsuario.vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import ModifyEventForm from '@/components/ModifyEventForm.vue';
import { getReservations } from '@/services/getReservations';

export default {
    components: {
        FullCalendar,
        EventForm,
        NavBarUsuario,
        ModifyEventForm,
    },
    data() {
        return {
            selectedEvent: null,
            salas: [],
            date: '2025-01-01',
            slotMinTime: '06:00:00',
            slotMaxTime: '18:00:00',
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,dayGridMonth'
                },
                dateClick: (info) => {
                    const dayOfWeek = info.date.getDay();

                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        this.date = info.dateStr.split('T')[0];
                        const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
                        modal.show();
                    }
                },
                eventClick: (info) => {
                    this.selectedEvent = info.event;
                    const modal = new bootstrap.Modal(document.getElementById('modifyModal'));
                    modal.show();
                },
                events: []
            }
        }
    },
    mounted() {
        this.obtenerSalas();
    },
    methods: {
        async fetchReservations(salas) {
            try {
                const reservations = await getReservations();
                this.formatEvents(reservations,salas);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        },
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
                this.salas = data.data;
                this.fetchReservations(this.salas)
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
            }
        },
        async formatEvents(reservations,salas) {

            const getSalaName = (spaceId) => {
                const sala = salas.find(sala => sala.id === spaceId);
                return sala ? sala.name : 'Sala desconocida'; 
            };

            const getSalaColor = (spaceId) => {
                switch (spaceId) {
                    case 1: return 'green';
                    case 2: return 'red';
                    case 3: return 'blue';
                    case 4: return 'purple';
                    case 5: return 'orange';
                    case 6: return 'violet';
                    case 7: return 'brown'; 
                    case 8: return '#3F51B5';   
                    default: return 'gray';
                }
            };

            const formattedEvents = reservations.map(reservation => ({
                id: reservation.id,
                title: getSalaName(reservation.space_id),
                start: `${reservation.date}T${reservation.start_time}`, // Formato ISO 8601
                end: `${reservation.date}T${reservation.end_time}`,     // Formato ISO 8601
                backgroundColor: getSalaColor(reservation.space_id), // Color del fondo
                borderColor: getSalaColor(reservation.space_id)
            }));

            // Asegurar que Vue detecte el cambio
            this.calendarOptions = {
                ...this.calendarOptions,
                events: [...formattedEvents] // Crear un nuevo array para reactividad
            };
        }
    }
}
</script>

<template>
    <NavBarUsuario />
    <div class="container mb-5">
        <FullCalendar :options="calendarOptions" />
        <EventForm :date="date" />
        <ModifyEventForm :event="selectedEvent" />
    </div>
</template>

<style scoped>
.fc-event {
    margin: 0 !important;
}
</style>