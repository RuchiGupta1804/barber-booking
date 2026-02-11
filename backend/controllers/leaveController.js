const Leave = require("../models/Leave");
const Appointment = require("../models/Appointment");

// IST helpers
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

const getISTDayRange = (dateStr) => {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(`${dateStr}T23:59:59`);
  return {
    dayStart: new Date(start.getTime() - IST_OFFSET),
    dayEnd: new Date(end.getTime() - IST_OFFSET),
  };
};

// Helper
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && aEnd > bStart;

// ---------- GET LEAVE AFFECTED APPOINTMENTS ----------
exports.getLeaveAffectedAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const barberId = req.user._id;

    const { dayStart, dayEnd } = getISTDayRange(date);

    const leave = await Leave.findOne({ barber: barberId, date });
    if (!leave) return res.json([]);

    const appointments = await Appointment.find({
      barber: barberId,
      startTime: { $lt: dayEnd },
      endTime: { $gt: dayStart },
      status: "booked",
    }).populate("services");

    const affected = leave.isFullDay
      ? appointments
      : appointments.filter((appt) =>
          leave.slots.some((l) => {
            const lStart = new Date(`${date}T${l.start}:00`);
            const lEnd = new Date(`${date}T${l.end}:00`);
            return overlaps(appt.startTime, appt.endTime, lStart, lEnd);
          })
        );

    res.json(affected);
  } catch (err) {
    console.error("GET LEAVE AFFECTED ERROR:", err);
    res.status(500).json({ message: "Failed to fetch leave affected" });
  }
};

// ---------- CREATE / UPDATE LEAVE ----------
exports.saveLeave = async (req, res) => {
  try {
    const { date, isFullDay, slots } = req.body;
    const barberId = req.user._id;

    const leave = await Leave.findOneAndUpdate(
      { barber: barberId, date },
      {
        barber: barberId,
        date,
        isFullDay,
        slots: isFullDay ? [] : slots,
      },
      { new: true, upsert: true }
    );

    res.json(leave);
  } catch (error) {
    console.error("SAVE LEAVE ERROR:", error);
    res.status(500).json({ message: "Failed to save leave" });
  }
};

// ---------- GET LEAVES ----------
exports.getLeaves = async (req, res) => {
  try {
    const todayIST = new Date(Date.now() + IST_OFFSET)
      .toISOString()
      .split("T")[0];

    const leaves = await Leave.find({
      barber: req.user._id,
      date: { $gte: todayIST },
    }).sort({ date: 1 });

    res.json(leaves);
  } catch (error) {
    console.error("GET LEAVES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// ---------- DELETE LEAVE ----------
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      barber: req.user._id,
    });
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    await leave.deleteOne();
    res.json({ message: "Leave cancelled" });
  } catch (error) {
    console.error("DELETE LEAVE ERROR:", error);
    res.status(500).json({ message: "Failed to cancel leave" });
  }
};
