// const Appointment = require("../models/Appointment");
// const Service = require("../models/Service");
// const Leave = require("../models/Leave");

// const SLOT_DURATION = 30;
// const SALON_START = "10:00";
// const SALON_END = "20:00";

// const toMinutes = (timeStr) => {
//   const [h, m] = timeStr.split(":").map(Number);
//   return h * 60 + m;
// };

// const minutesToDate = (dateStr, mins) => {
//   const d = new Date(dateStr);
//   d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
//   return d;
// };

// exports.getAvailableSlots = async (req, res) => {
//   try {
//     const { serviceIds, date } = req.query;

//     // ---------- SERVICES ----------
//     const services =
//       !serviceIds || serviceIds === "none"
//         ? []
//         : await Service.find({ _id: { $in: serviceIds.split(",") } });

//     const requiredMinutes = services.reduce((sum, s) => sum + s.duration, 0);
//     const requiredSlots = Math.max(1, Math.ceil(requiredMinutes / SLOT_DURATION));

//     const dayStartMin = toMinutes(SALON_START);
//     const dayEndMin = toMinutes(SALON_END);

//     // ---------- BASE SLOTS ----------
//     const baseSlots = [];
//     for (let mins = dayStartMin; mins < dayEndMin; mins += SLOT_DURATION) {
//       baseSlots.push({
//         start: minutesToDate(date, mins),
//         state: "available",
//       });
//     }

//     // ---------- DAY RANGE ----------
//     const dayStart = new Date(date);
//     dayStart.setHours(0, 0, 0, 0);
//     const dayEnd = new Date(dayStart);
//     dayEnd.setDate(dayEnd.getDate() + 1);

//     // ---------- BOOKINGS ----------
//     const appointments = await Appointment.find({
//       startTime: { $lt: dayEnd },
//       endTime: { $gt: dayStart },
//       status: "confirmed",
//     });

//     // ---------- LEAVES (YOUR REAL SCHEMA) ----------
//     const leaveDoc = await Leave.findOne({ date });
//     const leaveSlots = leaveDoc?.slots || [];
//     const isFullDayLeave = leaveDoc?.isFullDay || false;

//     const now = new Date();

//     // ---------- STEP 1: MARK BASE STATES ----------
//     let slots = baseSlots.map((slot) => {
//       const slotStart = new Date(slot.start);
//       const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60000);

//       // ⏰ PAST
//       if (
//         slotStart.toDateString() === now.toDateString() &&
//         slotStart <= now
//       ) {
//         return { ...slot, state: "past" };
//       }

//       // 🧑‍🔧 FULL DAY LEAVE
//       if (isFullDayLeave) {
//         return { ...slot, state: "leave" };
//       }

//       // 🧑‍🔧 PARTIAL LEAVE
//       const leaveHit = leaveSlots.some((l) => {
//         const leaveStartMin = toMinutes(l.start);
//         const leaveEndMin = toMinutes(l.end);
//         const leaveStart = minutesToDate(date, leaveStartMin);
//         const leaveEnd = minutesToDate(date, leaveEndMin);
//         return slotStart < leaveEnd && slotEnd > leaveStart;
//       });
//       if (leaveHit) return { ...slot, state: "leave" };

//       // 📌 BOOKED
//       const bookingHit = appointments.some((a) => {
//         const apptStart = new Date(a.startTime);
//         const apptEnd = new Date(a.endTime);
//         return slotStart < apptEnd && slotEnd > apptStart;
//       });
//       if (bookingHit) return { ...slot, state: "booked" };

//       return slot;
//     });

//     // ---------- STEP 2: MULTI-SERVICE PRESERVE ----------
//     if (requiredSlots > 1) {
//       slots = slots.map((slot, i) => {
//         if (slot.state !== "available") return slot;

//         for (let j = 1; j < requiredSlots; j++) {
//           const next = slots[i + j];
//           if (!next || next.state !== "available") {
//             return { ...slot, state: "preserved" };
//           }
//         }

//         return slot;
//       });
//     }

//     // ---------- STEP 3: EXCEEDS CLOSING ----------
//     slots = slots.map((slot, i) => {
//       if (slot.state !== "available") return slot;
//       if (i + requiredSlots > slots.length) {
//         return { ...slot, state: "exceed" };
//       }
//       return slot;
//     });

//     res.json({ slots });
//   } catch (error) {
//     console.error("Availability error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
