// const express = require("express");
// const router = express.Router();
// const History = require("../models/History");

// router.post("/", async (req, res) => {
//   const record = await History.create(req.body);
//   res.json(record);
// });

// router.get("/", async (req, res) => {
//   const history = await History.find().sort({ date: -1 });
//   res.json(history);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const History = require("../models/History");
const authMiddleware = require("../middleware/authMiddleware");

// Save grey reading result
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { activityType, duration, score } = req.body;

    const history = new History({
      user: req.userId,   // ✅ THIS LINE CHANGED
      activityType,
      duration,
      score,
    });

    await history.save();

    res.status(201).json({
      success: true,
      message: "History saved",
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;