import { useState, useCallback } from 'react';
import { reservationService } from '../services/reservationService.js';

export const useReservation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reserve = useCallback(async (eventId, seatNumbers) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reservationService.reserveSeats(eventId, seatNumbers);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirm = useCallback(async (reservationId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reservationService.confirmBooking(reservationId);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getActive = useCallback(async (eventId = null) => {
    try {
      const response = await reservationService.getActiveReservation(eventId);
      return response.data;
    } catch (err) {
      return null;
    }
  }, []);

  return {
    reserve,
    confirm,
    getActive,
    isLoading,
    error,
    setError,
  };
};