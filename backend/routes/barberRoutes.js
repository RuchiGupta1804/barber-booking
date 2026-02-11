// backend/routes/barberRoutes.js
const express = require("express");
const router = express.Router();
const Barber = require("../models/Barber");
const { protect, staffOnly } = require("../middleware/authMiddleware");

// Get all active barbers
router.get("/", async (req, res) => {
  try {
    const barbers = await Barber.find({ isActive: true }).populate("userId", "name");
    res.json(barbers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in barber profile
router.get("/me", protect, staffOnly, async (req, res) => {
  try {
    const barber = await Barber.findOne({ userId: req.user._id });
    if (!barber) return res.status(404).json({ message: "Barber not found" });
    res.json(barber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
