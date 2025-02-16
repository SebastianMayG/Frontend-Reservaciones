import { createRouter, createWebHistory } from 'vue-router';
import VisualizarReservas from '../view/VisualizarReservas.vue';
import CrearReservacion from '../view/CrearReservacion.vue';
import AgendarReservaciones from '@/view/AgendarReservaciones.vue';
import IniciarSesion from '@/view/IniciarSesion.vue';

const routes = [
    {
        path: '/VisualizarReservas',
        name : "VisualizarReservas",
        component: VisualizarReservas
    },
    {
        path: '/CrearReservacion',
        name : "CrearReservacion",
        component: CrearReservacion
    },
    {
        path: '/AgendarReservaciones',
        name: '/AgendarReservaciones',
        component:AgendarReservaciones,
    },
    {
        path: '/IniciarSesion',
        name : "IniciarSesion",
        component: IniciarSesion
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;