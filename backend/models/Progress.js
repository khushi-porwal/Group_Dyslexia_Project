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
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    expectedWord: {
      type: String,
      trim: true,
      lowercase: true,
    },

    strokesCount: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      default: 0,
    },

    result: {
      type: String,
      enum: ["correct", "wrong"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);
