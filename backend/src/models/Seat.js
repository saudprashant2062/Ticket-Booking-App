import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'reserved', 'booked'],
        message: 'Status must be available, reserved, or booked',
      },
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ eventId: 1, status: 1 });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;