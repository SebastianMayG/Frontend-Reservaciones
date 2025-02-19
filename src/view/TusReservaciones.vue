<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import EventForm from '@/components/EventForm.vue'
import NavBarUsuario from '@/components/NavBarUsuario.vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import ModifyEventForm from '@/components/ModifyEventForm.vue';

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
            minTime: '06:00:00',
            maxTime: '19:00:00',
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
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
                    {
                        title: 'Sala de Actos',
                        start: '2025-02-20T11:00:00',
                        end: '2025-02-20T13:00:00',
                        extendedProps: {
                            status: 'done'
                        }
                    },
                    {
                        title: 'CIC Sala 2',
                        start: '2025-02-20T07:00:00',
                        end: '2025-02-20T09:00:00',
                        backgroundColor: 'green',
                        borderColor: 'green'
                    },
                    {
                        title: 'CIC Sala 1',
                        start: '2025-02-20T09:00:00',
                        end: '2025-02-20T11:00:00',
                        backgroundColor: 'red',
                        borderColor: 'red'
                    }
                ],
            }
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