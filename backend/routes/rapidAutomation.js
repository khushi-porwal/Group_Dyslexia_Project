const express = require("express");
const router = express.Router();

const {
  getConfig,
  evaluateDrawing,
} = require("../controllers/rapidAutomatedController");

// Bootstrap data for screen
router.get("/config", getConfig);

// Evaluate drawing (JSON strokes, NOT image)
router.post("/evaluate", evaluateDrawing);

module.exports = router;
