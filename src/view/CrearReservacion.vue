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
        <div class='card w-50 '>
            <form action="crear_reservacion" method="post">
                <label for="nameSala">Nombre de la Sala: </label>
                <select name="nameSala" id="nameSala">
                    <option value="CIC Sala 1">CIC Sala 1</option>
                    <option value="CIC Sala 2">CIC Sala 2</option>
                    <option value="CIC Sala 3">CIC Sala 3</option>
                    <option value="CIC Sala 4">CIC Sala 4</option>
                    <option value="CIC Sala de actos">CIC Sala de actos</option>
                </select>
                <label for="capacidad">Capacidad: </label>
                <input type="number" id="capacidad" name="capacidad">
            </form>


        </div>
    </div>


</template>

<style></style>