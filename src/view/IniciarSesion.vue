<template>
    <div class="container">  <div class="d-flex flex-column align-items-center mt-5 mb-3"> <img src="" alt="" class="mb-2"> <div style="border-radius: 50%; background-color: gray; width: 2rem; height: 2rem;" class="mb-2"></div> <a href="/" class="text-decoration-none">MicroReservas</a>
        </div>
        <div class="login-form mx-auto"> <form>
                <div class="mb-3 d-flex">
                    <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png" class="icon m-2">
                    <input type="email" class="form-control" id="EmailInput" placeholder="Example@example.com" required>
                </div>
                <div class="mb-3 d-flex">
                    <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png" class="icon m-2">
                    <input type="password" class="form-control" id="passwordInput" placeholder="Contraseña" required>
                </div>
                <div class="mb-3 d-flex flex-column align-items-center"> <button class="btn btn-success mb-2">Ingresar</button> <p class="mb-1">¿No tienes cuenta?</p> 
                    <a href="/SingIn" class="link text-decoration-none">Registrarse</a>
                </div>
            </form>
        </div>
        <div class="password-forgot text-center mt-3"> <p class="mb-1">¿Perdiste tu contraseña?</p> <a href="#" class="text-decoration-none fw-bold">Recuperar contraseña</a>
        </div>
    </div>
</template>

<style scoped>
.login-form {
    width: 90%; /* Occupy most of the width on smaller screens */
    max-width: 400px; /* Limit the width on larger screens */
    margin: 0 auto;
    box-shadow: 0px 4px 8px gray;
    border-radius: 15px;
    padding: 1rem 2rem;
}

p, a {
    color: #265A9C;
    list-style: none;
}

.icon {
    width: 2rem;
    height: 2rem;
}

</style>