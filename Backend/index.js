import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import propertyRoutes from "./routes/propertyRoutes.js";








connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));










// app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/properties", propertyRoutes);









const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});