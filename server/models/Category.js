const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // if null, it's a global category
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
