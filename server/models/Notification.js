const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String, // e.g. 'settlement', 'budget_warning', 'group_invite'
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can point to Group, Settlement, Expense, etc.
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
