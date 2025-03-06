import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css'; // Iconos de PrimeVue

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);
app.use(router);
app.use(PrimeVue,{
    theme:{
        preset:Aura,
    },
});
app.mount('#app');
