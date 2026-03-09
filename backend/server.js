// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
// const cors = require("cors");

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: "*",      // allow all for now
//   credentials: true
// }));

// // Routes
// app.use("/api/auth", authRoutes);

// // DB Connect
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");

// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// const app = express();

// // Security Middlewares
// app.use(helmet()); // secure headers
// app.use(cors({
//   origin: ["http://localhost:8081", "http://localhost:8082"],
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));
// app.use(cookieParser());

// // Basic middlewares
// app.use(express.json());


// // Routes
// app.use("/api/auth", authRoutes);

// app.use("/api/phonological", phonologicalRoutes);

// // Health Route (Testing ke liye)
// app.get("/", (req, res) => {
//   res.send("Backend Running Securely 🚀");
// });

// // MongoDB Connect
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✔ MongoDB Connected Successfully");
//   })
//   .catch((err) => {
//     console.log("❌ MongoDB Error:", err.message);
//   });

// // Server Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const workingMemoryRoutes = require("./routes/workingMemoryRoutes");
const historyRoutes = require("./routes/history");
const readingRoutes = require("./routes/readingRoutes");

dotenv.config();
const app = express();


// Security Middlewares
app.use(helmet()); // secure headers
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:8082"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(cookieParser());

// Basic middlewares
app.use(express.json());

// Rate Limiting - login par brute force attack rokne ke liye
// app.use("/api/auth/login", rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 min
//   max: 5,
//   message: "Too many login attempts, please try later"
// }));

// Routes
app.use("/api/auth", authRoutes);

// Health Route (Testing ke liye)
app.get("/", (req, res) => {
  res.send("Backend Running Securely 🚀");
});
app.use("/api/phonological", require("./routes/phonologicalRoutes"));
app.use("/api/working-memory", workingMemoryRoutes);
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/history", historyRoutes);
app.use("/api/reading", readingRoutes);


app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});




// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✔ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});