<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import { RouterLink,RouterView } from 'vue-router';
//import { useRouter } from 'vue-router';

//const router = useRouter();

export default {
    name: 'CrearReservaciones',
    data() {
        return {
            reservarConMaestro: false, // Estado para el checkbox
        };
    }
};
</script>

<template>
    <div class="container d-flex justify-content-center">
        <div class='card p-3 w-50 bordes'>
            <form action="crear_reservacion" method="post">
                <div class="row mb-3">
                    <div class="col-12">
                        <select class="form-select" name="nameSala" id="nameSala" required>
                            <option value="" disabled selected>Seleccione una Sala</option>
                            <option value="CIC Sala 1">CIC Sala 1</option>
                            <option value="CIC Sala 2">CIC Sala 2</option>
                            <option value="CIC Sala 3">CIC Sala 3</option>
                            <option value="CIC Sala 4">CIC Sala 4</option>
                            <option value="CIC Sala de actos">CIC Sala de actos</option>
                        </select>
                    </div>
                </div>
                <div class='row mb-3'>
                    <div class="col-12">
                        <input type="text" class="form-control" id="descripcion" name="descripcion" placeholder="Descripción" required>
                    </div>
                </div>
                <div class='row mb-3'>
                    <div class="col-12">
                        <input type="number" class="form-control" id="capacidad" name="capacidad" placeholder="Capacidad" required>
                    </div>
                </div>
                <div class='row mb-3'>
                    <div class="col-12 col-md-6 mb-3">
                        <input type="date" id="fecha" class="form-control" name="fecha" placeholder="Fecha" required>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <input type="time" id="hora" class="form-control" name="hora" placeholder="Hora" required>
                    </div>
                </div>
                <div class='row mb-3'>
                    <div class="col-12">
                        <input class="form-check-input" type="checkbox" value="" id="reservarConMaestro" v-model="reservarConMaestro">
                        <label class="form-check-label" for="reservarConMaestro">
                            Reservar con maestro
                        </label>
                    </div>
                </div>
                <div class='row mb-3' v-if="reservarConMaestro">
                    <div class="col-12">
                        <select class="form-select" name="nombreDelMaestro" id="nombreDelMaestro" required>
                            <option value="" disabled selected>Nombre del profesor</option>
                            <option value="Maestro 1">Maestro 1</option>
                            <option value="Maestro 2">Maestro 2</option>
                            <option value="Maestro 3">Maestro 3</option>
                        </select>
                    </div>
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-primary">Reservar</button>
                </div>
            </form>
        </div>
    </div>


</template>

<style>
.bordes {
    border-radius: 10px;
}
</style>