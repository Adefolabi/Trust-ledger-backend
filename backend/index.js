const express = require("express");
const mongoose = require("mongoose");
const userRouters = require("./routes/user");
const loginRouters = require("./routes/auth");
const requestRouters = require("./routes/request");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const { PORT = 3000, MONGODB_URL, API_URL } = process.env;

// middleware
app.use(express.json());
app.use(errorHandler);
// routes
app.use(`${API_URL}/users`, userRouters);
app.use(`${API_URL}/login`, loginRouters);
app.use(`${API_URL}/requests`, requestRouters);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL, {
    dbName: "TrustLedger",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
