<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import ModalAdmin from '@/components/ModalAdmin.vue';

export default {
  name: 'VisualizarReservas',
  components: {
    ModalAdmin 
  },
  mounted(){
    this.cargarDatos();
  },
  methods: {
    abrirModal() {
      let modal = new bootstrap.Modal(document.getElementById('adminModal'));
      modal.show();
    },
    async cargarDatos() {
    try {
        const reservaciones = await this.obtenerReservaciones();
        const salas = await this.obtenerSalas();
        const maestros = await this.obtenerMaestros();

        let reservacionesObjeto = {};
        for (let i = 0; i < reservaciones.data.length; i++) {

            let space = salas.data.find(sala => sala.id === reservaciones.data[i].space_id);
            let maestro = maestros.data.find(maestro => maestro.id === reservaciones.data[i].user_id);

            if (space && maestro) { // Verificar si space y maestro existen
                reservacionesObjeto[i] = {
                    id: reservaciones.data[i].id,
                    name: space.name,
                    descripcion: space.description,
                    maestro: maestro.name,
                    capacidad: space.capacity,
                    fecha: reservaciones.data[i].date + " | " + reservaciones.data[i].start_time + " - " + reservaciones.data[i].end_time
                };
            } else {
                console.error(`No se encontró sala o maestro para la reservación ${reservaciones.data[i].id}`);
            }
        }

        const tablaBody = document.getElementById('tablaBody');
        const reservacionesArray = Object.values(reservacionesObjeto);
        for (let i = 0; i < reservacionesArray.length; i++) {
            let row = document.createElement('tr');
            row.id = reservacionesArray[i].id;
            tablaBody.appendChild(row);
            let cellname = document.createElement('td');
            let cellDescripcion = document.createElement('td');
            let cellMaestro = document.createElement('td');
            let cellCapacidad = document.createElement('td');
            let cellFecha = document.createElement('td');
            let cellOpciones = document.createElement('td');
            row.appendChild(cellname);
            row.appendChild(cellDescripcion);
            row.appendChild(cellMaestro);
            row.appendChild(cellCapacidad);
            row.appendChild(cellFecha);
            row.appendChild(cellOpciones);
            cellname.innerHTML = reservacionesArray[i].name;
            cellDescripcion.innerHTML = reservacionesArray[i].descripcion;
            cellMaestro.innerHTML = reservacionesArray[i].maestro;
            cellCapacidad.innerHTML = reservacionesArray[i].capacidad;
            cellFecha.innerHTML = reservacionesArray[i].fecha;
            cellOpciones.innerHTML = '<button class="btn btn-warning mx-2">Modificar</button><button class="btn btn-danger mx-2">Eliminar</button>';
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error.message);
    }
},
    async obtenerReservaciones() {
      try {
        console.log(JSON.stringify(this.form));
        const response = await fetch('http://127.0.0.1:8000/api/reservations', {
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
        return data;
      } catch (error) {
        console.error('Error al obtener reservaciones:', error.message);
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
        return data;
      } catch (error) {
        console.error('Error al obtener salas:', error.message);
      }
    },
    async obtenerMaestros(){
      try{
        const response = await fetch('http://127.0.0.1:8000/api/users',{
          method: "GET",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        if(!response.ok){
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
      }catch(error){
        console.error('Error al obtener maestros:', error.message);
      }
    }

  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3 m-4">
      <button class="btn btn-primary" @click="abrirModal">Crear Reservación</button>
    </div>
    <div class="table-responsive m-4">
      <table class="table table-dark table-striped table-responsive" id = "tabla">
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
        <tbody id = "tablaBody">
          <tr>
            <!-- Aquí irán los datos de la reservación -->
          </tr>
        </tbody>
      </table>
    </div>
    <ModalAdmin />
  </div>
</template>

<style></style>
