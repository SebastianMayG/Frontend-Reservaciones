<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import EventForm from '@/components/EventForm.vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import NavBarUsuario from '@/components/NavBarUsuario.vue'
import ModifyEventForm from '@/components/ModifyEventForm.vue'

export default {
  components: {
    FullCalendar,
    EventForm,
    NavBarUsuario,
    ModifyEventForm
  },
  data() {
    return {
      selectedEvent: {
        start: null,
        end: null,
        title: null,
      },
      date: '2025-01-01',
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
        initialView: 'dayGridMonth',
        dateClick: (info) => {
          this.date = info.dateStr;
          const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
          modal.show();
        },
        displayEventTime: true,
        displayEventEnd: true,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        },
        events: [
          {
            title: 'Sala de Actos',
            start: '2025-02-20T15:00:00',
            end: '2025-02-20T17:00:00',
            extendedProps: {
              status: 'done'
            }
          },
          {
            title: 'CIC Sala 1',
            start: '2025-02-21T07:00:00',
            end: '2025-02-20T09:00:00',
            backgroundColor: 'green',
            borderColor: 'green'
          },
          {
            title: 'CIC Sala 1',
            start: '2025-02-20T09:00:00',
            end: '2025-02-20T11:00:00',
            backgroundColor: 'green',
            borderColor: 'green'
          },
          {
            title: 'CIC Sala 1',
            start: '2025-02-20T07:00:00',
            end: '2025-02-20T09:00:00',
            backgroundColor: 'green',
            borderColor: 'green'
          },
        ],
        eventClick: (info) => {
          this.selectedEvent = {
            start: info.event.start,
            end: info.event.end,
            title: info.event.title,
          };
          console.log("this.selectedEvent:", this.selectedEvent);
          const modifyModal = new bootstrap.Modal(document.getElementById('modifyModal'));
          modifyModal.show();
        },
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
    <ModifyEventForm :event="selectedEvent"/>
  </div>
</template>