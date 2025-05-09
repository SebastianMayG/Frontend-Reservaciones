<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center mt-5 mb-3">
  
      <div style="border-radius: 50%" class="mb-2">
        <img :src="require('@/assets/schoolBooker.png')" alt="" class="" style="border-radius: 50%" height="50px" width="50px">
      </div>
      <p class="text-decoration-none">ClassBooker</p>
    </div>
    <div class="login-form mx-auto">
      <form @submit.prevent="login">
        <div class="mb-3 d-flex">
          <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png"
            class="icon m-2">
            <FloatLabel variant = "in" class="w-100">
              <InputText id="email" v-model="email" class="w-100" required/> <!-- Cambia "value" por "email" -->
              <label for="email">Email</label>
            </FloatLabel>
        </div>
        <div class="mb-3 d-flex">
          <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png"
            class="icon m-2">
            <FloatLabel variant = "in" class="w-100">
              <InputText type="password" id="password" v-model="password" class="w-100" required/> <!-- Cambia "value" por "email" -->
              <label for="password">password</label>
            </FloatLabel>
        </div>
        <div class="mb-3 d-flex flex-column align-items-center">
          <button class="btn btn-success mb-2" type="submit">Ingresar</button>
          <p class="mb-1">¿No tienes cuenta?</p>
          <a href="/SingIn" class="link text-decoration-none">Registrarse</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import FloatLabel from 'primevue/floatlabel'; // Importa FloatLabel
import InputText from 'primevue/inputtext'; // Importa InputText
import { config } from '@/config';
export default {
  inject: ['urlBack'],
  components: {
    FloatLabel,
    InputText,
  },
  data() {
    return {
      email: '', // Cambia "value" por "email"
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
.login-form {
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 4px 8px gray;
  border-radius: 15px;
  padding: 1rem 2rem;
}

p,
a {
  color: #265A9C;
  list-style: none;
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
}
</style>