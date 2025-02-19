<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
    name: 'CrearReservaciones',
    props: {
        date: String
    },
    data() {
        return {
            reservarConMaestro: false,
        };
    }
};
</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="reservacionModal" tabindex="-1" aria-labelledby="reservacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservacionModalLabel">Crear Reservación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="crear_reservacion" method="post">
                        <div class="mb-3">
                            <select class="form-select" name="nameSala" id="nameSala" required>
                                <option value="" disabled selected>Seleccione una Sala</option>
                                <option value="CIC Sala 1">CIC Sala 1</option>
                                <option value="CIC Sala 2">CIC Sala 2</option>
                                <option value="CIC Sala 3">CIC Sala 3</option>
                                <option value="CIC Sala 4">CIC Sala 4</option>
                                <option value="Sala de actos">Sala de Actos</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" id="descripcion" name="descripcion" placeholder="Descripción" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="number" class="form-control" id="capacidad" name="capacidad" placeholder="Capacidad" disabled>
                        </div>
                        <div class="mb-3">
                            <input type="date" id="fecha" class="form-control" name="fecha" readonly :value="date">
                        </div>
                        <div class="mb-3">
                            <select class="form-select" name="hour" id="hour-input">
                                <option value="" disable selected> Seleccione un horario </option>
                                <option value="1"> 07:00 - 09:00</option>
                                <option value="2"> 09:00 - 11:00</option>
                                <option value="3"> 11:00 - 13:00</option>
                                <option value="4"> 13:00 - 15:00</option>
                                <option value="5"> 15:00 - 17:00</option>  
                            </select>
                        </div>
                        <div class="mb-3">
                            <input class="form-check-input" type="checkbox" id="reservarConMaestro" v-model="reservarConMaestro">
                            <label class="form-check-label" for="reservarConMaestro" style="margin-left: 0.5rem;">
                                Reservar con maestro
                            </label>
                        </div>
                        <div class="mb-3" v-if="reservarConMaestro">
                            <select class="form-select" name="nombreDelMaestro" id="nombreDelMaestro" required>
                                <option value="" disabled selected>Nombre del profesor</option>
                                <option value="Maestro 1">Maestro 1</option>
                                <option value="Maestro 2">Maestro 2</option>
                                <option value="Maestro 3">Maestro 3</option>
                            </select>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary">Reservar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.bordes {
    border-radius: 10px;
}
</style>
