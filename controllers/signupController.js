const Signup = require("../models/Signup");
const Event = require("../models/Event");


// Register user for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "eventId is required"
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const existingSignup = await Signup.findOne({
      user: userId,
      event: eventId
    });

    if (existingSignup) {
      return res.status(400).json({
        message: "User already registered for this event"
      });
    }

    const signup = await Signup.create({
      user: userId,
      event: eventId,
      status: "registered"
    });

    return res.status(201).json({
      message: "Successfully registered for event",
      signup
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Error registering for event",
      error: error.message
    });
  }
};


// Get all signups
const getAllSignups = async (req, res) => {
  try {
    const signups = await Signup.find()
      .populate("user", "name email role")
      .populate("event", "title description date location");

    return res.status(200).json({
      message: "Signups fetched successfully",
      count: signups.length,
      signups
    });

  } catch (error) {
    console.error("Get signups error:", error);

    return res.status(500).json({
      message: "Error fetching signups",
      error: error.message
    });
  }
};


// Get signups by user ID
const getSignupsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const signups = await Signup.find({
      user: userId
    })
      .populate("user", "name email role")
      .populate("event", "title description date location");

    return res.status(200).json({
      message: "User signups fetched successfully",
      count: signups.length,
      signups
    });

  } catch (error) {
    console.error("Get user signups error:", error);

    return res.status(500).json({
      message: "Error fetching user signups",
      error: error.message
    });
  }
};


// Get signup by ID
const getSignupById = async (req, res) => {
  try {
    const { id } = req.params;

    const signup = await Signup.findById(id)
      .populate("user", "name email role")
      .populate("event", "title description date location");

    if (!signup) {
      return res.status(404).json({
        message: "Signup not found"
      });
    }

    return res.status(200).json({
      message: "Signup fetched successfully",
      signup
    });

  } catch (error) {
    console.error("Get signup error:", error);

    return res.status(500).json({
      message: "Error fetching signup",
      error: error.message
    });
  }
};


// Cancel signup
const cancelSignup = async (req, res) => {
  try {
    const { id } = req.params;

    const signup = await Signup.findById(id);

    if (!signup) {
      return res.status(404).json({
        message: "Signup not found"
      });
    }

    if (
      req.user &&
      req.user.id &&
      signup.user.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You can only cancel your own signup"
      });
    }

    signup.status = "cancelled";

    await signup.save();

    return res.status(200).json({
      message: "Signup cancelled successfully",
      signup
    });

  } catch (error) {
    console.error("Cancel signup error:", error);

    return res.status(500).json({
      message: "Error cancelling signup",
      error: error.message
    });
  }
};


module.exports = {
  registerForEvent,
  getAllSignups,
  getSignupsByUserId,
  getSignupById,
  cancelSignup
};