<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { computed } from 'vue';
import { config } from '@/config';

const router = useRouter();
const isLoggedIn = computed(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
});

const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/IniciarSesion');
    return;
  }

  try {
    const response = await fetch(`${config.API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('id');
      router.push('/IniciarSesion');
    } else {
      console.error('Error al cerrar sesión:', response);
      alert('Error al cerrar sesión. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Inténtalo de nuevo.');
  }
};
</script>

<template>
  <nav class="admin-navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <img src="@/assets/schoolBooker.png" alt="ClassBooker Logo" class="logo">
        <span class="app-name">ClassBooker</span>
      </div>
      
      <button class="navbar-toggler" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
      </button>
      
      <div class="navbar-menu" :class="{'is-active': menuOpen}">
        <ul class="navbar-links">
          <li class="nav-item">
            <RouterLink to="/VisualizarReservas" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Visualizar Reservas
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/VisualizarEspacios" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Visualizar Espacios
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/VisualizarPracticas" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Visualizar Prácticas
            </RouterLink>
          </li>
        </ul>
        
        <div class="navbar-actions">
          <template v-if="!isLoggedIn">
            <RouterLink to="/IniciarSesion" class="auth-btn login-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Iniciar sesión
            </RouterLink>
            <RouterLink to="/SingIn" class="auth-btn signup-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Regístrate
            </RouterLink>
          </template>
          <button v-if="isLoggedIn" @click="logout" class="auth-btn logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.admin-navbar {
  background-color: #7E57C2;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
  margin-bottom: 2rem;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.app-name {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.navbar-toggler {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-direction: column;
  gap: 5px;
}

.toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 15px;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-link svg {
  flex-shrink: 0;
}

.navbar-actions {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.auth-btn {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.login-btn {
  border: 1px solid white;
}

.login-btn:hover {
  background-color: white;
  color: #265A9C;
}

.signup-btn {
  background-color: rgba(255, 255, 255, 0.15);
}

.signup-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Responsive styles */
@media (max-width: 992px) {
  .navbar-container {
    flex-wrap: wrap;
  }
  
  .navbar-toggler {
    display: flex;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #7E57C2;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  }
  
  .navbar-menu.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .navbar-links {
    flex-direction: column;
    width: 100%;
    gap: 5px;
  }
  
  .nav-link {
    padding: 10px 15px;
    width: 100%;
  }
  
  .navbar-actions {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }
  
  .auth-btn {
    justify-content: center;
    width: 100%;
  }
  
  .navbar-toggler.is-active .toggler-icon:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  
  .navbar-toggler.is-active .toggler-icon:nth-child(2) {
    opacity: 0;
  }
  
  .navbar-toggler.is-active .toggler-icon:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
</style>

<script>
export default {
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
};
</script>