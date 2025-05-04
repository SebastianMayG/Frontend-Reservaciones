// src/services/getReservations.js
import { inject } from 'vue';
const urlBackend = inject('urlBack');
export async function getReservations() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${urlBackend}/api/reservations/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json(); // Espera a que la promesa se resuelva
        return Array.isArray(data) ? data : data.data; //retornamos un arreglo
    } catch (error) {
        console.log(error)
        return [];
    }
}