const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

/**
 * CREATE CATEGORY (industry-safe)
 */
router.post("/", async (req, res) => {
  try {
    let { name, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await Category.findOne({ name: normalizedName });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: normalizedName,      // 🔑 ONLY normalized goes to DB
      displayName: name.trim(),  // UI only
      order: order ?? 0,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
});


/**
 * GET ALL CATEGORIES (clean output)
 */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1 })
      .select("_id displayName order");

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

module.exports = router;
