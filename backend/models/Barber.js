const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workingHours: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barber", barberSchema);
