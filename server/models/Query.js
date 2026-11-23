const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  userName: String,
  userPhone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);