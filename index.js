const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const errorhandler = require("./middleware/errorhandler");
const userroute = require("./routes/userroute");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Move CORS before JSON middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// ✅ Routes
app.use('/api/user', userroute);
app.use('/api/auth', authRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("✅ Backend is working!");
});

// ✅ Move error handler AFTER defining routes
app.use(errorhandler);

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
