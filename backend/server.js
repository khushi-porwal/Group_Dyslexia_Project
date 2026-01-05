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

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Security Middlewares
app.use(helmet()); // secure headers
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:8082"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(cookieParser());

// Basic middlewares
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

// Health Route (Testing ke liye)
app.get("/", (req, res) => {
  res.send("Backend Running Securely 🚀");
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});