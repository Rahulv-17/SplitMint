const mongoose = require('mongoose');

const SettlementSchema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'completed',
  }
}, { timestamps: true });

module.exports = mongoose.model('Settlement', SettlementSchema);
