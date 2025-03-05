<template>
    <div class="container">
      <div class="d-flex flex-column align-items-center mt-5 mb-3">
        <img src="" alt="" class="mb-2">
        <div style="border-radius: 50%; background-color: gray; width: 2rem; height: 2rem;" class="mb-2"></div>
        <a href="/" class="text-decoration-none">MicroReservas</a>
      </div>
      <div class="login-form mx-auto">
        <form @submit.prevent="login">
          <div class="mb-3 d-flex">
            <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png" class="icon m-2">
            <input type="email" class="form-control" v-model="email" placeholder="Example@example.com" required>
          </div>
          <div class="mb-3 d-flex">
            <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png" class="icon m-2">
            <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required>
          </div>
          <div class="mb-3 d-flex flex-column align-items-center">
            <button class="btn btn-success mb-2" type="submit">Ingresar</button>
            <p class="mb-1">¿No tienes cuenta?</p>
            <a href="/SingIn" class="link text-decoration-none">Registrarse</a>
          </div>
        </form>
      </div>
      <div class="password-forgot text-center mt-3">
        <p class="mb-1">¿Perdiste tu contraseña?</p>
        <a href="#" class="text-decoration-none fw-bold">Recuperar contraseña</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/login', {
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
            localStorage.setItem('rol',data.data.role);
            localStorage.setItem('id',data.data.id);
            this.setAuthHeader(token);
            if(localStorage.getItem('rol') == 1){
              this.$router.push('/VisualizarReservas');

            }else{
              this.$router.push('/TusReservaciones');
            }
//            this.$router.push('/'); // Redirige a la pagina principal
          } else {
            alert(data.message || 'Credenciales incorrectas.');
          }
        } catch (error) {
          console.error('Error al iniciar sesion:', error);
          alert('Error al iniciar sesion. Intentalo de nuevo.');
        }
      },
      setAuthHeader(token) {
        fetch('http://127.0.0.1:8000/api/users', {
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
    width: 2rem;
    height: 2rem;
  }
  </style>