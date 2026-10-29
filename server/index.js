const express = require("express");
const { doctors } = require("./data");

const app = express();
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

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});