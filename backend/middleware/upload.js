const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // ✅ ABSOLUTE PATH
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      crypto.randomBytes(6).toString("hex") +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// LIMITS (industry must)
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
