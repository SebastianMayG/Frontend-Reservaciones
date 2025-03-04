import { createRouter, createWebHistory } from 'vue-router';
import VisualizarReservas from '../view/VisualizarReservas.vue';
import IniciarSesion from '../view/IniciarSesion.vue';
import SingIn from '../view/SingIn.vue';
import TusReservaciones from '@/view/TusReservaciones.vue';

const routes = [
    {
        path: '/VisualizarReservas',
        name : "VisualizarReservas",
        component: VisualizarReservas
    },
    {
        path: '/IniciarSesion',
        name : "IniciarSesion",
        component: IniciarSesion
    }, 
    {
        path: '/SingIn',
        name : "SingIn",
        component: SingIn
    },
    {
        path:'/TusReservaciones',
        name: "TusReservaciones",
        component: TusReservaciones
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;