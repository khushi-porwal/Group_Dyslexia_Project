const express = require("express")
const router = express.Router();
const upload = require("../middleware/upload");
const { createWord } = require("../controllers/wordController");


router.post(
  "/",
  upload.single("image"), // 👈 MUST be "image"
  createWord
);

module.exports = router