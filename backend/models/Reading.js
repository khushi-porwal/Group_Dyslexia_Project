const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  mistakes: {
    type: [String],
    default: [],
  },

  score: {
    type: Number,
    default: 0,
  },

  mode: {
    type: String,
    enum: ["typing", "voice", "scanner"],
    default: "typing",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Reading", readingSchema);