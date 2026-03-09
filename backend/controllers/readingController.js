const wordsDB = ["was", "were", "have", "has", "am", "are"];

exports.getSuggestions = (req, res) => {
  const { input } = req.query;

  if (!input) return res.json([]);

  const filtered = wordsDB.filter(word =>
    word.startsWith(input.toLowerCase())
  );

  res.json(filtered);
};

exports.analyzeText = (req, res) => {
  const { text } = req.body;

  const mistakes = text
    .split(" ")
    .filter(word => word.length < 2);

  res.json({
    mistakes,
    score: 85,
  });
};