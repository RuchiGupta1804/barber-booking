// utils/timezone.js

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

// Convert IST Date object → UTC Date
const istToUTC = (date) => new Date(date.getTime() - IST_OFFSET);

// Convert UTC Date → IST Date
const utcToIST = (date) => new Date(date.getTime() + IST_OFFSET);

// Given IST date string (YYYY-MM-DD), return UTC day range
const getISTDayRangeUTC = (dateStr) => {
  const istStart = new Date(`${dateStr}T00:00:00`);
  const istEnd = new Date(`${dateStr}T23:59:59.999`);

  return {
    startUTC: istToUTC(istStart),
    endUTC: istToUTC(istEnd),
  };
};

module.exports = {
  istToUTC,
  utcToIST,
  getISTDayRangeUTC,
};
