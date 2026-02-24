const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    word: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    expectedWord: {
      type: String,
      required: true,
      lowercase: true,
    },

    strokesCount: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    result: {
      type: String,
      enum: ["correct", "almost", "wrong"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);