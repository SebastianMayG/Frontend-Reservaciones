<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import ModalAdmin from '@/components/ModalAdmin.vue';

export default {
  name: 'VisualizarReservas',
  components: {
    ModalAdmin // Aquí se registra el componente
  },
  methods: {
    abrirModal() {
      let modal = new bootstrap.Modal(document.getElementById('adminModal'));
      modal.show();
    }
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="abrirModal">Crear Reservación</button>
    </div>
    <div class="table-responsive">
      <table class="table table-dark table-striped table-responsive">
        <thead>
          <tr>
            <td>Nombre</td>
            <td>Descripción</td>
            <td>Maestro</td>
            <td>Capacidad</td>
            <td>Fecha y hora</td>
            <td>Opciones</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CIC Sala 1</td>
            <td>Sala de computo</td>
            <td>Albus Dumbledore</td>
            <td>40 alumnos</td>
            <td>18/02/2025 | 07:00 - 09:00</td>
            <td>
              <button class="btn btn-warning mx-2">Modificar</button>
              <button class="btn btn-danger mx-2">Eliminar</button>
            </td>
            <!-- Aquí irán los datos de la reservación -->
          </tr>
        </tbody>
      </table>
    </div>
    <ModalAdmin />
  </div>
</template>

<style>

</style>
