const mongoose = require("mongoose");

const hourSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        hours: {
            type: Number,
            required: true,
            min: 0
        },

        date: {
            type: Date,
            default: Date.now
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hour", hourSchema);