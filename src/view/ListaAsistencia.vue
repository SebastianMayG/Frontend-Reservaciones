<script>
import Toast from 'primevue/toast';
import { config } from '@/config';
export default {
  name: 'ListaAsistencia',
  components: {
    Toast
  },
  data() {
    return {
      reservacion: {
        id: null,
        sala_name: '',
        date: '',
        description: '',
        capacity: '',
        teacher: '',
        reservation: ''
      },
      alumnos: [{
        matricula: null,
        nombre: '',
        focus: true
      }],
      lastTabTime: 0,
      loading: false,
      assistanceId: null,
      pdfLoading: false,
      listaGuardada: false,
      listaExistente: false
    };
  },
  created() {
    this.cargarDatosReservacion();
    this.verificarListaExistente();
  },
  methods: {
    async verificarListaExistente() {
      if (!this.reservacion.id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/api/assistances/reservation/${this.reservacion.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            this.listaExistente = true;
            this.assistanceId = data.id;
            this.listaGuardada = true;
            this.$toast.add({
              severity: 'warn',
              summary: 'Lista ya existente',
              detail: 'Ya existe una lista de asistencia para esta reservación',
              life: 5000
            });
          }
        }
      } catch (error) {
        console.error('Error al verificar lista existente:', error);
      }
    },

    cargarDatosReservacion() {
      this.reservacion.id = parseInt(this.$route.query.id) || null;
      this.reservacion.sala_name = this.$route.query.sala_name || '';
      this.reservacion.date = this.$route.query.date || '';
      this.reservacion.description = this.$route.query.description || '';
      this.reservacion.capacity = this.$route.query.capacity || '';
      this.reservacion.teacher = this.$route.query.teacher || '';
      this.reservacion.reservation = this.$route.query.reservation || '';
    },

    agregarAlumno() {
      const matriculaStr = String(this.alumnos[this.alumnos.length - 1].matricula || '');

      if (matriculaStr.trim() !== '') {
        this.alumnos.push({
          matricula: null,
          nombre: '',
          focus: true
        });
        this.$nextTick(() => {
          const inputs = document.querySelectorAll('.matricula-input');
          if (inputs.length > 0) {
            inputs[inputs.length - 1].focus();
          }
        });
      }
    },
    eliminarAlumno(index) {
      if (this.alumnos.length > 1) {
        this.alumnos.splice(index, 1);
      } else {
        this.alumnos[0].matricula = null;
        this.alumnos[0].nombre = '';
      }
    },
    manejarTab(index, event) {
      const now = new Date().getTime();
      const isDoubleTab = now - this.lastTabTime < 300;
      this.lastTabTime = now;

      const matriculaStr = String(this.alumnos[index].matricula || '');

      if (isDoubleTab || event.shiftKey) {
        event.preventDefault();
        this.agregarAlumno();
      } else if (index === this.alumnos.length - 1 && matriculaStr.trim() !== '') {
        event.preventDefault();
        this.agregarAlumno();
      }
    },

    async enviarAsistencia() {
      if (this.listaExistente) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe una lista de asistencia para esta reservación',
          life: 5000
        });
        return;
      }

      this.loading = true;

      try {
        if (!this.reservacion.id) {
          throw new Error('No se ha seleccionado una reservación válida');
        }

        const alumnosFiltrados = this.alumnos.filter(alumno => {
          const matriculaStr = String(alumno.matricula || '');
          return matriculaStr.trim() !== '';
        });

        if (alumnosFiltrados.length === 0) {
          throw new Error('Debe agregar al menos un alumno');
        }

        const payload = {
          reservation: {
            id: this.reservacion.id
          },
          students: alumnosFiltrados.map(alumno => ({
            id: parseInt(alumno.matricula)
          }))
        };

        // Enviar datos al backend
        const response = await fetch(`${config.API_URL}/api/assistances`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al enviar la asistencia');
        }

        const data = await response.json();
        this.assistanceId = data.id;
        this.listaGuardada = true;
        this.listaExistente = true;

        this.$toast.add({
          severity: 'success',
          summary: 'Asistencia registrada',
          detail: 'La lista de asistencia se ha guardado correctamente',
          life: 3000
        });

      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 5000
        });
      } finally {
        this.loading = false;
      }
    },

    async generarPDF() {
      if (!this.assistanceId) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Primero debe guardar la lista de asistencia',
          life: 5000
        });
        return;
      }

      this.pdfLoading = true;

      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error de autenticación',
            detail: 'No se encontró el token de acceso',
            life: 5000
          });
          return;
        }

        const response = await fetch(`${config.API_URL}/api/assistances/${this.assistanceId}/pdf`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al generar el PDF');
        }

        // Crear un blob con la respuesta y mostrarlo en nueva pestaña
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');

      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error al generar PDF',
          detail: error.message,
          life: 5000
        });
      } finally {
        this.pdfLoading = false;
      }
    },

    guardarLista() {
      this.enviarAsistencia();
    }
  }
};
</script>

<template>
  <Toast />
  <div class="container">
    <h1>Lista de asistencia</h1>
    <div class="reservacion-info">
      <b>Detalles de la reservacion</b>
      <div class="form-group">
        <label for="sala_name">Nombre de la Sala</label>
        <input type="text" id="sala_name" v-model="reservacion.sala_name" disabled>
      </div>
      <div class="form-group">
        <label for="date">Fecha de la Reservación</label>
        <input type="date" id="date" v-model="reservacion.date" disabled>
      </div>
      <div class="form-group">
        <label for="description">Descripción de la Sala</label>
        <input type="text" id="description" v-model="reservacion.description" disabled>
      </div>
      <div class="form-group">
        <label for="capacity">Capacidad de la Sala</label>
        <input type="text" id="capacity" v-model="reservacion.capacity" disabled>
      </div>
      <div class="form-group">
        <label for="teacher">Profesor</label>
        <input type="text" id="teacher" v-model="reservacion.teacher" disabled>
      </div>
      <div class="form-group">
        <label for="reservation">Hora de Reservación</label>
        <input type="text" id="reservation" v-model="reservacion.reservation" disabled>
      </div>
    </div>

    <div class="asistencia-section">
      <b>Asistencia</b>
      <div v-if="listaExistente" class="lista-existente-message">
        <p>Ya se ha generado una lista de asistencia para esta reservación.</p>
        <p>Puedes generar el PDF nuevamente si lo necesitas.</p>
      </div>
      <div v-else>
        <div v-for="(alumno, index) in alumnos" :key="index" class="alumno-input-group">
          <div class="form-group">
            <label :for="'matricula-' + index">Matrícula</label>
            <input :id="'matricula-' + index" type="number" v-model.number="alumno.matricula" class="matricula-input"
              @keydown.tab="manejarTab(index, $event)" @keyup.enter="agregarAlumno" :ref="'matricula-' + index"
              :autofocus="alumno.focus">
          </div>
          <button @click="eliminarAlumno(index)" class="btn-eliminar" v-if="alumnos.length > 1">
            ×
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="agregarAlumno" class="btn-agregar" v-if="!listaExistente">
          + Agregar Alumno
        </button>
        <button @click="guardarLista" class="btn-generar" :disabled="loading || listaExistente">
          {{ loading ? 'Procesando...' : (listaExistente ? 'Lista ya guardada' : 'Guardar lista de asistencia') }}
        </button>
        <button @click="generarPDF" class="btn-PDF" :disabled="!listaGuardada || pdfLoading">
          {{ pdfLoading ? 'Generando...' : '📄 Generar PDF' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.reservacion-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input:disabled {
  background: #eee;
}

.asistencia-section {
  background: #fff;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.alumno-input-group {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 15px;
  position: relative;
}

.alumno-input-group .form-group {
  flex: 1;
  margin-bottom: 0;
}

.btn-eliminar {
  background: #ff4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  margin-bottom: 8px;
}

.btn-eliminar:hover {
  background: #cc0000;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-agregar {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-agregar:hover {
  background: #45a049;
}

.btn-generar {
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-PDF {
  background: #f32121;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-generar:hover {
  background: #0b7dda;
}

.btn-PDF:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn-generar:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.lista-existente-message {
  background: #fff8e1;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border-left: 4px solid #ffc107;
}
</style>