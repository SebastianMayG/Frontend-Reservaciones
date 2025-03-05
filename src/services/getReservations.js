// src/services/getReservations.js

export async function getReservations() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/reservations/user', {
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