import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    seatNumbers: {
      type: [String],
      required: [true, 'Seat numbers are required'],
      validate: {
        validator: function (seats) {
          return seats.length > 0;
        },
        message: 'At least one seat must be reserved',
      },
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration time is required'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });
reservationSchema.index({ userId: 1, eventId: 1, status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;