import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import stockRoutes from "./routes/stock.routes.js";
import upload from "./config/multerConfig.js"; // Import from new file
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Home Stock API" });
});

app.use("/api/v1/stock", stockRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () =>
      console.log(`Server running on localhost:${PORT}`),
    ).on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

export { upload, cloudinary }; // Still export for other files if needed