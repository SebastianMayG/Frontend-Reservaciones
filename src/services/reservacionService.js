// src/services/reservacionService.js

import { config } from '@/config';

export async function crearReservacion(reservacionData) {
    try {
      const token = localStorage.getItem('token');
      console.log(JSON.stringify(reservacionData))
      // const urlBack = inject('urlBack');
      // console.log(urlBack)

      const response = await fetch(`${config.API_URL}/api/reservations`, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
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