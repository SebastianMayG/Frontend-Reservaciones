<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <img src="@/assets/schoolBooker.png" alt="ClassBooker Logo" class="logo">
        <span class="app-name">ClassBooker</span>
      </div>
      
      <button class="navbar-toggler" @click="toggleMenu">
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
      </button>
      
      <div class="navbar-menu" :class="{'is-active': menuOpen}">
        <ul class="navbar-links">
          <li class="nav-item">
            <RouterLink to="/TusReservaciones" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Tus Reservaciones
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/VistaPracticas" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Ver Prácticas
            </RouterLink>
          </li>
        </ul>
        
        <div class="navbar-actions">
          <RouterLink to="/IniciarSesion" class="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar sesión
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

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

<style scoped>
.navbar {
  background-color: #265A9C;
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
  margin-left: 20px;
}

.logout-btn {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: white;
  color: #265A9C;
}

/* Responsive styles */
@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem 1rem;
  }
  
  .navbar-toggler {
    display: flex;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #265A9C;
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
    gap: 10px;
  }
  
  .nav-link {
    padding: 10px 15px;
    width: 100%;
  }
  
  .navbar-actions {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
  
  .logout-btn {
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