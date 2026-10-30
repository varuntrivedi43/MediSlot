const cors = require("cors");
const express = require("express");
const { doctors } = require("./data");

const app = express();
app.use(cors());
const PORT = 3000;

app.get("/", function (req, res) {
    res.send("MediSlot API is running");
});

app.get("/api/health", function (req, res) {
    res.json({ status: "ok" });
});

app.get("/api/doctors", function (req, res) {
    res.json(doctors);
});

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

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});