// const Word = require("../models/Word");
// const Category = require("../models/Category");
// const fs = require("fs");
// const path = require("path");

// const deleteUploadedFile = (file) => {
//   if (!file) return;
//   const filePath = path.join(
//     __dirname,
//     "../uploads/words",
//     file.filename
//   );
//   fs.unlink(filePath, () => {});
// };

// exports.createWord = async (req, res) => {
//   try {
//     let { text, category } = req.body;

//     // 1️⃣ VALIDATION
//     if (!text || !category) {
//       deleteUploadedFile(req.file);
//       return res.status(400).json({
//         success: false,
//         message: "Text and category are required",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required",
//       });
//     }

//     // 2️⃣ VALIDATE CATEGORY
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       deleteUploadedFile(req.file);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid category ID",
//       });
//     }

//     // 3️⃣ NORMALIZE TEXT
//     const normalizedText = text.trim().toLowerCase();

//     // 4️⃣ CHECK DUPLICATE WORD
//     const existingWord = await Word.findOne({
//       text: normalizedText,
//       category,
//     });

//     if (existingWord) {
//       deleteUploadedFile(req.file);
//       return res.status(409).json({
//         success: false,
//         message: "Word already exists in this category",
//       });
//     }

//     // 5️⃣ IMAGE URL
//     const imageUrl = `/uploads/${req.file.filename}`;

//     // 6️⃣ CREATE WORD
//     const word = await Word.create({
//       text: normalizedText,
//       displayText: text.trim().replace(/\s+/g, " "),
//       category,
//       imageUrl,
//       minStrokes: 3,
//       difficulty: "easy",
//       marks: 10,
//     });

//     res.status(201).json({
//       success: true,
//       word,
//     });
//   } catch (error) {
//     deleteUploadedFile(req.file);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Word already exists in this category",
//       });
//     }

//     console.error("Create Word Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create word",
//     });
//   }
// };








const Word = require("../models/Word");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

/**
 * Delete uploaded image if something fails
 */
const deleteUploadedFile = (file) => {
  if (!file) return;
  const filePath = path.join(__dirname, "../uploads", file.filename);
  fs.unlink(filePath, () => {});
};

/**
 * CREATE WORD (REFERENCE IMAGE)
 * Admin uploads reference image (NOT ML training data)
 */
exports.createWord = async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || !category) {
      deleteUploadedFile(req.file);
      return res.status(400).json({
        success: false,
        message: "Text and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      deleteUploadedFile(req.file);
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const normalizedText = text.trim().toLowerCase();

    const existingWord = await Word.findOne({
      text: normalizedText,
      category,
    });

    if (existingWord) {
      deleteUploadedFile(req.file);
      return res.status(409).json({
        success: false,
        message: "Word already exists in this category",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const word = await Word.create({
      text: normalizedText,
      displayText: text.trim().replace(/\s+/g, " "),
      category,
      imageUrl,
      mlLabel: normalizedText, // 🔥 optional but future-proof
      imageType: "reference",  // 🔥 clarity
      difficulty: "easy",
      marks: 10,
    });

    return res.status(201).json({
      success: true,
      word,
    });
  } catch (error) {
    deleteUploadedFile(req.file);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Word already exists in this category",
      });
    }

    console.error("Create Word Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create word",
    });
  }
};