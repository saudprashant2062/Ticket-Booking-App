import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ dateTime: 1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  const seats = await Seat.find({ eventId: id }).sort({ seatNumber: 1 });

  const seatGrid = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber.charAt(0);
    if (!seatGrid[row]) {
      seatGrid[row] = [];
    }
    seatGrid[row].push({
      id: seat._id,
      seatNumber: seat.seatNumber,
      status: seat.status,
    });
  });

  const statusCounts = {
    available: seats.filter((s) => s.status === 'available').length,
    reserved: seats.filter((s) => s.status === 'reserved').length,
    booked: seats.filter((s) => s.status === 'booked').length,
  };

  res.status(200).json({
    success: true,
    data: {
      event,
      seats: seatGrid,
      statusCounts,
    },
  });
});