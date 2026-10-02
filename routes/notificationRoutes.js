const express = require("express");

const router = express.Router();

const {
    saveFcmToken,
    createNotification,
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Save Firebase FCM token
router.post("/fcm-token", authMiddleware, saveFcmToken);

// Send notification
router.post("/send", authMiddleware, createNotification);

// Create notification
router.post("/", authMiddleware, createNotification);

// Get notifications
router.get("/", authMiddleware, getNotifications);

// Mark notification as read
router.patch("/:id/read", authMiddleware, markAsRead);

module.exports = router;