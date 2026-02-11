const router = require("express").Router();
const {
  saveLeave,
  getLeaves,
  deleteLeave,
} = require("../controllers/leaveController");
const { protect, staffOnly } = require("../middleware/authMiddleware");

router.get("/", protect, staffOnly, getLeaves);
router.post("/", protect, staffOnly, saveLeave);
router.delete("/:id", protect, staffOnly, deleteLeave);

module.exports = router;
