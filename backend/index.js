const express = require("express");
const mongoose = require("mongoose"); // ✅ Remove destructuring
require("dotenv").config();

const app = express();
const { PORT = 3000, MONGODB_URL } = process.env;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL, {
    dbName: "TrustLedger",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
