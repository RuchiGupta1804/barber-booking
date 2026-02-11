const Service = require("../models/Service");

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { name, duration, price, category } = req.body;
    if (!name || !duration || !price || !req.file) {
      return res
        .status(400)
        .json({ message: "All fields including image required" });
    }

    const service = await Service.create({
      name,
      duration,
      price,
      category: category || "General",
      image: `/uploads/${req.file.filename}`,
      isActive: true,
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ USER → only ACTIVE services
// ✅ ADMIN → all services
exports.getServices = async (req, res) => {
  try {
    const filter = {};

    // 🔥 If request is from customer side
    if (req.query.user === "true") {
      filter.isActive = true;
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const { name, duration, price, category } = req.body;

    service.name = name || service.name;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.category = category || service.category;

    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE ACTIVE / INACTIVE
exports.toggleActive = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      message: `Service ${service.isActive ? "activated" : "deactivated"}`,
      service,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
