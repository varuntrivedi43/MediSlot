const mongoose = require('mongoose');

/**
 * User Schema
 * MediSlot registered patients / users ka data hold karta hai.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ek number se ek hi account
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);