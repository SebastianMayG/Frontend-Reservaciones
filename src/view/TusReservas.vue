<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import EventForm from '@/components/EventForm.vue';
//import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
//import NavBarUsuario from '@/components/NavBarUsuario.vue'

export default {
    components: {
        FullCalendar,
        EventForm,
    },
    data() {
        return {
            date: '2025-01-01',
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay' // user can switch between the two
                },
                events: [
                    {
                        title: 'Sala de Actos',
                        start: '2025-02-20T14:00:00',
                        end: '2025-02-20T16:00:00',
                        extendedProps: {
                            status: 'done'
                        }
                    },
                    {
                        title: 'Sala 1 C',
                        start: '2025-02-20T07:00:00',
                        end: '2025-02-20T09:00:00',
                        backgroundColor: 'green',
                        borderColor: 'green'
                    }
                ],

            }
        }
    }
}
</script>

<template>
    <div class="container">
        <!-- Calendario -->
        <FullCalendar :options="calendarOptions" />

        <!-- Formulario de eventos -->
        <EventForm :date="date" />
    </div>
</template>
