import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Serve frontend from the correct directory
app.use(express.static(path.join(__dirname, "..", "frontend-new", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend-new", "dist", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect to Database & Start Server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  });

export default app;
