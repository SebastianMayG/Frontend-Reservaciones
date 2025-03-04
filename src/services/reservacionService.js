// src/services/reservacionService.js

export async function crearReservacion(reservacionData) {
    try {
        console.log(reservacionData)
      const response = await fetch('http://127.0.0.1:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservacionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la reservación');
      }

      const data = await response.json();
      console.log('Reservación creada:', data);
      return data;
    } catch (error) {
      console.error('Error al crear la reservación:', error);
      throw error;
    }
  }