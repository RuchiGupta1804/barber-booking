// exports.generateSlots = ({
//   date,
//   serviceDuration,
//   appointments = [],
//   leave = null,
//   slotInterval = 15,
//   salonStart = "10:00",
//   salonEnd = "20:00",
// }) => {
//   const slots = [];

//   const toMinutes = (t) => {
//     const [h, m] = t.split(":").map(Number);
//     return h * 60 + m;
//   };

//   const startMins = toMinutes(salonStart);
//   const endMins = toMinutes(salonEnd);
//   const day = new Date(date);
//   const now = new Date();

//   const overlaps = (aStart, aEnd, bStart, bEnd) =>
//     aStart < bEnd && aEnd > bStart;

//   for (let mins = startMins; mins + serviceDuration <= endMins; mins += slotInterval) {
//     const slotStart = new Date(day);
//     slotStart.setHours(Math.floor(mins / 60), mins % 60, 0, 0);

//     const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

//     let state = "available";
//     let label = "Available";

//     // 1️⃣ Past time
//     if (slotStart < now) {
//       state = "past";
//       label = "Passed time";
//     }

//     // 2️⃣ Leave
//     if (leave) {
//       if (leave.isFullDay) {
//         state = "leave";
//         label = "Beautician unavailable";
//       } else if (leave.slots?.length) {
//         const hit = leave.slots.some((l) => {
//           const lStart = new Date(`${date}T${l.start}:00`);
//           const lEnd = new Date(`${date}T${l.end}:00`);
//           return overlaps(slotStart, slotEnd, lStart, lEnd);
//         });
//         if (hit) {
//           state = "leave";
//           label = "Beautician unavailable";
//         }
//       }
//     }

//     // 3️⃣ Appointments
//     if (state === "available") {
//       const hit = appointments.some((a) => {
//         const aStart = new Date(a.startTime);
//         const aEnd = new Date(a.endTime);
//         return overlaps(slotStart, slotEnd, aStart, aEnd);
//       });
//       if (hit) {
//         state = "booked";
//         label = "Booked";
//       }
//     }

//     // 4️⃣ Continuous gap check
//     if (state === "available") {
//       const nextBooked = appointments
//         .map((a) => ({
//           start: new Date(a.startTime),
//           end: new Date(a.endTime),
//         }))
//         .sort((a, b) => a.start - b.start)
//         .find((a) => slotStart < a.start);

//       if (nextBooked && slotEnd > nextBooked.start) {
//         state = "not-enough";
//         label = "Time isn’t enough";
//       }
//     }

//     slots.push({
//       start: slotStart.toISOString(),
//       state,
//       isAvailable: state === "available",
//       label,
//     });
//   }

//   return slots;
// };
