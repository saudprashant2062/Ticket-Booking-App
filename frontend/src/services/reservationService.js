import api from './api.js';

export const reservationService = {
  reserveSeats: async (eventId, seatNumbers) => {
    const response = await api.post('/reserve', { eventId, seatNumbers });
    return response.data;
  },

  confirmBooking: async (reservationId) => {
    const response = await api.post('/bookings', { reservationId });
    return response.data;
  },

  getActiveReservation: async (eventId = null) => {
    const params = eventId ? { eventId } : {};
    const response = await api.get('/reservations/active', { params });
    return response.data;
  },
};