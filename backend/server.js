import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/* ===============================
   ROUTES
================================ */

app.get("/", (req, res) => {
  res.send("Placement Major Backend Running Successfully 🚀");
});

app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes); // ✅ FIXED

/* ===============================
   DATABASE CONNECTION
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected to placement_major ✅");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error ❌:", err);
  });

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});