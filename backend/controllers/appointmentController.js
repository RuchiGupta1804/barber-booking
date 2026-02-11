const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const Leave = require("../models/Leave");
const User = require("../models/User");
const { istToUTC, utcToIST, getISTDayRangeUTC } = require("../utils/timezone");

// ---------- CONFIG ----------
const SHOP_START = 10 * 60; // 10:00
const SHOP_END = 20 * 60; // 20:00
const SLOT_INTERVAL = 30;
const WEEKLY_OFF_DAY = 4; // Thursday

// ---------- HELPERS ----------
const overlaps = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && aEnd > bStart;

// ✅ SINGLE BARBER FIXED
const getSingleBarberId = async () => {
  const barber = await User.findOne();
  if (!barber) throw new Error("No barber found in DB");
  return barber._id;
};

const minsToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

// 🔥 IST SLOT GENERATOR (timezone safe)
const generate30MinSlots = (dateStr) => {
  const slots = [];

  for (let mins = SHOP_START; mins < SHOP_END; mins += SLOT_INTERVAL) {
    const istStart = new Date(`${dateStr}T00:00:00`);
    istStart.setHours(0, mins, 0, 0);

    const istEnd = new Date(istStart.getTime() + SLOT_INTERVAL * 60000);

    slots.push({
      startTime: istStart,
      endTime: istEnd,
      label: `${minsToTime(mins)} - ${minsToTime(mins + SLOT_INTERVAL)}`,
    });
  }

  return slots;
};

const roundUpToNextSlot = (date, mins = 30) => {
  const ms = mins * 60 * 1000;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
};

// ============================
// GET AVAILABLE SLOTS ✅ (100% IST SAFE)
// ============================
const getAvailableSlots = async (req, res) => {
  try {
    const { date, serviceIds } = req.query;
    if (!date) return res.status(400).json({ message: "Date required" });

    const barberId = await getSingleBarberId();

    const day = new Date(`${date}T00:00:00`).getDay();
    const isWeeklyOff = day === WEEKLY_OFF_DAY;

    // ---------- SERVICES ----------
    const services =
      !serviceIds || serviceIds === "none"
        ? []
        : await Service.find({
            _id: { $in: serviceIds.split(",") },
            isActive: true,
          });

    const totalMinutes = services.reduce((s, x) => s + x.duration, 0);
    const requiredMinutes = totalMinutes || SLOT_INTERVAL;

    const allSlots = generate30MinSlots(date);

    // ---------- DAY RANGE (IST → UTC for DB query) ----------
    const { startUTC: dayStartUTC, endUTC: dayEndUTC } =
      getISTDayRangeUTC(date);

    // ---------- BOOKINGS ----------
    const appointments = await Appointment.find({
      barber: barberId,
      startTime: { $lt: dayEndUTC },
      endTime: { $gt: dayStartUTC },
      status: "booked",
      cancelledByLeave: false,
    });

    const bookedRanges = appointments.map((a) => ({
      start: utcToIST(new Date(a.startTime)),
      end: utcToIST(new Date(a.endTime)),
    }));

    // ---------- LEAVES ----------
    const leaves = await Leave.find({ barber: barberId, date });

    const nowIST = utcToIST(new Date());

    // ---------- BASE SLOT STATUS ----------
    let slots = allSlots.map((slot) => {
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;
      const shopCloseIST = new Date(`${date}T20:00:00`);

      let available = true;
      let reason = "";

      // 1️⃣ Past time
      if (
        slotStart < nowIST &&
        slotStart.toDateString() === nowIST.toDateString()
      ) {
        available = false;
        reason = "Time passed";
      }

      // 2️⃣ Weekly off
      if (available && isWeeklyOff) {
        available = false;
        reason = "Salon closed";
      }

      // 3️⃣ Leave
      if (available) {
        const leaveHit = leaves.some((l) => {
          if (l.isFullDay) return true;
          return l.slots.some((s) => {
            const lStart = new Date(`${l.date}T${s.start}:00`);
            const lEnd = new Date(`${l.date}T${s.end}:00`);
            return overlaps(slotStart, slotEnd, lStart, lEnd);
          });
        });

        if (leaveHit) {
          available = false;
          reason = "Beautician unavailable";
        }
      }

      // 4️⃣ Booked (30-min)
      if (available) {
        const bookedHit = bookedRanges.some((b) =>
          overlaps(slotStart, slotEnd, b.start, b.end)
        );
        if (bookedHit) {
          available = false;
          reason = "Booked";
        }
      }

      // 5️⃣ Closing time
      if (available && slotEnd > shopCloseIST) {
        available = false;
        reason = "Exceeds closing time";
      }

      return {
        startTime: istToUTC(slotStart).toISOString(), // 🔥 SEND UTC TO FRONTEND
        endTime: istToUTC(slotEnd).toISOString(),
        label: slot.label,
        available,
        reason,
      };
    });

    // ============================
    // ✅ FULL SERVICE WINDOW → "Time conflict"
    // ============================
    slots = slots.map((slot) => {
      if (!slot.available) return slot;

      const startIST = utcToIST(new Date(slot.startTime));
      const endIST = new Date(startIST.getTime() + requiredMinutes * 60000);

      const shopCloseIST = new Date(`${date}T20:00:00`);
      if (endIST > shopCloseIST) {
        return { ...slot, available: false, reason: "Exceeds closing time" };
      }

      const conflict = bookedRanges.some((b) =>
        overlaps(startIST, endIST, b.start, b.end)
      );
      if (conflict) {
        return { ...slot, available: false, reason: "Time conflict" };
      }

      const leaveConflict = leaves.some((l) => {
        if (l.isFullDay) return true;
        return l.slots.some((s) => {
          const lStart = new Date(`${l.date}T${s.start}:00`);
          const lEnd = new Date(`${l.date}T${s.end}:00`);
          return overlaps(startIST, endIST, lStart, lEnd);
        });
      });
      if (leaveConflict) {
        return { ...slot, available: false, reason: "Beautician unavailable" };
      }

      return slot;
    });

    res.json({ slots });
  } catch (err) {
    console.error("Slot error:", err);
    res.status(500).json({ message: "Slot fetch failed" });
  }
};

// ============================
// BOOK APPOINTMENT ✅ (IST → UTC SAVE)
// ============================
const bookAppointment = async (req, res) => {
  try {
    const { name, phone, services, startTime } = req.body;
    if (!name || !phone || !services || !startTime)
      return res.status(400).json({ message: "Missing booking data" });

    const barberId = await getSingleBarberId();

    const serviceDocs = await Service.find({
      _id: { $in: services },
      isActive: true,
    });

    if (serviceDocs.length !== services.length) {
      return res
        .status(400)
        .json({ message: "One or more selected services are inactive" });
    }

    const totalDuration = serviceDocs.reduce((s, x) => s + x.duration, 0);

    // 🔥 FRONTEND SE UTC AATA HAI → IST ME CONVERT
    const startIST = utcToIST(new Date(startTime));
    const rawEndIST = new Date(startIST.getTime() + totalDuration * 60000);
    const endIST = roundUpToNextSlot(rawEndIST, SLOT_INTERVAL);

    const startUTC = istToUTC(startIST);
    const endUTC = istToUTC(endIST);

    const bookingDate = startIST.toISOString().split("T")[0];

    const day = new Date(`${bookingDate}T00:00:00`).getDay();
    if (day === WEEKLY_OFF_DAY)
      return res.status(403).json({ message: "Salon closed on this day" });

    const leave = await Leave.findOne({ barber: barberId, date: bookingDate });
    if (
      leave &&
      (leave.isFullDay ||
        leave.slots.some((s) => {
          const lStart = new Date(`${leave.date}T${s.start}:00`);
          const lEnd = new Date(`${leave.date}T${s.end}:00`);
          return overlaps(startIST, endIST, lStart, lEnd);
        }))
    ) {
      return res.status(403).json({ message: "Beautician unavailable" });
    }

    const conflict = await Appointment.findOne({
      barber: barberId,
      startTime: { $lt: endUTC },
      endTime: { $gt: startUTC },
      status: "booked",
      cancelledByLeave: false,
    });

    if (conflict)
      return res.status(409).json({ message: "Slot already booked" });

    const appointment = await Appointment.create({
      name,
      phone,
      services,
      barber: barberId,
      startTime: startUTC,
      endTime: endUTC,
      status: "booked",
      cancelledByLeave: false,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

// ============================
// DASHBOARD SUMMARY
// ============================
const getDashboardSummary = async (req, res) => {
  try {
    const barberId = req.user._id;

    const appointments = await Appointment.find({
      barber: barberId,
      cancelledByLeave: false,
    }).populate("services");

    const completed = appointments.filter((a) => a.status === "completed");
    const booked = appointments.filter((a) => a.status === "booked");

    const nowIST = utcToIST(new Date());
    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);
    const tomorrowIST = new Date(todayIST);
    tomorrowIST.setDate(todayIST.getDate() + 1);

    const todayAppointments = booked.filter((a) => {
      const start = utcToIST(new Date(a.startTime));
      return start >= todayIST && start < tomorrowIST;
    });

    const todayRevenue = completed
      .filter((a) => {
        const end = utcToIST(new Date(a.endTime));
        return end >= todayIST && end < tomorrowIST;
      })
      .reduce(
        (sum, a) =>
          sum + a.services.reduce((s, x) => s + Number(x.price), 0),
        0
      );

    const totalRevenue = completed.reduce(
      (sum, a) =>
        sum + a.services.reduce((s, x) => s + Number(x.price), 0),
      0
    );

    const upcomingAppointments = booked
      .filter((a) => utcToIST(new Date(a.startTime)) > nowIST)
      .sort(
        (a, b) =>
          utcToIST(new Date(a.startTime)) -
          utcToIST(new Date(b.startTime))
      );

    res.json({
      totalAppointments: appointments.length,
      todayAppointmentsCount: todayAppointments.length,
      todayRevenue,
      totalRevenue,
      nextAppointment: upcomingAppointments[0] || null,
      upcomingAppointments: upcomingAppointments.slice(0, 5),
      totalServices: await Service.countDocuments(),
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Dashboard summary failed" });
  }
};

// ============================
// LEAVE AFFECTED
// ============================
const getLeaveAffectedAppointments = async (req, res) => {
  try {
    const barberId = req.user._id;
    const { date } = req.query;

    const leave = await Leave.findOne({ barber: barberId, date });
    if (!leave) return res.json([]);

    const { startUTC: dayStartUTC, endUTC: dayEndUTC } =
      getISTDayRangeUTC(date);

    const appointments = await Appointment.find({
      barber: barberId,
      startTime: { $lt: dayEndUTC },
      endTime: { $gt: dayStartUTC },
      status: "booked",
      cancelledByLeave: false,
    }).populate("services");

    const affected = leave.isFullDay
      ? appointments
      : appointments.filter((a) =>
          leave.slots.some((s) => {
            const lStart = new Date(`${leave.date}T${s.start}:00`);
            const lEnd = new Date(`${leave.date}T${s.end}:00`);
            return overlaps(
              utcToIST(new Date(a.startTime)),
              utcToIST(new Date(a.endTime)),
              lStart,
              lEnd
            );
          })
        );

    res.json(affected);
  } catch (err) {
    console.error("Affected fetch error:", err);
    res.status(500).json({ message: "Failed to fetch affected appointments" });
  }
};

// ============================
// BARBER CANCEL
// ============================
const cancelAppointmentByBarber = async (req, res) => {
  try {
    const barberId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      barber: barberId,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    appointment.cancelledByLeave = false;
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
};

// ============================
// BARBER APPOINTMENTS LIST
// ============================
const getBarberAppointments = async (req, res) => {
  try {
    const barberId = req.user._id;

    const appointments = await Appointment.find({ barber: barberId })
      .populate("services", "name price")
      .sort({ startTime: -1 });

    res.json({ appointments });
  } catch (err) {
    console.error("Barber appointments fetch error:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// ============================
// MARK COMPLETED
// ============================
const markAppointmentCompleted = async (req, res) => {
  try {
    const barberId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      barber: barberId,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== "booked") {
      return res
        .status(400)
        .json({ message: "Only booked appointments can be completed" });
    }

    if (new Date() < new Date(appointment.endTime)) {
      return res
        .status(403)
        .json({ message: "Cannot complete before service end time" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({ message: "Appointment marked as completed" });
  } catch (err) {
    console.error("Complete appointment error:", err);
    res.status(500).json({ message: "Failed to complete appointment" });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getDashboardSummary,
  getLeaveAffectedAppointments,
  cancelAppointmentByBarber,
  getBarberAppointments,
  markAppointmentCompleted,
};
