import { createRouter, createWebHistory } from 'vue-router';
import VisualizarReservas from '../view/VisualizarReservas.vue';
import IniciarSesion from '../view/IniciarSesion.vue';
import SingIn from '../view/SingIn.vue';
import TusReservaciones from '@/view/TusReservaciones.vue';
import VisualizarEspacios from '@/view/VisualizarEspacios.vue';

const routes = [
  {
    path: '/',
    redirect: '/IniciarSesion' 
  },
  {
    path: '/VisualizarReservas',
    name: 'VisualizarReservas',
    component: VisualizarReservas,
    meta: { requiresAuth: true, rol: 1 },
  },
  {
    path: '/VisualizarEspacios',
    name: 'VisualizarEspacios',
    component: VisualizarEspacios,
    meta: { requiresAuth: true, rol: 1 },
  },
  {
    path: '/IniciarSesion',
    name: 'IniciarSesion',
    component: IniciarSesion,
  },
  {
    path: '/SingIn',
    name: 'SingIn',
    component: SingIn,
  },
  {
    path: '/TusReservaciones',
    name: 'TusReservaciones',
    component: TusReservaciones,
    meta: { requiresAuth: true, rol: 2 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Lógica de navegación global (guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si el usuario está autenticado
  const userRole = parseInt(localStorage.getItem('rol'), 10); // Obtiene el rol del usuario (convertido a número)

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si no está autenticado y la ruta requiere auth
    next('/IniciarSesion');
  } else if (to.meta.requiresAuth && isAuthenticated) {
    // Si está autenticado pero su rol no coincide
    if (to.meta.rol && to.meta.rol !== userRole) {
      if (userRole === 1 && to.path !== '/VisualizarReservas') {
        next('/VisualizarReservas');
      } else if (userRole === 2 && to.path !== '/TusReservaciones') {
        next('/TusReservaciones');
      } else {
        next(); // Ya está en la ruta correcta
      }
    } else {
      next(); // Tiene acceso permitido
    }
  } else {
    next(); // Ruta pública
  }
});

export default router;
