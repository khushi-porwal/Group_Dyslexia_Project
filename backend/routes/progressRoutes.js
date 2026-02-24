const express = require("express");
const router = express.Router();
const {
  getOverallProgress,
} = require("../controllers/progress.controller");

router.get("/overall/:userId", getOverallProgress);

module.exports = router;