const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// Get all events
router.get(
    "/",
    authMiddleware,
    roleMiddleware("volunteer", "admin"),
    getEvents
);

// Get single event
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("volunteer", "admin"),
    getEventById
);

// Create event - Admin only + validation
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),

    body("title")
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .notEmpty()
        .withMessage("Description is required"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),

    body("date")
        .isISO8601()
        .withMessage("Valid date is required"),

    body("volunteersNeeded")
        .isInt({ min: 1 })
        .withMessage("volunteersNeeded must be at least 1"),

    validationMiddleware,
    createEvent
);

// Update event - Admin only + validation
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),

    body("title")
        .optional()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("description")
        .optional()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("location")
        .optional()
        .notEmpty()
        .withMessage("Location cannot be empty"),

    body("date")
        .optional()
        .isISO8601()
        .withMessage("Valid date is required"),

    body("volunteersNeeded")
        .optional()
        .isInt({ min: 1 })
        .withMessage("volunteersNeeded must be at least 1"),

    validationMiddleware,
    updateEvent
);

// Delete event - Admin only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteEvent
);

module.exports = router;