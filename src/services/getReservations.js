// src/services/getReservations.js
import { config } from '@/config';
export async function getReservations() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/api/reservations/user`, {
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