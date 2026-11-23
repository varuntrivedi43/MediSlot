const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { doctors } = require("./data");
const Booking = require("./models/Booking");

const app = express();
const Query = require("./models/Query");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const User = require("./models/User");

// POST API for Customer Queries
app.post('/api/queries', async (req, res) => {
  try {
    const { userName, userPhone, subject, message } = req.body;
    const newQuery = new Query({ userName, userPhone, subject, message });
    await newQuery.save();
    res.status(201).json({ message: "Query submitted successfully. We will contact you soon." });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit query" });
  }
});

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
// AUTHENTICATION API (MongoDB)
// -------------------------

// 1. Register New User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone number are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Account already exists with this phone number. Please login.' });
    }

    const newUser = new User({ name, phone, email });
    await newUser.save();

    console.log("✅ User registered:", newUser.name);
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    console.error("Auth Register Error:", err.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// 2. Login User (by Phone)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this phone number. Please register.' });
    }

    console.log("✅ User logged in:", user.name);
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error("Auth Login Error:", err.message);
    res.status(500).json({ error: 'Failed to login' });
  }
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
        specialty: b.specialty, // Specialty add ki
        clinic: b.clinic,       // Clinic add kiya
        slot: b.slot,
        patientName: b.patientName,
        patientPhone: b.patientPhone, // phone ki jagah patientPhone
        createdAt: b.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { doctorId, slot, patientName, patientPhone, doctorName, specialty, clinic } = req.body;

    // Ye line terminal mein dikhayegi ki kya data aaya
    console.log("New Booking Request for Doctor ID:", doctorId, "at Slot:", slot);

    // Check if slot already booked
    const existing = await Booking.findOne({ doctorId, slot });
    if (existing) {
      console.log("❌ Conflict: Slot already taken in Database");
      return res.status(400).json({ message: "This slot is already booked for this doctor." });
    }

    const newBooking = new Booking({
      doctorId,
      doctorName,
      specialty,
      clinic,
      slot,
      patientName,
      patientPhone
    });

    await newBooking.save();
    console.log("✅ Booking Saved Successfully!");
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (err) {
    console.error("❌ Backend Error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
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