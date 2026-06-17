import express from 'express';
import {
  reserveSeats,
  createBooking,
  getActiveReservation,
} from '../controllers/reservationController.js';
import { protect } from '../middleware/auth.js';
import { reserveValidation, bookingValidation } from '../middleware/validators.js';

const router = express.Router();

router.post('/reserve', protect, reserveValidation, reserveSeats);
router.post('/bookings', protect, bookingValidation, createBooking);
router.get('/reservations/active', protect, getActiveReservation);

export default router;