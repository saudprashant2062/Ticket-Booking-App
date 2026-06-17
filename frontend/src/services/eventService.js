import api from './api.js';

export const eventService = {
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },
};