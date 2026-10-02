const express = require("express");
const router = express.Router();

const {
  getImpactReport,
  getEventReport
} = require("../controllers/reportController");

router.get("/impact", getImpactReport);
router.get("/events", getEventReport);

module.exports = router;