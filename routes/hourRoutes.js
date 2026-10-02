const express = require("express");

const {
    createHour,
    getHours,
    getHourById,
    updateHour,
    deleteHour,
    getHoursByUserId
} = require("../controllers/hourController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add volunteer hours
router.post("/", authMiddleware, createHour);

// Get all hours
router.get("/", authMiddleware, getHours);

// Get hours by user ID
router.get("/user/:userId", authMiddleware, getHoursByUserId);

// Get single hour record
router.get("/:id", authMiddleware, getHourById);

// Update hours
router.put("/:id", authMiddleware, updateHour);

// Delete hours
router.delete("/:id", authMiddleware, deleteHour);

module.exports = router;