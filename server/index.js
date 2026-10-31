const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { doctors } = require("./data");
const Booking = require("./models/Booking");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root
app.get("/", function (req, res) {
  res.send("MediSlot API is running");
});

// Health
app.get("/api/health", function (req, res) {
  res.json({ status: "ok" });
});

// Doctors list
app.get("/api/doctors", function (req, res) {
  res.json(doctors);
});

// Doctor details
app.get("/api/doctors/:id", function (req, res) {
  const id = req.params.id;

  const doctor = doctors.find(function (d) {
    return d.id === id;
  });

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json(doctor);
});

// -------------------------
// BOOKINGS API (MongoDB)
// -------------------------

// Get all bookings
app.get("/api/bookings", async function (req, res) {
  try {
    const docs = await Booking.find().sort({ createdAt: -1 });

    res.json(
      docs.map((b) => ({
        id: String(b._id),
        doctorId: b.doctorId,
        doctorName: b.doctorName,
        slot: b.slot,
        patientName: b.patientName,
        phone: b.phone,
        createdAt: b.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

// Create booking
app.post("/api/bookings", async function (req, res) {
  try {
    const doctorId = req.body.doctorId;
    const slot = req.body.slot;
    const patientName = req.body.patientName;
    const phone = req.body.phone;

    if (!doctorId || !slot || !patientName || !phone) {
      return res.status(400).json({
        error: "doctorId, slot, patientName, phone are required",
      });
    }

    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const doc = await Booking.create({
      doctorId,
      doctorName: doctor.name,
      slot,
      patientName,
      phone,
    });

    res.status(201).json({
      id: String(doc._id),
      doctorId: doc.doctorId,
      doctorName: doc.doctorName,
      slot: doc.slot,
      patientName: doc.patientName,
      phone: doc.phone,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    // Duplicate slot booking (unique index)
    if (err && err.code === 11000) {
      return res.status(409).json({
        error: "This slot is already booked for this doctor",
      });
    }
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Cancel booking
app.delete("/api/bookings/:id", async function (req, res) {
  try {
    const id = req.params.id;

    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Booking not found" });

    res.json({ status: "deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});