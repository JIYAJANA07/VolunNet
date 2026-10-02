const express = require("express");

const router = express.Router();

const {
  registerForEvent,
  getAllSignups,
  getSignupsByUserId,
  getSignupById,
  cancelSignup
} = require("../controllers/signupController");

const authMiddleware = require("../middleware/authMiddleware");


// Register for event
router.post("/", authMiddleware, registerForEvent);


// Get all signups
router.get("/", authMiddleware, getAllSignups);


// Get signups by user ID
router.get("/user/:userId", authMiddleware, getSignupsByUserId);


// Get signup by ID
router.get("/:id", authMiddleware, getSignupById);


// Cancel signup
router.delete("/:id", authMiddleware, cancelSignup);


module.exports = router;