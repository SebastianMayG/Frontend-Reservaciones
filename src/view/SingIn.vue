<template>
    <div class="m-4 form-container justify-content-center">
        <div class="d-flex justify-content-center">
            <form class="shadow-backgrd border-r p-4 form-main" @submit.prevent="registerUser">
                <div class="row-6">
                    <div class="col-12 mb-4">
                        <h1>Registrate en ClassBooker</h1>
                    </div>
                    <div class="col-12 mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
                            class="icon m-2 border-r ">
                        <FloatLabel variant="in" class="w-100">
                            <InputText id="name" v-model="form.name" class="w-100" required />
                            <label for="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div class="col-12 mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
                            class="icon m-2 border-r ">
                        <FloatLabel variant="in" class="w-100">
                            <InputText id="last_name" v-model="form.last_name" class="w-100" required />
                            <label for="last_name">Last Name</label>
                        </FloatLabel>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png"
                            class="icon m-2">
                        <FloatLabel variant="in" class="w-100">
                            <InputText type="email" id="email" v-model="form.email" class="w-100" required />
                            <label for="email">Email</label>
                            <Message v-if="emailError" severity="error" :closable="false" class="absolute ml-2"
                                style="left: 100%; top: 0; white-space: nowrap;">
                                {{ emailError }}
                            </Message>
                        </FloatLabel>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png"
                            class="icon m-2">
                        <FloatLabel variant="in" class="w-100">
                            <InputText type="password" id="password" v-model="form.password" class="w-100" required />
                            <label for="password">Password</label>
                        </FloatLabel>
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
import FloatLabel from 'primevue/floatlabel'; // Importa FloatLabel
import InputText from 'primevue/inputtext'; // Importa InputText
import Message from 'primevue/message';

export default {
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
            fetch('http://127.0.0.1:8000/api/users', {
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

            // 2. El resto de tu código EXACTAMENTE igual
            try {
                const response = await fetch('http://127.0.0.1:8000/api/register', {
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
                    this.emailError = data.message || 'Credenciales incorrectas.'; // Usamos Message aquí también
                    console.log(data.errors);
                }
            } catch (error) {
                console.error('Error al registarte:', error);
                this.emailError = 'Error al registrarse. Intente nuevamente.'; // Usamos Message para errores
            }
        }



    }
};
</script>

<style scoped>
a {
    margin-top: 1rem;
}

.form-container {
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
