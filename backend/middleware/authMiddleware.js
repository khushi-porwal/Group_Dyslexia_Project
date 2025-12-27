const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Authorization denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
