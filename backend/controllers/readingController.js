const wordsDB = [
  "was",
  "were",
  "have",
  "has",
  "am",
  "are",
  "because",
  "where",
  "their",
  "there",
  "friend",
  "school",
  "people",
  "thought",
  "through",
  "laugh",
  "again",
  "listen",
];

const tokenize = (text = "") => {
  const originalWords = text.trim().split(/\s+/).filter(Boolean);
  const normalizedWords = originalWords.map((w) =>
    w
      .toLowerCase()
      .replace(/[^a-z0-9']/gi, "")
  );

  return { originalWords, normalizedWords };
};

exports.getSuggestions = (req, res) => {
  const input = (req.query.input || "").toString().trim();

  if (!input) return res.json([]);

  const needle = input.split(/\s+/).pop().toLowerCase();

  const filtered = wordsDB
    .filter((word) => word.startsWith(needle))
    .slice(0, 6);

  res.json(filtered);
};

exports.analyzeText = (req, res) => {
  const {
    expectedText = "",
    actualText = "",
    mode = "typing",
  } = req.body;

  const expectedTokens = tokenize(expectedText);
  const actualTokens = tokenize(actualText);

  if (!actualTokens.originalWords.length) {
    return res.status(400).json({ message: "actualText is required" });
  }

  const mistakes = [];
  const maxLen = Math.max(
    expectedTokens.normalizedWords.length,
    actualTokens.normalizedWords.length
  );

  for (let i = 0; i < maxLen; i += 1) {
    const expectedWord = expectedTokens.normalizedWords[i];
    const actualWord = actualTokens.normalizedWords[i];

    const expectedRaw = expectedTokens.originalWords[i] || null;
    const actualRaw = actualTokens.originalWords[i] || "";

    // Missing or extra words count as mistakes
    if (!expectedWord && actualWord) {
      mistakes.push({ index: i, expected: null, actual: actualRaw });
      continue;
    }

    if (expectedWord && !actualWord) {
      mistakes.push({ index: i, expected: expectedRaw, actual: "" });
      continue;
    }

    if (expectedWord && actualWord && expectedWord !== actualWord) {
      mistakes.push({ index: i, expected: expectedRaw, actual: actualRaw });
    }
  }

  const totalWords = expectedTokens.normalizedWords.length || actualTokens.normalizedWords.length;
  const accuracy = totalWords
    ? Math.max(
        0,
        Math.round(((totalWords - mistakes.length) / totalWords) * 100)
      )
    : 100;

  const suggestions = mistakes
    .map((item) => item.expected || item.actual)
    .filter(Boolean)
    .flatMap((word) =>
      wordsDB.filter((w) => w.startsWith(word.toLowerCase())).slice(0, 1)
    )
    .slice(0, 6);

  res.json({
    mistakes,
    accuracy,
    expectedText: expectedTokens.originalWords.join(" "),
    normalizedActualText: actualTokens.originalWords.join(" "),
    suggestions,
    mode,
  });
};
