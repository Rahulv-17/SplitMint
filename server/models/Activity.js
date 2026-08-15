const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
