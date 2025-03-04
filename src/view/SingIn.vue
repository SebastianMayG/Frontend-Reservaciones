<template>
    <div class="m-4 form-container justify-content-center">
        <div class="d-flex justify-content-center">
            <form class="shadow-backgrd border-r p-4 form-main" @submit.prevent="registerUser">
                <div class="row-6">
                    <div class="col-12">
                        <h1>Registrate en MicroReservas</h1>
                    </div>
                    <div class="col-12 mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" class="icon m-2 border-r ">
                        <input type="text" class="form-control" placeholder="Nombre(s)" v-model="form.name" required>
                    </div>
                    <div class="col-12 mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" class="icon m-2 border-r ">
                        <input type="text" class="form-control" placeholder="Apellidos" v-model="form.last_name" required>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png" class="icon m-2">
                        <input type="email" class="form-control" placeholder="Example@example.com" v-model="form.email" required>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png" class="icon m-2">
                        <input type="password" class="form-control" placeholder="Contraseña" v-model="form.password" required>
                    </div>
                    <div class="mb-3 d-flex flex-column">
                        <button class="btn btn-success" type="submit">Registrate</button>
                        <a href="/IniciarSesion">Iniciar sesión</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: 'Luis A',
                last_name: 'Pollo',
                email: 'al00001@uacam.mx',
                password: 'laravel'
            }
        };
    },
    methods: {
        async registerUser() {
            console.log(JSON.stringify(this.form));
            fetch('http://127.0.0.1:8000/api/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": this.form.name,
                    "last_name": this.form.last_name,
                    "email": this.form.email,
                    "password": this.form.password
                })
            });
        }
    }
};
</script>

<style scoped>

    a {
        margin-top: 1rem;
    }
    .form-container{
        display: flex;
    }
    
    .form-main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        margin: 0 1rem;
    }

    .img-rigth {
        border: 1px solid black;
        width: 65rem;
        height: 50rem;
        margin-right: 2rem;
    }

    .border-r {
        border-radius: 16px;
    }

    .shadow-backgrd {
        box-shadow: 0px 4px 5px gray;
    }

    .icon {
        width: 2rem;
        height: 2rem;
    }

    @media (max-width: 390px) {
        .form-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        /* Oculta la imagen en pantallas pequeñas */
        .img-rigth {
            display: none;
        }

        .form-main {
            width: 90%;
        }

        h1 {
            font-size: medium;
            font-weight: 800;
            margin-bottom: 2rem;
        }

        .icon {
            width: 1.5rem;
            height: 1.5rem;
        }
    }
</style>
