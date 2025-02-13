<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import { RouterLink,RouterView } from 'vue-router';
//import { useRouter } from 'vue-router';

//const router = useRouter();


export default {
    name: 'IniciarSesion',
};
</script>

<template>
    <div class="center-elements mb-3">
        <div class="center-elements m-5">
            <img src="" alt="">
            <div style="border-radius: 50%; background-color: gray; width: 2rem; height: 2rem;"></div>
            <a href="/">MicroReservas</a>
        </div>
        <div class="login-form">
            <form>
                <div class="mb-3">
                    <label for="EmailInput"> Correo Electronico</label>
                    <div class="mb-3">
                        <input type="email" class="form-control" id="EmailInput">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label"> Contrasena</label>
                    <input type="password" class="form-control" id="passwordInput">
                </div>
                <div class="mb-3 btn-container">
                    <button class="btn btn-success" style="margin: 1rem 0;">Ingresar</button>
                    <p>¿No tienes cuenta?</p>
                    <a href="#" class="link text-decoration-none" style="margin-bottom: 1rem;">Registrarse</a>
                </div>
            </form>
        </div>
        <div class="password-forgot">
            <p>¿Perdiste tu contraseña?</p>
            <a href="#" class="text-decoration-none" style="font-weight: bold;">Recuperar contraseña</a>
        </div>
    </div>
</template>

<style>
    .login-form {
        width: 30vw; 
        margin: 0 25%;
        box-shadow: 0px 4px 8px gray;
        border-radius: 15px;
        padding: 1rem 2rem;
    }

    .btn-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .password-forgot {
        margin: 1rem 0;
        text-align: center;
    }

    p, a {
        color: #265A9C;
        list-style: none;
    }

    .center-elements {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

</style>