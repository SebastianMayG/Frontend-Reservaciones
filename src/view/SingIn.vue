<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Logo y título -->
      <div class="logo-container">
        <img :src="require('@/assets/schoolBooker.png')" alt="ClassBooker Logo" class="logo">
        <h1 class="app-title">Regístrate en ClassBooker</h1>
        <p class="app-subtitle">Crea tu cuenta para gestionar tus reservas</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="registerUser" class="register-form">
        <div class="input-container">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText id="name" v-model="form.name" class="w-100 input-field" required />
            <label for="name">Nombre</label>
          </FloatLabel>
        </div>

        <div class="input-container">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText id="last_name" v-model="form.last_name" class="w-100 input-field" required />
            <label for="last_name">Apellido</label>
          </FloatLabel>
        </div>

        <div class="input-container email-input" :class="{'has-error': emailError}">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText type="email" id="email" v-model="form.email" class="w-100 input-field" required />
            <label for="email">Correo electrónico</label>
          </FloatLabel>
          <transition name="fade">
            <Message v-if="emailError" severity="error" :closable="false" class="error-message">
              {{ emailError }}
            </Message>
          </transition>
        </div>

        <div class="input-container password-input">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText type="password" id="password" v-model="form.password" class="w-100 input-field" required />
            <label for="password">Contraseña</label>
          </FloatLabel>
        </div>

        <button class="register-button" type="submit">
          Crear cuenta
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div class="login-link">
          <span>¿Ya tienes una cuenta?</span>
          <router-link to="/IniciarSesion" class="link">Inicia sesión</router-link>
        </div>
      </form>
    </div>

    <div class="register-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>
  </div>
</template>

<script>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { config } from '@/config';

export default {
  inject: ['urlBack'],
  components: {
    FloatLabel,
    InputText,
    Message
  },
  data() {
    return {
      form: {
        name: '',
        last_name: '',
        email: '',
        password: ''
      },
      emailError: ''
    };
  },
  methods: {
    setAuthHeader(token) {
      fetch(`${config.API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async registerUser() {
      // 1. Validación del email con PrimeVue Message
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.emailError = 'Ingrese un correo válido (ej: usuario@dominio.com)';
        return; // Detiene la ejecución
      } else {
        this.emailError = ''; // Limpia el error si es válido
      }

      // 2. Registro del usuario
      try {
        const response = await fetch(`${config.API_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.form.name,
            last_name: this.form.last_name,
            email: this.form.email,
            password: this.form.password,
            role: 2
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const token = data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('rol', 2);
          localStorage.setItem('id', data.data.id);

          this.setAuthHeader(token);
          if (localStorage.getItem('rol') == 1) {
            this.$router.push('/VisualizarReservas');
          } else {
            this.$router.push('/TusReservaciones');
          }
        } else {
          this.emailError = data.message || 'Error al registrarse.'; // Usamos Message aquí también
          console.log(data.errors);
        }
      } catch (error) {
        console.error('Error al registrarte:', error);
        this.emailError = 'Error al registrarse. Intente nuevamente.'; // Usamos Message para errores
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.register-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  z-index: 1;
  position: relative;
  animation: fadeIn 0.6s ease-out;
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 3px solid #e9ecef;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: #265A9C;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding-left: 12px;
  position: relative;
}

.input-container:focus-within {
  border-color: #265A9C;
  box-shadow: 0 0 0 3px rgba(38, 90, 156, 0.1);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin-right: 8px;
}

.input-field {
  border: none !important;
  height: 48px;
  flex-grow: 1;
  padding-left: 0 !important;
}

.input-field:focus {
  box-shadow: none !important;
}


.email-input.has-error {
  margin-bottom: 4.2rem; 
  border-color: #ffb4b4;
}

.error-message {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  font-size: 12px;
  z-index: 10;
  background-color: white;
  padding: 6px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ffb4b4;
}

.register-button {
  background-color: #265A9C;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.register-button:hover {
  background-color: #1d4b7e;
  transform: translateY(-2px);
}

.register-button svg {
  transition: transform 0.3s ease;
}

.register-button:hover svg {
  transform: translateX(4px);
}

.login-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #6c757d;
}

.link {
  color: #265A9C;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.link:hover {
  color: #1d4b7e;
  text-decoration: underline;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(38, 90, 156, 0.1) 0%, rgba(38, 90, 156, 0.05) 100%);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
    margin: 0 15px;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .app-subtitle {
    font-size: 13px;
  }

  .email-input.has-error {
    margin-bottom: 2rem;
  }
}
</style>