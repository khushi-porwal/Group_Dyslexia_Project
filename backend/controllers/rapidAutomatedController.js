// const Word = require("../models/Word");
// const Progress = require("../models/Progress");

// /**
//  * STEP 1: INIT DATA FOR RAPID WRITING SCREEN
//  */
// exports.getConfig = async (req, res) => {
//   try {
//     const words = await Word.find()
//       .populate("category")
//       .sort({ createdAt: 1 })
//       .lean();

//     const categories = [];
//     const seen = new Set();

//     words.forEach((w) => {
//       if (w.category && !seen.has(w.category._id.toString())) {
//         seen.add(w.category._id.toString());
//         categories.push({
//           id: w.category._id,
//           name: w.category.name,
//         });
//       }
//     });

//     res.status(200).json({
//       success: true,
//       data: { categories, words },
//     });
//   } catch (err) {
//     console.error("Config error:", err);
//     res.status(500).json({ success: false });
//   }
// };

// /**
//  * STEP 2: EVALUATE DRAWING (PHASE 1)
//  */
// exports.evaluateDrawing = async (req, res) => {
//   try {
//     const { userId, wordId, drawing } = req.body;

//     if (!userId || !wordId || !Array.isArray(drawing)) {
//       return res.status(400).json({
//         result: "wrong",
//         message: "Invalid input",
//       });
//     }

//     const word = await Word.findById(wordId).populate("category");
//     if (!word) {
//       return res.status(404).json({
//         result: "wrong",
//         message: "Word not found",
//       });
//     }

//     const validStrokes = drawing.filter(
//       (p) => typeof p === "string" && p.trim().length > 0
//     );

//     const strokesCount = validStrokes.length;
//     const minStrokes = word.minStrokes;

//     let isCorrect = false;
//     let score = 0;

//     if (strokesCount >= minStrokes) {
//       isCorrect = true;
//       score = word.marks;

//       if (strokesCount > minStrokes * 3) {
//         score = Math.floor(score * 0.7);
//       }
//     }

//     score = Math.min(score, word.marks);

//     await Progress.create({
//       userId,
//       word: word._id,
//       category: word.category?._id || null,
//       expectedWord: word.text,
//       strokesCount,
//       result: isCorrect ? "correct" : "wrong",
//       score,
//     });

//     res.json({
//       result: isCorrect ? "correct" : "wrong",
//       score,
//       meta: { strokesCount, minStrokes },
//     });
//   } catch (error) {
//     console.error("Evaluation error:", error);
//     res.status(500).json({
//       result: "wrong",
//       message: "Evaluation failed",
//     });
//   }
// };






const axios = require("axios");
const Word = require("../models/Word");
const Progress = require("../models/Progress");

/**
 * STEP 1: INIT DATA FOR RAPID WRITING SCREEN
 * (NO ML HERE)
 */
exports.getConfig = async (req, res) => {
  try {
    const words = await Word.find()
      .populate("category")
      .sort({ createdAt: 1 })
      .lean();

    const categories = [];
    const seen = new Set();

    words.forEach((w) => {
      if (w.category && !seen.has(w.category._id.toString())) {
        seen.add(w.category._id.toString());
        categories.push({
          id: w.category._id,
          name: w.category.name,
        });
      }
    });

    res.status(200).json({
      success: true,
      data: { categories, words },
    });
  } catch (err) {
    console.error("Config error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * STEP 2: EVALUATE DRAWING
 * (REAL ML DECISION)
 */
exports.evaluateDrawing = async (req, res) => {
  try {
    const { userId, wordId, image } = req.body;

    // 1️⃣ VALIDATION
    if (!userId || !wordId || !image) {
      return res.status(400).json({
        result: "wrong",
        message: "Invalid input",
      });
    }

    // 2️⃣ FETCH WORD
    const word = await Word.findById(wordId).populate("category");
    if (!word) {
      return res.status(404).json({
        result: "wrong",
        message: "Word not found",
      });
    }

    // 3️⃣ CALL PYTHON ML SERVICE
    let mlResponse;
    try {
      mlResponse = await axios.post(
        "http://localhost:8000/predict",
        { image },
        { timeout: 5000 }
      );
    } catch (mlError) {
      console.error("ML service error:", mlError.message);
      return res.status(500).json({
        result: "wrong",
        message: "ML service unavailable",
      });
    }

    const { label, confidence } = mlResponse.data;

    // Normalize text to avoid mismatch
    const predictedLabel = label.trim().toLowerCase();
    const expectedLabel = word.text.trim().toLowerCase();

    // 4️⃣ CONFIDENCE-BASED DECISION LOGIC
    let result;
    let score = 0;

    if (predictedLabel === expectedLabel && confidence >= 0.8) {
      result = "correct";
      score = 1;
    } else if (predictedLabel === expectedLabel && confidence >= 0.5) {
      result = "almost"; // close but not perfect
      score = 0;
    } else {
      result = "wrong";
      score = 0;
    }

    // 5️⃣ SAVE PROGRESS
    await Progress.create({
      userId,
      word: word._id,
      category: word.category?._id || null,
      expectedWord: word.text,
      strokesCount: 0, // optional, kept for compatibility
      result,
      score,
    });

    // 6️⃣ RESPONSE TO FRONTEND
    res.json({
      result,                 // correct | almost | wrong
      score,                  // 1 or 0
      predictedLabel,         // ML output
      confidence: Number(confidence.toFixed(2)),
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({
      result: "wrong",
      message: "Evaluation failed",
    });
  }
};
