const router = require("express").Router();
const {
  createService,
  getServices,
  updateService,
  toggleActive,
} = require("../controllers/serviceController");
const { protect, staffOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// CREATE SERVICE
router.post("/", protect, staffOnly, upload.single("image"), createService);

// GET SERVICES
router.get("/", getServices);

// UPDATE SERVICE
router.put("/:id", protect, staffOnly, updateService);

// TOGGLE ACTIVE / INACTIVE
router.patch("/:id/toggle", protect, staffOnly, toggleActive);

module.exports = router;
