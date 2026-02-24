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

const ML_URL = process.env.ML_URL || "http://127.0.0.1:8000";

exports.evaluateDrawing = async (req, res) => {
  try {
    const { userId, wordId, image, strokesCount } = req.body;

    /* =========================
       1️⃣ BASIC VALIDATION
    ========================== */
    if (!userId || !wordId || !image) {
      return res.status(400).json({
        success: false,
        message: "userId, wordId and image are required",
      });
    }

    /* =========================
       2️⃣ DRAWING QUALITY CHECK
       (BLOCK BAD INPUT EARLY)
    ========================== */
    const MIN_STROKES = 3;
    const MIN_IMAGE_SIZE = 5000; // base64 length

    const safeStrokes = Number(strokesCount || 0);

if (safeStrokes < MIN_STROKES || image.length < MIN_IMAGE_SIZE) {
  return res.json({
    success: true,
    result: "wrong",
    score: 0,
    message: "Draw more clearly before checking",
  });
}

    /* =========================
       3️⃣ FETCH EXPECTED WORD
    ========================== */
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    /* =========================
       4️⃣ CALL ML SERVICE
       (SAFE + GUARDED)
    ========================== */
    let mlResponse;
    try {
      mlResponse = await axios.post(
        `${ML_URL}/predict`,
        { image },
        { timeout: 5000 }
      );
    } catch (err) {
      console.error("ML service error:", err.message);
      return res.json({
        success: true,
        result: "wrong",
        score: 0,
        message: "Could not recognize drawing clearly",
      });
    }

    const { label, confidence } = mlResponse.data;

    const predictedLabel = String(label || "").toLowerCase().trim();
    const expectedLabel = word.text.toLowerCase().trim();

    /* =========================
       5️⃣ DECISION LOGIC
       (STRICT & EXPLAINABLE)
    ========================== */
    let result = "wrong";
    let score = 0;

    if (predictedLabel === expectedLabel && confidence >= 0.95) {
      result = "correct";
      score = 1;
    } else if (predictedLabel === expectedLabel && confidence >= 0.7) {
      result = "almost";
    }

    /* =========================
       6️⃣ SAVE PROGRESS
    ========================== */
    await Progress.create({
      userId,
      word: word._id,
      category: word.category || null,
      expectedWord: word.text,
      result,
      score,
    });

    /* =========================
       7️⃣ RESPONSE
    ========================== */
    return res.json({
      success: true,
      result,
      score,
      predictedLabel,
      confidence: Number(confidence.toFixed(2)),
    });

  } catch (error) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      success: false,
      message: "Evaluation failed",
    });
  }
};