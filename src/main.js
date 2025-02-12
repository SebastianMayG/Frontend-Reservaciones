import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)  // Crea la app
app.use(router)             // Usa el enrutador
app.mount('#app')           // Monta la app una vez
