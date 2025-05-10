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
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { getReservations, deleteReservation } from '@/services/getReservations';
import { config } from '@/config';

export default {
    inject: ['urlBack'],
    components: {
        FullCalendar,
        EventForm,
        NavBarUsuario,
        ModifyEventForm,
        Button,
        Dialog
    },
    data() {
        return {
            showErrorDialog: false,
            showSuccessDialog: false,
            dialogMessage: '',
            selectedEvent: null,
            salas: [],
            date: '2025-01-01',
            slotMinTime: '07:00:00', 
            slotMaxTime: '20:00:00', 
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,dayGridMonth listWeek'
                },
                allDaySlot: false,
                slotDuration: '00:30:00',
                slotMinTime: '07:00:00', 
                slotMaxTime: '20:00:00', 
                firstDay: 7,
                nowIndicator: true,
                editable: false,
                selectable: true,
                dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'short' },
                dateClick: this.handleDateClick,
                eventClick: this.handleEventClick,
                events: []
            }
        }
    },
    mounted() {
        this.obtenerSalas();
    },
    methods: {
        handleDateClick(info) {
            const dayOfWeek = info.date.getDay();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const fechaSeleccionada = new Date(info.date);
            fechaSeleccionada.setHours(0, 0, 0, 0);

            if (fechaSeleccionada < today) {
                this.dialogMessage = "No se puede reservar en una fecha pasada";
                this.showErrorDialog = true;
                return;
            }
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                this.date = info.dateStr.split('T')[0];
                const modal = new bootstrap.Modal(document.getElementById('reservacionModal'));
                modal.show();
            }
        },
        
        async handleEventClick(info) {
            const today = new Date();
            const event = info.event;

            const fechaHoraOriginalEvento = event.start;
            const diferenciaMs = fechaHoraOriginalEvento - today;
            const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

            if (diferenciaHoras < 24) {
                this.dialogMessage = "No puede modificar una reservación con menos de 24 horas de anticipación";
                this.showErrorDialog = true;
                return;
            }

            this.selectedEvent = info.event;
            const modal = new bootstrap.Modal(document.getElementById('modifyModal'));
            modal.show();
        },
        
        async handleDeleteReservation(reservationId) {
            try {
                const response = await deleteReservation(reservationId);
                if (response.ok) {
                    this.dialogMessage = "Reservación eliminada correctamente";
                    this.showSuccessDialog = true;
                    this.obtenerSalas(); // Recargar los datos
                } else {
                    const errorData = await response.json();
                    this.dialogMessage = errorData.message || "Error al eliminar la reservación";
                    this.showErrorDialog = true;
                }
            } catch (error) {
                console.error('Error al eliminar reservación:', error);
                this.dialogMessage = "Error al eliminar la reservación";
                this.showErrorDialog = true;
            }
        },

        async fetchReservations(salas) {
            try {
                const reservations = await getReservations();
                this.formatEvents(reservations, salas);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                this.dialogMessage = "Error al cargar las reservaciones";
                this.showErrorDialog = true;
            }
        },

        async obtenerSalas() {
            try {
                const response = await fetch(`${config.API_URL}/api/spaces`, {
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
                this.fetchReservations(this.salas);
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
                this.dialogMessage = "Error al cargar los espacios disponibles";
                this.showErrorDialog = true;
            }
        },

        formatEvents(reservations, salas) {
            const getSalaName = (spaceId) => {
                const sala = salas.find(sala => sala.id === spaceId);
                return sala ? sala.name : 'Sala desconocida';
            };

            const getSalaColor = (spaceId) => {
                const colors = [
                    '#3F51B5', '#4CAF50', '#F44336', '#9C27B0', 
                    '#FF9800', '#607D8B', '#795548', '#2196F3'
                ];
                return colors[spaceId % colors.length] || '#9E9E9E';
            };

            const formattedEvents = reservations.map(reservation => ({
                id: reservation.id,
                title: getSalaName(reservation.space_id),
                start: `${reservation.date}T${reservation.start_time}`,
                end: `${reservation.date}T${reservation.end_time}`,
                backgroundColor: getSalaColor(reservation.space_id),
                borderColor: getSalaColor(reservation.space_id),
                textColor: '#FFFFFF',
                extendedProps: {
                    description: `Reservado por: ${reservation.user_name || 'Usuario'}`
                }
            }));

            this.calendarOptions = {
                ...this.calendarOptions,
                events: [...formattedEvents]
            };
        }
    }
}
</script>

<template>
    <NavBarUsuario />
    <div class="calendar-container">
        <div class="calendar-header">
            <h2>Calendario de Reservaciones</h2>
            <p>Visualiza y gestiona tus reservas de espacios</p>
        </div>
        
        <div class="calendar-wrapper">
            <FullCalendar :options="calendarOptions" />
        </div>
        
        <EventForm :date="date" @reservation-created="obtenerSalas" />
        <ModifyEventForm 
            :event="selectedEvent" 
            @reservation-updated="obtenerSalas"
            @reservation-deleted="handleDeleteReservation"
        />
        
        <!-- Modal de Error -->
        <Dialog v-model:visible="showErrorDialog" modal header="Error" :style="{ width: '400px' }">
            <div class="dialog-content">
                <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #f44336; margin-bottom: 1rem;"></i>
                <p>{{ dialogMessage }}</p>
            </div>
            <template #footer>
                <Button label="Entendido" @click="showErrorDialog = false" class="p-button-primary" />
            </template>
        </Dialog>
        
        <!-- Modal de Éxito -->
        <Dialog v-model:visible="showSuccessDialog" modal header="Éxito" :style="{ width: '400px' }">
            <div class="dialog-content">
                <i class="pi pi-check-circle" style="font-size: 2rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                <p>{{ dialogMessage }}</p>
            </div>
            <template #footer>
                <Button label="Aceptar" @click="showSuccessDialog = false" class="p-button-success" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.calendar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
}

.calendar-header {
    margin-bottom: 1.5rem;
    text-align: center;
}

.calendar-header h2 {
    color: #7E57C2;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.calendar-header p {
    color: #6c757d;
    font-size: 1rem;
}

.calendar-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 2rem;
}

.dialog-content {
    text-align: center;
    padding: 1rem;
}

/* Estilos personalizados para FullCalendar */
:deep(.fc) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ... (otros estilos de FullCalendar se mantienen igual) ... */

@media (max-width: 768px) {
    .calendar-container {
        padding: 1rem;
    }
    
    :deep(.fc-toolbar) {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    :deep(.fc-toolbar-chunk) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
    }
    
    :deep(.fc-header-toolbar .fc-toolbar-chunk:last-child) {
        order: -1;
    }
}
</style>