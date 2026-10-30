const cors = require("cors");
const express = require("express");
const { doctors } = require("./data");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// In-memory bookings store (resets when server restarts)
const bookings = [];

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
// BOOKINGS API (in-memory)
// -------------------------

// Get all bookings
app.get("/api/bookings", function (req, res) {
  res.json(bookings);
});

// Create booking
app.post("/api/bookings", function (req, res) {
  const doctorId = req.body.doctorId;
  const slot = req.body.slot;
  const patientName = req.body.patientName;
  const phone = req.body.phone;

  // Required fields
  if (!doctorId || !slot || !patientName || !phone) {
    res.status(400).json({
      error: "doctorId, slot, patientName, phone are required",
    });
    return;
  }

  // Doctor exists?
  const doctor = doctors.find(function (d) {
    return d.id === doctorId;
  });

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  // Conflict check: same doctor + same slot
  const alreadyBooked = bookings.some(function (b) {
    return b.doctorId === doctorId && b.slot === slot;
  });

  if (alreadyBooked) {
    res.status(409).json({
      error: "This slot is already booked for this doctor",
    });
    return;
  }

  const booking = {
    id: String(Date.now()),
    doctorId: doctorId,
    doctorName: doctor.name,
    slot: slot,
    patientName: patientName,
    phone: phone,
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(booking);
  res.status(201).json(booking);
});

// Cancel booking
app.delete("/api/bookings/:id", function (req, res) {
  const id = req.params.id;

  const index = bookings.findIndex(function (b) {
    return b.id === id;
  });

  if (index === -1) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  bookings.splice(index, 1);
  res.json({ status: "deleted" });
});

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});