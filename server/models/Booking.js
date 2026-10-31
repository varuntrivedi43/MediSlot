const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    slot: { type: String, required: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate booking for same doctor + same slot
bookingSchema.index({ doctorId: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);