<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import EventForm from '@/components/EventForm.vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import NavBarUsuario from '@/components/NavBarUsuario.vue'

export default {
  components: {
    FullCalendar,
    EventForm,
    NavBarUsuario // Agregado aquí
  },
  data() {
    return {
      date: '2025-01-01',
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
        initialView: 'dayGridMonth',
        dateClick: (info) => {
          this.date = info.dateStr;
          const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
          modal.show();
        },
        displayEventTime: true, // Muestra la hora en los eventos
        displayEventEnd: true,
        eventTimeFormat: { // Personaliza el formato de la hora
          hour: '2-digit', // Formato de la hora (2 dígitos)
          minute: '2-digit', // Formato de los minutos (2 dígitos)
          meridiem: 'short' // AM/PM abreviado (ej: "am" o "pm")
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
          },
          {
            title: 'Sala 1 C',
            start: '2025-02-20T07:00:00',
            end: '2025-02-20T09:00:00',
            backgroundColor: 'green',
            borderColor: 'green'
          },
          {
            title: 'Sala 1 C',
            start: '2025-02-20T07:00:00',
            end: '2025-02-20T09:00:00',
            backgroundColor: 'green',
            borderColor: 'green'
          },

        ],

      }
    }
  }
}
</script>

<template>
  <NavBarUsuario />
  <div class="">
    <FullCalendar :options="calendarOptions" />

    <EventForm :date="date" />
  </div>
</template>
