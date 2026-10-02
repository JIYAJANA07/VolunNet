const Event = require("../models/Event");
const Signup = require("../models/Signup");
const Hour = require("../models/Hour");

const getImpactReport = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalVolunteers = await Signup.countDocuments();
    const hoursData = await Hour.aggregate([
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    const totalHours = hoursData.length > 0 ? hoursData[0].totalHours : 0;

    res.status(200).json({
      totalEvents,
      totalVolunteers,
      totalHours
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate impact report",
      error: error.message
    });
  }
};


const getEventReport = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate event report",
      error: error.message
    });
  }
};


module.exports = {
  getImpactReport,
  getEventReport
};