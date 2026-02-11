const BlockedSlot = require("../models/BlockedSlot");
const { istToUTC } = require("../utils/timezone");

exports.blockSlot = async (req, res) => {
  try {
    const { barberId, startTime, endTime, reason } = req.body;

    if (!barberId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const slot = await BlockedSlot.create({
      barber: barberId,
      startTime: istToUTC(new Date(startTime)),
      endTime: istToUTC(new Date(endTime)),
      reason,
    });

    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to block slot" });
  }
};

exports.getBlockedSlots = async (req, res) => {
  try {
    const { barberId, date } = req.query;

    const istStart = new Date(`${date}T00:00:00`);
    const istEnd = new Date(`${date}T23:59:59.999`);

    const slots = await BlockedSlot.find({
      barber: barberId,
      startTime: {
        $gte: istToUTC(istStart),
        $lte: istToUTC(istEnd),
      },
    });

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blocked slots" });
  }
};
