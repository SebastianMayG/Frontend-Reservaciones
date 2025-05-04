import { inject } from 'vue';
const urlBackend = inject('urlBack');
export async function actualizarReservacion(id, reservacionData) {
    try {
        const token = localStorage.getItem('token');
        console.log(JSON.stringify(reservacionData));

        // Asegúrate de que 'id' se inserte correctamente en la URL
        const response = await fetch(`${urlBackend}/api/reservations/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservacionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la reservación');
        }

        const data = await response.json();
        console.log('Actualización realizada:', data);
        return data;
    } catch (error) {
        console.error('Error al actualizar la reservación:', error.errors || error.message);
        throw error;
    }
}