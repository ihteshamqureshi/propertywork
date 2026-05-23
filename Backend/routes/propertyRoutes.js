import express from "express";
import { handleUpload } from "../middleware/upload.js";

import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";
  
const router = express.Router();

// GET  /api/properties        → Find All (with filters & pagination)
router.get("/", getAllProperties);

// GET  /api/properties/:id    → Find One
router.get("/:id", getPropertyById);

// POST /api/properties        → Create (with photo + video upload)
router.post("/", handleUpload, createProperty);

// PUT  /api/properties/:id    → Update (with optional new photo/video)
router.put("/:id", handleUpload, updateProperty);

// DELETE /api/properties/:id  → Delete (also removes files from disk)
router.delete("/:id", deleteProperty);

export default router;