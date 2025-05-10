<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <img :src="require('@/assets/schoolBooker.png')" alt="ClassBooker Logo" class="footer-logo">
          <span class="app-name">ClassBooker</span>
        </div>
        
        <div class="footer-links">
          <div class="footer-section">
            <h4>Desarrolladores</h4>
            <ul class="dev-links">
              <li>
                <a href="https://github.com/SebastianMayG" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  Sebastián May
                </a>
              </li>
              <li>
                <a href="https://github.com/SantiagoGMG" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  Santiago May
                </a>
              </li>
              <li>
                <a href="https://github.com/Luisalbertochinpro12" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  Luis Alberto
                </a>
              </li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><router-link to="">Política de Privacidad</router-link></li>
              <li><router-link to="">Términos de Servicio</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 ClassBooker. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #121212;
  color: #ffffff;
  padding: 3rem 0 0;
  margin-top: auto;
  width: 100%;
  border-top: 1px solid #333;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #aaaaaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
}

.footer-section {
  flex: 1;
  min-width: 150px;
}

.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #7E57C2, #333);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-section a,
.footer-section router-link {
  color: #aaaaaa;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-section a:hover,
.footer-section router-link:hover {
  color: #ffffff;
  transform: translateX(5px);
}

.dev-links a {
  font-weight: 500;
}

.footer-section svg {
  transition: all 0.3s ease;
}

.footer-section a:hover svg {
  color: #7E57C2;
  transform: scale(1.1);
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: #777777;
  background-color: rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-section {
    min-width: 100%;
  }
  
  .footer-section h4 {
    margin-bottom: 1rem;
  }
}
</style>