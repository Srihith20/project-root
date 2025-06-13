const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  file: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  certificates: {
    type: [String],
    required: true,
  },
  bookingCount: {
    type: Number,
    default: 1, // Default to 1, assuming each document is one booking
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);