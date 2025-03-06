<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
    name: 'ModifyEventForm',
    props: {
        event: Object // Asegúrate de que el prop "event" esté definido
    },
    data() {
        return {
            salas: [], // Lista de salas
            fechaReservacion: '',
            horaReservacion: '',
            salaSeleccionada: '',
            horariosDisponibles: [
                // Añadir horarios disponibles, si los tienes
            ]
        };
    },
    methods: {
        async actualizarReservacion() {
            try {
                const id = this.event._def.publicId; // Obtener el ID de la reservación
                console.log("ID de la reservación:", id); // Verifica que el ID se esté obteniendo correctamente
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        date: this.fechaReservacion,
                        start_time: this.horaReservacion,
                        space_id: this.salaSeleccionada
                    })
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log("Reservación actualizada:", data);

                // Opcional: Mostrar alerta de éxito
                alert("Reservación actualizada con éxito");

                // Recargar la página o actualizar la lista de reservaciones
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar la reservación:', error.message);
                alert("Error al actualizar la reservación");
            }
        },
        async obtenerSalas() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/spaces', {
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
                this.salas = data.data; // Asumiendo que la respuesta es un array de salas
                console.log("Salas obtenidas:", this.salas); // Verifica las salas obtenidas
            } catch (error) {
                console.error('Error al obtener las salas:', error.message);
            }
        },
        async obtenerReservacion(id) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log("Reservación obtenida:", data);

                // Asignar los valores a las propiedades del componente
                this.fechaReservacion = data.data.date || '';
                this.horaReservacion = data.data.start_time || '';
                this.salaSeleccionada = data.data.space_id || '';

                // Marcar el modal como listo para mostrarse
                this.isModalReady = true;
            } catch (error) {
                console.log('Error al obtener la reservación:', error.message);
            }
        },
        async eliminarReservacion(id) {
            if (!id) {
                console.error("Error: El ID de la reservación es undefined");
                return;
            }

            // Mostrar alerta de confirmación
            const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta reservación?");
            if (!confirmacion) {
                return; // Si el usuario cancela, no se ejecuta la eliminación
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                console.log("Reservación eliminada:", data);

                // Opcional: Mostrar alerta de éxito
                alert("Reservación eliminada con éxito");

                // Recargar la página o actualizar la lista de reservaciones
                window.location.reload();
            } catch (error) {
                console.error('Error al eliminar la reservación:', error.message);
                alert("Error al eliminar la reservación");
            }
        },
        async obtenerReservacionesExistente(salaId, fecha) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/reservations/${fecha}/${salaId}`, {
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
                console.log("prpr", data)
                return data.data; // Retorna las reservaciones existentes
            } catch (error) {
                console.error('Error al obtener reservaciones:', error.message);
                return [];
            }
        },
        async obtenerHorariosSala(salaId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/schedules/space/${salaId}`, {
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
                console.log(data)
                console.log(salaId)
                return data.data; // Retorna el horario de una sala en especifico
            } catch (error) {
                console.error('Error al obtener reservaciones:', error.message);
                return [];
            }
        },
    },
    mounted() {
        this.obtenerSalas(); // Obtener las salas al montar el componente
    },
    watch: {
    event: {
        immediate: true, // Ejecuta el watcher inmediatamente al montar el componente
        handler(newEvent) {
            if (newEvent) {
                // id de las reservaciones
                const id = newEvent._def.publicId;
                const idSala = newEvent._def.title;

                let salaId;

                // Asignar un valor único dependiendo de la sala
                if (idSala === "CIC Sala 1") {
                    salaId = 1;
                } else if (idSala === "CIC Sala 2") {
                    salaId = 2;
                } else if (idSala === "CIC Sala 3") {
                    salaId = 3;
                } else if (idSala === "CIC Sala 4") {
                    salaId = 4;
                } else if (idSala === "Sala de Actos") {
                    salaId = 5;
                }

                // Llamar a las funciones con el id adecuado
                this.obtenerReservacion(id);
                this.obtenerReservacionesExistente(salaId, "2025-03-06");
                this.obtenerHorariosSala(salaId); // Pasar el ID numérico de la sala
            }
        }
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
                    <form @submit.prevent="actualizarReservacion">
                        <div class="mb-3">
                            <select class="form-select" name="nameSala" id="nameSala" v-model="salaSeleccionada" required>
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                                    {{ sala.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <input type="date" id="fecha" class="form-control" name="fecha" v-model="fechaReservacion" required>
                        </div>
                        <div class="mb-3">
                            <select name="hour" id="hour-input" v-model="horaReservacion" required>
                                <option disabled selected>Seleccione un horario</option>
                                <option v-for="horario in horariosDisponibles" :key="horario.value" :value="horario.value">
                                    {{ horario.start }} - {{ horario.end }}
                                </option>
                            </select>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">Modificar</button>
                            <button type="button" class="btn btn-danger" @click="eliminarReservacion(event._def.publicId)">Eliminar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
