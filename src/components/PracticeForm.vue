<script>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { config } from '@/config';

export default {
    name: 'PracticeFormModal',
    components: {
        Dialog,
        Dropdown,
        InputText,
        Button
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        signatures: {
            type: Array,
            required: true
        }
    },
    emits: ['update:modelValue', 'practice-created'],
    setup(props, { emit }) {
        const toast = useToast();
        const selectedSignature = ref(null);
        const loading = ref(false);

        const internalVisible = ref(props.modelValue);

        // Sincronizar cambios en la prop (padre → hijo)
        watch(() => props.modelValue, (newVal) => {
            internalVisible.value = newVal;
        });

        // Sincronizar cambios en internalVisible (hijo → padre)
        watch(internalVisible, (newVal) => {
            emit('update:modelValue', newVal);
        });

        const practice = ref({
            name: '',
            url: '',
            signature: null
        });

        const errors = ref({
            signature: null,
            name: null,
            url: null
        });

        const validateForm = () => {
            let isValid = true;
            errors.value = {
                signature: null,
                name: null,
                url: null
            };

            if (!selectedSignature.value) {
                errors.value.signature = 'Debe seleccionar una asignatura';
                isValid = false;
            }

            if (!practice.value.name.trim()) {
                errors.value.name = 'El título es obligatorio';
                isValid = false;
            }

            if (!practice.value.url.trim()) {
                errors.value.url = 'La URL es obligatoria';
                isValid = false;
            }

            return isValid;
        };

        const savePractice = async () => {
            if (!validateForm()) return;

            try {
                loading.value = true;

                const payload = {
                    name: practice.value.name,
                    url: practice.value.url,
                    signature: {
                        id: selectedSignature.value
                    }
                };

                console.log(JSON.stringify(payload))

                const token = localStorage.getItem('token');
                const response = await fetch(`${config.API_URL}/api/practices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Error al crear la práctica');
                }

                const data = await response.json();

                toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Práctica creada correctamente',
                    life: 3000
                });

                emit('practice-created', data);
                closeModal();
                window.location.reload();
            } catch (error) {
                console.error('Error saving practice:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'No se pudo crear la práctica',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        const closeModal = () => {
            internalVisible.value = false;
            resetForm();
        };

        const resetForm = () => {
            practice.value = {
                name: '',
                url: '',
                signature: null
            };
            selectedSignature.value = null;
            errors.value = {
                signature: null,
                name: null,
                url: null
            };
        };

        return {
            internalVisible,
            selectedSignature,
            practice,
            errors,
            loading,
            savePractice,
            closeModal
        };
    }
};
</script>

<template>
    <Dialog v-model:visible="internalVisible" :style="{ width: '500px' }" header="Agregar Práctica" :modal="true">
        <div class="p-fluid">
            <div class="p-field">
                <label for="signature">Asignatura</label>
                <div>
                    <Dropdown id="signature" v-model="selectedSignature" :options="signatures" optionLabel="name"
                        optionValue="id" placeholder="Selecciona una asignatura"
                        :class="{ 'p-invalid': errors.signature }" :style="{ width: '28rem' }" />
                    <small v-if="errors.signature" class="p-error">{{ errors.signature }}</small>
                </div>
            </div>

            <div class="p-field">
                <label for="name">Título de la práctica</label>
                <div>
                    <InputText id="name" v-model="practice.name" placeholder="Ingrese el título"
                        :class="{ 'p-invalid': errors.name }" :style="{ width: '28rem' }" />
                    <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
                </div>
            </div>

            <div class="p-field">
                <label for="url">URL</label>
                <div>
                    <InputText id="url" v-model="practice.url" placeholder="Ingrese la URL"
                        :class="{ 'p-invalid': errors.url }" :style="{ width: '28rem' }" />
                    <small v-if="errors.url" class="p-error">{{ errors.url }}</small>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeModal" />
            <Button label="Guardar" icon="pi pi-check" :loading="loading" @click="savePractice" />
        </template>
    </Dialog>
</template>

<style scoped>
.p-field {
    margin-bottom: 1.5rem;
}
</style>