import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import propertyRoutes from "./routes/propertyRoutes.js";
import authRoutes from "./routes/authRoutes.js";



const app = express();

// ================= DB =================
connectDB();

// ================= __dirname FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================

// JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER (IMPORTANT FOR AUTH)
app.use(cookieParser());

// CORS FIX (IMPORTANT FOR FRONTEND AUTH)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// STATIC FILES (UPLOADS)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});