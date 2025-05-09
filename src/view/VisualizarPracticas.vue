<script>
import { config } from '@/config';
export default {
    name: 'PracticesView',
    data() {
        return {
            signatures: [],
            loading: true,
            error: null,
            openAccordions: new Set()
        }
    },
    methods: {
        async fetchSignatures() {
            try {
                this.loading = true;
                const response = await fetch(`${config.API_URL}api/signatures`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Error al cargar las materias');
                this.signatures = await response.json();
            } catch (err) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },
        toggleAccordion(id) {
            if (this.openAccordions.has(id)) {
                this.openAccordions.delete(id);
            } else {
                this.openAccordions.add(id);
            }
        },
        isOpen(id) {
            return this.openAccordions.has(id);
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        },
        openAddPracticeModal() {
            // Implementar lógica para abrir modal de agregar práctica
            console.log('Abrir modal para agregar práctica');
        }
    },
    mounted() {
        this.fetchSignatures();
    }
}
</script>
<template>
    <div class="practices-container">
        <div class="header">
            <button class="add-button" @click="openAddPracticeModal">+ Agregar Práctica</button>
            <h1>Administración de Prácticas</h1>
        </div>

        <div v-if="loading" class="loading">Cargando materias...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <div class="accordion" v-for="signature in signatures" :key="signature.id">
                <button class="accordion-button" @click="toggleAccordion(signature.id)">
                    {{ signature.name }}
                    <span class="toggle-icon">{{ isOpen(signature.id) ? '−' : '+' }}</span>
                </button>
                <div class="accordion-content" :class="{ 'open': isOpen(signature.id) }">
                    <div v-if="signature.practices.length === 0" class="no-practices">
                        No hay prácticas registradas para esta materia
                    </div>
                    <div v-else>
                        <div class="practice-item" v-for="practice in signature.practices" :key="practice.id">
                            <div class="practice-info">
                                <h3>{{ practice.name }}</h3>
                                <a :href="practice.url" target="_blank" class="practice-link">Ver práctica</a>
                            </div>
                            <div class="practice-meta">
                                <span>Creada: {{ formatDate(practice.create_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.practices-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}

.add-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.add-button:hover {
    background-color: #45a049;
}

h1 {
    color: #333;
    margin: 0;
}

.accordion {
    margin-bottom: 10px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.accordion-button {
    width: 100%;
    padding: 15px 20px;
    text-align: left;
    background-color: #2c3e50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.accordion-button:hover {
    background-color: #34495e;
}

.toggle-icon {
    font-size: 1.2em;
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background-color: white;
}

.accordion-content.open {
    max-height: 1000px;
    transition: max-height 0.5s ease-in;
}

.practice-item {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.practice-item:last-child {
    border-bottom: none;
}

.practice-info h3 {
    margin: 0;
    color: #2c3e50;
}

.practice-link {
    color: #3498db;
    text-decoration: none;
    font-size: 0.9em;
}

.practice-link:hover {
    text-decoration: underline;
}

.practice-meta {
    color: #7f8c8d;
    font-size: 0.8em;
}

.no-practices {
    padding: 20px;
    color: #7f8c8d;
    text-align: center;
}

.loading,
.error {
    text-align: center;
    padding: 20px;
    color: #2c3e50;
}

.error {
    color: #e74c3c;
}
</style>