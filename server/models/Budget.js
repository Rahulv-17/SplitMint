const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // e.g. "2024-01"
    required: true,
  }
}, { timestamps: true });

// Ensure unique budget per category per month for a user
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
