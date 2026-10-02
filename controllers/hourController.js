const Hour = require("../models/Hour");
const User = require("../models/User");
const Event = require("../models/Event");


// Add volunteer hours
const createHour = async (req, res) => {
    try {
        const { event, hours, date, description } = req.body;

        const user = req.user?.id || req.user?._id;

        if (!user || !event || hours === undefined) {
            return res.status(400).json({
                message: "Event and hours are required"
            });
        }

        if (hours < 0) {
            return res.status(400).json({
                message: "Hours cannot be negative"
            });
        }

        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingEvent = await Event.findById(event);

        if (!existingEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const hour = await Hour.create({
            user,
            event,
            hours,
            date: date || Date.now(),
            description: description || ""
        });

        const populatedHour = await Hour.findById(hour._id)
            .populate("user", "name email role")
            .populate("event");

        res.status(201).json({
            message: "Hours added successfully",
            hour: populatedHour
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding hours",
            error: error.message
        });
    }
};


// Get all hours
const getHours = async (req, res) => {
    try {
        const hours = await Hour.find()
            .populate("user", "name email role")
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Hours fetched successfully",
            count: hours.length,
            hours
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching hours",
            error: error.message
        });
    }
};


// Get hours by user ID
const getHoursByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const hours = await Hour.find({
            user: userId
        })
            .populate("user", "name email role")
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User hours fetched successfully",
            count: hours.length,
            hours
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user hours",
            error: error.message
        });
    }
};


// Get one hour record
const getHourById = async (req, res) => {
    try {
        const hour = await Hour.findById(req.params.id)
            .populate("user", "name email role")
            .populate("event");

        if (!hour) {
            return res.status(404).json({
                message: "Hour record not found"
            });
        }

        res.status(200).json({
            message: "Hour fetched successfully",
            hour
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching hour",
            error: error.message
        });
    }
};


// Update hours
const updateHour = async (req, res) => {
    try {
        const { hours, date, description } = req.body;

        const hour = await Hour.findById(req.params.id);

        if (!hour) {
            return res.status(404).json({
                message: "Hour record not found"
            });
        }

        if (hours !== undefined) {
            if (hours < 0) {
                return res.status(400).json({
                    message: "Hours cannot be negative"
                });
            }

            hour.hours = hours;
        }

        if (date !== undefined) {
            hour.date = date;
        }

        if (description !== undefined) {
            hour.description = description;
        }

        await hour.save();

        const updatedHour = await Hour.findById(hour._id)
            .populate("user", "name email role")
            .populate("event");

        res.status(200).json({
            message: "Hours updated successfully",
            hour: updatedHour
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating hours",
            error: error.message
        });
    }
};


// Delete hours
const deleteHour = async (req, res) => {
    try {
        const hour = await Hour.findById(req.params.id);

        if (!hour) {
            return res.status(404).json({
                message: "Hour record not found"
            });
        }

        await Hour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Hours deleted successfully",
            hour
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting hours",
            error: error.message
        });
    }
};


module.exports = {
    createHour,
    getHours,
    getHoursByUserId,
    getHourById,
    updateHour,
    deleteHour
};