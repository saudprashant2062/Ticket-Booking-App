import Reservation from '../models/Reservation.js';
import {
  createReservation,
  confirmBooking,
  releaseExpiredReservations,
} from '../services/reservationService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const reserveSeats = asyncHandler(async (req, res) => {
  const { eventId, seatNumbers } = req.body;
  const userId = req.user._id;

  await releaseExpiredReservations();

  try {
    const reservation = await createReservation(userId, eventId, seatNumbers);

    res.status(201).json({
      success: true,
      message: 'Seats reserved successfully',
      data: {
        reservationId: reservation._id,
        seatNumbers: reservation.seatNumbers,
        expiresAt: reservation.expiresAt,
        timeRemaining: Math.ceil(
          (reservation.expiresAt - new Date()) / 1000
        ),
      },
    });
  } catch (error) {
    await releaseExpiredReservations();
    throw error;
  }
});

export const createBooking = asyncHandler(async (req, res) => {
  const { reservationId } = req.body;
  const userId = req.user._id;

  await releaseExpiredReservations();

  const reservation = await confirmBooking(userId, reservationId);

  res.status(200).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: {
      reservationId: reservation._id,
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
      bookedAt: reservation.updatedAt,
    },
  });
});

export const getActiveReservation = asyncHandler(async (req, res) => {
  const { eventId } = req.query;
  const userId = req.user._id;

  await releaseExpiredReservations();

  const query = {
    userId,
    status: 'active',
    expiresAt: { $gt: new Date() },
  };

  if (eventId) {
    query.eventId = eventId;
  }

  const reservation = await Reservation.findOne(query)
    .populate('eventId', 'name dateTime venue')
    .sort({ createdAt: -1 });

  if (!reservation) {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

  const timeRemaining = Math.max(
    0,
    Math.ceil((reservation.expiresAt - new Date()) / 1000)
  );

  res.status(200).json({
    success: true,
    data: {
      reservationId: reservation._id,
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
      expiresAt: reservation.expiresAt,
      timeRemaining,
    },
  });
});