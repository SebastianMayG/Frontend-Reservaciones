<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin,TimeGridPlugin,ListPlugin ],
        initialView: 'dayGridMonth',
        dateClick: () => {
            window.location.href = "/CrearReservacion";         
        }
      }
    }
  }
}
</script>
<template>
    <div class="container">
        <FullCalendar :options="calendarOptions" />
    </div>
    <button>dadasda</button>
</template>