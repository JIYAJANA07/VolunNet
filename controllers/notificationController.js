const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");

const { sendNotification } = require("../services/notificationService");

// Save FCM token
const saveFcmToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({
                success: false,
                message: "fcmToken is required"
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { fcmToken },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "FCM token saved successfully"
        });

    } catch (error) {
        console.error("FCM token error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Create and send notification
const createNotification = async (req, res) => {
    try {
        const { user, title, message, type } = req.body;

        if (!user || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "user, title and message are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const notification = await Notification.create({
            user,
            title,
            message,
            type: type || "general"
        });

        let pushResult = {
            success: false,
            message: "No FCM token available"
        };

        if (existingUser.fcmToken) {
            pushResult = await sendNotification(
                existingUser.fcmToken,
                title,
                message,
                {
                    notificationId: notification._id.toString(),
                    type: type || "general"
                }
            );
        }

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification,
            pushNotification: pushResult
        });

    } catch (error) {
        console.error("Notification controller error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get logged-in user's notifications
const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const userId = req.user.id || req.user._id;

        const notifications = await Notification.find({
            user: userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const userId = req.user.id || req.user._id;
        const notificationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                user: userId
            },
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    saveFcmToken,
    createNotification,
    getNotifications,
    markAsRead
};