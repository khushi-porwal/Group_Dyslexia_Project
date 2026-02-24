const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    displayText: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    minStrokes: {
      type: Number,
      required: true,
      default: 3,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    marks: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

// Prevent duplicate word per category
wordSchema.index({ text: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Word", wordSchema);
