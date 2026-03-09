const express = require("express");
const router = express.Router();
const {
  getSuggestions,
  analyzeText,
} = require("../controllers/readingController");

router.get("/suggestions", getSuggestions);
router.post("/analyze", analyzeText);

module.exports = router;