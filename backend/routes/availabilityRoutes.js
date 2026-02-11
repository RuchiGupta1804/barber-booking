const express = require("express");
const router = express.Router();
const { getAvailableSlots } = require("../controllers/availabilityController");

router.get("/", getAvailableSlots);

module.exports = router;
