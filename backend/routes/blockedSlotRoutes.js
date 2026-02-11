const express = require("express");
const router = express.Router();
const blockedSlotController = require("../controllers/blockedSlotController");

router.post("/block", blockedSlotController.blockSlot);
router.get("/", blockedSlotController.getBlockedSlots);

module.exports = router;
