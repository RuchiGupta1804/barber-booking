const express = require("express");
const router = express.Router();

const controller = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

// ---------- CUSTOMER ----------
router.get("/available-slots", controller.getAvailableSlots);
router.post("/book", controller.bookAppointment);

// ---------- BARBER ----------
router.get("/dashboard/summary", protect, controller.getDashboardSummary);
router.get("/leave-affected", protect, controller.getLeaveAffectedAppointments);
router.patch("/:id/cancel", protect, controller.cancelAppointmentByBarber);
router.get("/barber", protect, controller.getBarberAppointments);
router.patch("/:id/complete", protect, controller.markAppointmentCompleted);

module.exports = router;
