const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  files: [{ type: String, default: [] }],
  capacity: { type: Number, required: true },
  status: { type: String, default: 'available' },
  certificates: {
    type: [String], // Changed to array
    enum: [
      'PDC',
      'CMM',
      'sem-wise-marks-memo',
      'TC',
      'Bonafide',
      'Conduct certificate',
      'No due certificate',
      'LoR',
    ],
    required: true,
  },
});

module.exports = mongoose.model('Slot', slotSchema);