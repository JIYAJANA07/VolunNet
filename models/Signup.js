const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Signup", signupSchema);