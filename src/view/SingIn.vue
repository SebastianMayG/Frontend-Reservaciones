<script></script>

<template>
    <div class="m-4 form-container justify-content-center">
        <!-- <div>
            <img src="@/assets/register.jpg" alt="" class="img-rigth img-fluid">
        </div> -->
        <div class="d-flex justify-content-center">
            <form class="shadow-backgrd border-r p-4 form-main">
                <div class="row-6">
                    <div class="col-12">
                        <h1>Registrate en MicroReservas</h1>
                    </div>
                    <div class="col-12 mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" class="icon m-2 border-r ">
                        <input type="text" class="form-control" placeholder="Nombre" required>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" class="icon m-2 border-r">
                        <input type="number" class="form-control" placeholder="Matricula" required>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/education-technology/power-customer-label/email-108.png" class="icon m-2">
                        <input type="email" class="form-control" placeholder="Example@example.com" required>
                    </div>
                    <div class="mb-3 d-flex">
                        <img src="https://icons.veryicon.com/png/o/application/a-group-of-common-linear-icon/password-17.png" class="icon m-2">
                        <input type="password" class="form-control" placeholder="Contraseña" required>
                    </div>
                    <div class="mb-3 d-flex flex-column">
                        <button class="btn btn-success"> Registrate </button>
                        <a href="/IniciarSesion">Iniciar sesión</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style>

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
