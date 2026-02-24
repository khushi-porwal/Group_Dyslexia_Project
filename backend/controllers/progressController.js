const Progress = require("../models/Progress");

/**
 * GET OVERALL PROGRESS FOR A USER
 */
exports.getOverallProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await Progress.find({ userId });

    const totalAttempts = progress.length;
    const totalCorrect = progress.filter(
      (p) => p.result === "correct"
    ).length;

    const totalScore = progress.reduce(
      (sum, p) => sum + p.score,
      0
    );

    const accuracy =
      totalAttempts === 0
        ? 0
        : Math.round((totalCorrect / totalAttempts) * 100);

    res.json({
      totalAttempts,
      totalCorrect,
      totalScore,
      accuracy,
    });
  } catch (error) {
    console.error("Overall progress error:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};