import mongoose from 'mongoose';
import Seat from '../models/Seat.js';
import Reservation from '../models/Reservation.js';

const EXPIRY_MINUTES = parseInt(process.env.RESERVATION_EXPIRY_MINUTES) || 10;

export const createReservation = async (userId, eventId, seatNumbers) => {
  const session = await mongoose.startSession();

  try {
    let reservation;

    await session.withTransaction(async () => {
      const lockedSeats = [];

      for (const seatNumber of seatNumbers) {
        const seat = await Seat.findOneAndUpdate(
          {
            eventId: new mongoose.Types.ObjectId(eventId),
            seatNumber: seatNumber,
            status: 'available',
          },
          { status: 'reserved' },
          { session, new: true }
        );

        if (!seat) {
          throw new Error(`Seat ${seatNumber} is no longer available`);
        }

        lockedSeats.push(seat);
      }

      const existingReservation = await Reservation.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        eventId: new mongoose.Types.ObjectId(eventId),
        status: 'active',
        expiresAt: { $gt: new Date() },
      }).session(session);

      if (existingReservation) {
        throw new Error('You already have an active reservation for this event');
      }

      const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

      reservation = await Reservation.create(
        [
          {
            userId: new mongoose.Types.ObjectId(userId),
            eventId: new mongoose.Types.ObjectId(eventId),
            seatNumbers,
            expiresAt,
            status: 'active',
          },
        ],
        { session }
      );

      reservation = reservation[0];
    });

    return reservation;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const confirmBooking = async (userId, reservationId) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const reservation = await Reservation.findOne({
        _id: new mongoose.Types.ObjectId(reservationId),
        userId: new mongoose.Types.ObjectId(userId),
        status: 'active',
      }).session(session);

      if (!reservation) {
        throw new Error('Reservation not found or already processed');
      }

      if (new Date() > reservation.expiresAt) {
        reservation.status = 'expired';
        await reservation.save({ session });

        await Seat.updateMany(
          {
            eventId: reservation.eventId,
            seatNumber: { $in: reservation.seatNumbers },
            status: 'reserved',
          },
          { status: 'available' },
          { session }
        );

        throw new Error('Reservation has expired. Please select seats again.');
      }

      const seats = await Seat.find({
        eventId: reservation.eventId,
        seatNumber: { $in: reservation.seatNumbers },
      }).session(session);

      const unavailableSeats = seats.filter(
        (seat) => seat.status !== 'reserved'
      );

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
        { status: 'booked' },
        { session }
      );

      reservation.status = 'completed';
      await reservation.save({ session });

      result = reservation;
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const releaseExpiredReservations = async () => {
  const session = await mongoose.startSession();

  try {
    let releasedCount = 0;

    await session.withTransaction(async () => {
      const expiredReservations = await Reservation.find({
        status: 'active',
        expiresAt: { $lte: new Date() },
      }).session(session);

      for (const reservation of expiredReservations) {
        await Seat.updateMany(
          {
            eventId: reservation.eventId,
            seatNumber: { $in: reservation.seatNumbers },
            status: 'reserved',
          },
          { status: 'available' },
          { session }
        );

        reservation.status = 'expired';
        await reservation.save({ session });

        releasedCount++;
      }
    });

    return releasedCount;
  } catch (error) {
    console.error('Error releasing expired reservations:', error);
    return 0;
  } finally {
    await session.endSession();
  }
};

export const cancelReservation = async (userId, reservationId) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const reservation = await Reservation.findOne({
        _id: new mongoose.Types.ObjectId(reservationId),
        userId: new mongoose.Types.ObjectId(userId),
        status: 'active',
      }).session(session);

      if (!reservation) {
        throw new Error('Reservation not found or already processed');
      }

      await Seat.updateMany(
        {
          eventId: reservation.eventId,
          seatNumber: { $in: reservation.seatNumbers },
          status: 'reserved',
        },
        { status: 'available' },
        { session }
      );

      reservation.status = 'expired';
      await reservation.save({ session });

      result = reservation;
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};