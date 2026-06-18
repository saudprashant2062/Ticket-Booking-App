import mongoose from 'mongoose';
import Seat from '../models/Seat.js';
import Reservation from '../models/Reservation.js';

const EXPIRY_MINUTES = parseInt(process.env.RESERVATION_EXPIRY_MINUTES) || 10;

export const createReservation = async (userId, eventId, seatNumbers) => {
  const existingReservation = await Reservation.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    eventId: new mongoose.Types.ObjectId(eventId),
    status: 'active',
    expiresAt: { $gt: new Date() },
  });

  if (existingReservation) {
    throw new Error('You already have an active reservation for this event');
  }

  const lockedSeats = [];
  for (const seatNumber of seatNumbers) {
    const seat = await Seat.findOneAndUpdate(
      {
        eventId: new mongoose.Types.ObjectId(eventId),
        seatNumber: seatNumber,
        status: 'available',
      },
      { status: 'reserved' },
      { new: true }
    );

    if (!seat) {
      for (const locked of lockedSeats) {
        await Seat.findOneAndUpdate(
          { _id: locked._id },
          { status: 'available' }
        );
      }
      throw new Error(`Seat ${seatNumber} is no longer available`);
    }

    lockedSeats.push(seat);
  }

  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
  const reservation = await Reservation.create({
    userId: new mongoose.Types.ObjectId(userId),
    eventId: new mongoose.Types.ObjectId(eventId),
    seatNumbers,
    expiresAt,
    status: 'active',
  });

  return reservation;
};

export const confirmBooking = async (userId, reservationId) => {
  const reservation = await Reservation.findOne({
    _id: new mongoose.Types.ObjectId(reservationId),
    userId: new mongoose.Types.ObjectId(userId),
    status: 'active',
  });

  if (!reservation) {
    throw new Error('Reservation not found or already processed');
  }

  if (new Date() > reservation.expiresAt) {
    reservation.status = 'expired';
    await reservation.save();

    await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: 'reserved',
      },
      { status: 'available' }
    );

    throw new Error('Reservation has expired. Please select seats again.');
  }

  const seats = await Seat.find({
    eventId: reservation.eventId,
    seatNumber: { $in: reservation.seatNumbers },
  });

  const unavailableSeats = seats.filter((seat) => seat.status !== 'reserved');

  if (unavailableSeats.length > 0) {
    throw new Error(
      `Seats ${unavailableSeats.map((s) => s.seatNumber).join(', ')} are no longer reserved`
    );
  }

  await Seat.updateMany(
    {
      eventId: reservation.eventId,
      seatNumber: { $in: reservation.seatNumbers },
    },
    { status: 'booked' }
  );

  reservation.status = 'completed';
  await reservation.save();

  return reservation;
};

export const releaseExpiredReservations = async () => {
  const expiredReservations = await Reservation.find({
    status: 'active',
    expiresAt: { $lte: new Date() },
  });

  let releasedCount = 0;
  for (const reservation of expiredReservations) {
    await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
        status: 'reserved',
      },
      { status: 'available' }
    );

    reservation.status = 'expired';
    await reservation.save();

    releasedCount++;
  }

  return releasedCount;
};

export const cancelReservation = async (userId, reservationId) => {
  const reservation = await Reservation.findOne({
    _id: new mongoose.Types.ObjectId(reservationId),
    userId: new mongoose.Types.ObjectId(userId),
    status: 'active',
  });

  if (!reservation) {
    throw new Error('Reservation not found or already processed');
  }

  await Seat.updateMany(
    {
      eventId: reservation.eventId,
      seatNumber: { $in: reservation.seatNumbers },
      status: 'reserved',
    },
    { status: 'available' }
  );

  reservation.status = 'expired';
  await reservation.save();

  return reservation;
};