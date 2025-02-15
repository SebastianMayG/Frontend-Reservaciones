<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import { RouterLink,RouterView } from 'vue-router';
//import { useRouter } from 'vue-router';

//const router = useRouter();

export default {
    name: 'CrearReservaciones',
};
</script>

<template>
    <div class="container d-flex justify-content-center">
        <div class='card w-50 bordes'>
            <form action="crear_reservacion" method="post">
                <div class='row m-2'>
                    <select name="nameSala" id="nameSala" required>
                        <option value="" disabled selected>Seleccione una Sala</option>
                        <option value="CIC Sala 1">CIC Sala 1</option>
                        <option value="CIC Sala 2">CIC Sala 2</option>
                        <option value="CIC Sala 3">CIC Sala 3</option>
                        <option value="CIC Sala 4">CIC Sala 4</option>
                        <option value="CIC Sala de actos">CIC Sala de actos</option>
                    </select>
                </div>
                <div class='row m-2'>
                    <input type="number" id="capacidad" name="capacidad" placeholder="Capacidad" required>
                </div>
                <div class='row'>
                    <div class="col-6">
                        <input type="date" id="fecha" name="fecha" placeholder="Fecha" required>
                    </div>
                    <div class="col-6">
                        <input type="time" id="hora" name="hora" placeholder="Hora" required>
                    </div>
                
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