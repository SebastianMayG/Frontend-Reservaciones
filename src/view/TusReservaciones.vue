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
        ModifyEventForm
    },
    data() {
        return {
            selectedEvent: null,
            date: '2025-01-01',
            slotMinTime: '06:00:00', // Muestra desde las 6 AM
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
                    console.log(dayOfWeek)
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        this.date = info.dateStr.split('T')[0];
                        console.log(this.date);
                        const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
                        modal.show();
                    }
                },
                eventClick: (info) => {
                    this.selectedEvent = info.event;
                    const modal = new bootstrap.Modal(document.getElementById('modifyModal'));
                    modal.show();
                },
                events: [
                ]
            }
        }
    },
    mounted() {
        this.fetchReservations();
    },
    methods: {
        async fetchReservations() {
            try {
                const reservations = await getReservations();
                console.log(reservations)
                this.formatEvents(reservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        },
        formatEvents(reservations) {
            console.log('Reservaciones recibidas:', reservations);

            const getSalaName = (spaceId) => {
                switch (spaceId) {
                    case 1: return 'CIC Sala 1';
                    case 2: return 'CIC Sala 2';
                    case 3: return 'CIC Sala 3';
                    case 4: return 'CIC Sala 4';
                    case 5: return 'Sala de Actos';
                    default: return 'Sala desconocida';
                }
            };

            const getSalaColor = (spaceId) => {
                switch (spaceId) {
                    case 1: return 'green';
                    case 2: return 'red';
                    case 3: return 'blue';
                    case 4: return 'purple';
                    case 5: return 'yellow';
                    default: return 'gray';
                }
            };

            const formattedEvents = reservations.map(reservation => ({
                title: getSalaName(reservation.space_id),
                start: `${reservation.date}T${reservation.start_time}`, // Formato ISO 8601
                end: `${reservation.date}T${reservation.end_time}`,     // Formato ISO 8601
                backgroundColor: getSalaColor(reservation.space_id), // Color del fondo
                borderColor: getSalaColor(reservation.space_id)
            }));

            console.log('Eventos formateados:', formattedEvents);

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
    <NavBarUsuario/>
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