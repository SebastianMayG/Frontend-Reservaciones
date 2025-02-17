<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import EventForm from '@/components/EventForm.vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    EventForm
  },
  data() {
    return {
      date: '2025-01-01',
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin,TimeGridPlugin,ListPlugin ],
        initialView: 'dayGridMonth',
        dateClick: (info) => {
          this.date = info.dateStr;
          const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
          modal.show(); 
        } 
      }
    }
  }
}
</script>
<template>  
    <div class="container">
        <FullCalendar :options="calendarOptions" />
        <EventForm :date="date"/>
    </div>
</template>