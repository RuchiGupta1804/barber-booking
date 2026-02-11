// // backend/utils/slotGenerator.js
// exports.generateSlots = ({
//   startHour = 10,
//   endHour = 20,
//   interval = 15,
//   date,
//   bookedAppointments = [],
//   leaves = [],
//   serviceDuration = 15,
// }) => {
//   const slots = [];

//   const dayStart = new Date(date);
//   dayStart.setHours(startHour, 0, 0, 0);

//   const dayEnd = new Date(date);
//   dayEnd.setHours(endHour, 0, 0, 0);

//   const isOverlap = (aStart, aEnd, bStart, bEnd) =>
//     aStart < bEnd && aEnd > bStart;

//   for (let time = new Date(dayStart); time < dayEnd; time = new Date(time.getTime() + interval * 60000)) {
//     const slotStart = new Date(time);
//     const slotEnd = new Date(time.getTime() + serviceDuration * 60000);

//     if (slotEnd > dayEnd) continue;

//     let isAvailable = true;

//     // --- Check booked appointments ---
//     for (const appt of bookedAppointments) {
//       const bookedStart = new Date(appt.startTime);
//       const bookedEnd = new Date(appt.endTime);
//       if (isOverlap(slotStart, slotEnd, bookedStart, bookedEnd)) {
//         isAvailable = false;
//         break;
//       }
//     }

//     // --- Check leave slots ---
//     for (const leave of leaves) {
//       if (leave.isFullDay) {
//         isAvailable = false;
//         break;
//       }

//       if (leave.slots?.length) {
//         for (const l of leave.slots) {
//           if (!l.start || !l.end) continue; // skip invalid
//           const leaveStart = new Date(`${date}T${l.start}:00`);
//           const leaveEnd = new Date(`${date}T${l.end}:00`);
//           if (isOverlap(slotStart, slotEnd, leaveStart, leaveEnd)) {
//             isAvailable = false;
//             break;
//           }
//         }
//       }
//       if (!isAvailable) break;
//     }

//     slots.push({
//       start: slotStart.toISOString(),
//       isAvailable,
//     });
//   }

//   return slots;
// };
