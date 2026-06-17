import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Event date and time are required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [150, 'Venue cannot exceed 150 characters'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats are required'],
      min: [1, 'Total seats must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ dateTime: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;