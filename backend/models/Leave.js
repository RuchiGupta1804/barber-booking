const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isFullDay: {
      type: Boolean,
      default: false,
    },
    slots: [
      {
        start: String,
        end: String,
      },
    ],
    affectedAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    smsSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ barber: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Leave", leaveSchema);
