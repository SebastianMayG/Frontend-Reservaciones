<script>
import { config } from '@/config';
import PracticeFormModal from '@/components/PracticeForm.vue'

export default {
    name: 'PracticesView',
    components: {
        PracticeFormModal
    },
    data() {
        return {
            signatures: [],
            loading: true,
            error: null,
            openAccordions: new Set(),
            showPracticeModal: false,
            // Nuevas propiedades para el diálogo
            showConfirmDialog: false,
            practiceToDelete: null,
            dialogTitle: 'Eliminar práctica',
            dialogMessage: '¿Estás seguro de que quieres eliminar esta práctica? Esta acción no se puede deshacer.'
        }
    },
    methods: {
        async fetchSignatures() {
            try {
                this.loading = true
                const response = await fetch(`${config.API_URL}/api/signatures`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (!response.ok) throw new Error('Error al cargar las materias')
                this.signatures = await response.json()
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        toggleAccordion(id) {
            if (this.openAccordions.has(id)) {
                this.openAccordions.delete(id)
            } else {
                this.openAccordions.add(id)
            }
        },
        isOpen(id) {
            return this.openAccordions.has(id)
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' }
            return new Date(dateString).toLocaleDateString('es-ES', options)
        },
        openAddPracticeModal() {
            this.showPracticeModal = true
        },
        handlePracticeCreated(newPractice) {
            const signature = this.signatures.find(s => s.id === newPractice.signature.id)
            if (signature) {
                if (!signature.practices) signature.practices = []
                signature.practices.push(newPractice)
            }
        },
        confirmDelete(practiceId) {
            this.practiceToDelete = practiceId
            this.showConfirmDialog = true
        },
        async deletePractice() {
            try {
                const response = await fetch(`${config.API_URL}/api/practices/${this.practiceToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                
                if (!response.ok) throw new Error('Error al eliminar la práctica')
                
                this.signatures.forEach(signature => {
                    if (signature.practices) {
                        signature.practices = signature.practices.filter(p => p.id !== this.practiceToDelete)
                    }
                })
                
            } catch (err) {
                this.error = err.message
            } finally {
                this.showConfirmDialog = false
                this.practiceToDelete = null
            }
        },
        cancelDelete() {
            this.showConfirmDialog = false
            this.practiceToDelete = null
        }
    },
    mounted() {
        this.fetchSignatures()
    }
}
</script>

<template>
    <div class="practices-container">
        <div class="header">
            <button class="add-button" @click="openAddPracticeModal">+ Agregar Práctica</button>
            <h1>Administración de Prácticas</h1>
        </div>

        <PracticeFormModal v-model="showPracticeModal" :signatures="signatures"
            @practice-created="handlePracticeCreated" />
        
        <!-- Diálogo de confirmación -->
        <div v-if="showConfirmDialog" class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <h3>{{ dialogTitle }}</h3>
                <p>{{ dialogMessage }}</p>
                <div class="dialog-buttons">
                    <button @click="cancelDelete" class="cancel-button">Cancelar</button>
                    <button @click="deletePractice" class="confirm-button">Eliminar</button>
                </div>
            </div>
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
                    <div v-if="!signature.practices || signature.practices.length === 0" class="no-practices">
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
                                <button class="delete-button" @click.stop="confirmDelete(practice.id)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
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
    display: flex;
    align-items: center;
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

.delete-button {
    background-color: #e74c3c;
    border: none;
    border-radius: 4px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #c0392b;
}

/* Estilos para el diálogo de confirmación */
.confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.confirm-dialog {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-dialog h3 {
    margin-top: 0;
    color: #2c3e50;
}

.confirm-dialog p {
    margin-bottom: 20px;
    color: #34495e;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-button {
    background-color: #f1f1f1;
    color: #333;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

.confirm-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.confirm-button:hover {
    background-color: #c0392b;
}
</style>