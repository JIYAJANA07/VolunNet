const Event = require("../models/Event");

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json({
            message: "Events fetched successfully",
            events
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching events",
            error: error.message
        });
    }
};

// Get single event
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event fetched successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching event",
            error: error.message
        });
    }
};

// Create event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            date,
            volunteersNeeded
        } = req.body;

        if (
            !title ||
            !description ||
            !location ||
            !date ||
            !volunteersNeeded
        ) {
            return res.status(400).json({
                message: "All event fields are required"
            });
        }

        const event = await Event.create({
            title,
            description,
            location,
            date,
            volunteersNeeded,
            capacity: volunteersNeeded,
            availableSlots: volunteersNeeded,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating event",
            error: error.message
        });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting event",
            error: error.message
        });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};