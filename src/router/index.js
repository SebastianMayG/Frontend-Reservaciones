import { createRouter, createWebHistory } from 'vue-router';
import VisualizarReservas from '../view/VisualizarReservas.vue';
import IniciarSesion from '../view/IniciarSesion.vue';
import SingIn from '../view/SingIn.vue';
import TusReservaciones from '@/view/TusReservaciones.vue';

const routes = [
  {
    path: '/VisualizarReservas',
    name: 'VisualizarReservas',
    component: VisualizarReservas,
    meta: { requiresAuth: true, rol: 1 }, // Solo para rol 1
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
    meta: { requiresAuth: true, rol: 2 }, // Solo para rol 2
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

  // Verifica si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/IniciarSesion'); // Redirige al login si no está autenticado
  } else if (to.meta.requiresAuth && isAuthenticated) {
    // Verifica si el rol del usuario tiene acceso a la ruta
    if (to.meta.rol && to.meta.rol !== userRole) {
        if(userRole == 1){
            next('/VisualizarReservas'); // Redirige a una ruta por defecto si no tiene permiso
           }else{
            next('/TusReservaciones'); // Redirige a una ruta por defecto si no tiene permiso
           }
      //next('/'); // Redirige a una ruta por defecto si no tiene permiso
    } else {
      next(); // Permite el acceso
    }
  } else {
    next(); // Permite el acceso a rutas públicas
  }
});

export default router;