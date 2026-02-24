const Progress = require("../models/Progress");

/**
 * GET OVERALL PROGRESS FOR A USER
 */
exports.getOverallProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const progress = await Progress.find({ userId });

    const totalAttempts = progress.length;

    const totalCorrect = progress.filter(
      (p) => p.result === "correct"
    ).length;

    const totalAlmost = progress.filter(
      (p) => p.result === "almost"
    ).length;

    const totalScore = progress.reduce(
      (sum, p) => sum + (p.score || 0),
      0
    );

    // Accuracy logic:
    // correct = 1, almost = 0.5
    const accuracy =
      totalAttempts === 0
        ? 0
        : Math.round(
            ((totalCorrect + totalAlmost * 0.5) / totalAttempts) * 100
          );

    res.json({
      success: true,
      totalAttempts,
      totalCorrect,
      totalAlmost,
      totalScore,
      accuracy,
    });
  } catch (error) {
    console.error("Overall progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};