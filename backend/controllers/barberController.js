const User = require("../models/User");

// -------- GET ALL ACTIVE BARBERS (PUBLIC) --------
exports.getPublicBarbers = async (req, res) => {
  try {
    const barbers = await User.find({
      role: "barber",
      isActive: true,
    }).select("_id name image");

    res.json(barbers);
  } catch (error) {
    console.error("GET PUBLIC BARBERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch barbers" });
  }
};

// -------- GET BARBER PROFILE (PRIVATE) --------
exports.getBarberProfile = async (req, res) => {
  try {
    const barber = await User.findById(req.user._id).select("-password");
    res.json(barber);
  } catch (error) {
    console.error("GET BARBER PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// -------- UPDATE BARBER PROFILE --------
exports.updateBarberProfile = async (req, res) => {
  try {
    const barber = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(barber);
  } catch (error) {
    console.error("UPDATE BARBER PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
