const mongoose = require("mongoose");

const blockedSlotSchema = new mongoose.Schema(
  {
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
    },
    startTime: {
      type: Date, // UTC
      required: true,
    },
    endTime: {
      type: Date, // UTC
      required: true,
    },
    reason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedSlot", blockedSlotSchema);
