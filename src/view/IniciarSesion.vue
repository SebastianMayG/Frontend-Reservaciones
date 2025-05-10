<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo y título -->
      <div class="logo-container">
        <img :src="require('@/assets/schoolBooker.png')" alt="ClassBooker Logo" class="logo">
        <h1 class="app-title">ClassBooker</h1>
        <p class="app-subtitle">Organiza tus reservas de clase</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="login" class="login-form">
        <div class="input-container">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText id="email" v-model="email" class="w-100 input-field" required />
            <label for="email">Correo electrónico</label>
          </FloatLabel>
        </div>

        <div class="input-container">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <FloatLabel variant="in" class="w-100">
            <InputText type="password" id="password" v-model="password" class="w-100 input-field" required />
            <label for="password">Contraseña</label>
          </FloatLabel>
        </div>

        <button class="login-button" type="submit">
          Iniciar sesión
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div class="signup-link">
          <span>¿No tienes cuenta?</span>
          <router-link to="/SingIn" class="link">Regístrate ahora</router-link>
        </div>
      </form>
    </div>

    <div class="login-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>
  </div>
</template>

<script>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { config } from '@/config';

export default {
  inject: ['urlBack'],
  components: {
    FloatLabel,
    InputText,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(`${config.API_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          const token = data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('rol', data.data.role);
          localStorage.setItem('id', data.data.id);
          this.setAuthHeader(token);
          if (localStorage.getItem('rol') == 1) {
            this.$router.push('/VisualizarReservas');
          } else {
            this.$router.push('/TusReservaciones');
          }
        } else {
          alert(data.message || 'Credenciales incorrectas.');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    },
    setAuthHeader(token) {
      fetch(`${config.API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 4px;
}

.app-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding-left: 12px;
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

.login-button {
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

.login-button:hover {
  background-color: #1d4b7e;
  transform: translateY(-2px);
}

.login-button svg {
  transition: transform 0.3s ease;
}

.login-button:hover svg {
  transform: translateX(4px);
}

.signup-link {
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

.login-background {
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

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 0 15px;
  }
}
</style>