import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// Importa los componentes que utilizas
import DataTable from 'primevue/datatable';
import DataTableColumn  from 'primevue/column';
import ActionButton from 'primevue/button';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'light',
      cssLayer: false
    }
  },
});

// Registra los componentes globalmente
app.component('DataTable', DataTable);
app.component('DataTableColumn', DataTableColumn);
app.component('ActionButton', ActionButton);

app.mount('#app');
