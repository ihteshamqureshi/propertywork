import express from "express";

import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();
// Update backend to match frontend
router.post(
  "/createProperties",
  upload.array("images", 10),  // Changed from "files" to "images"
  createProperty
);

router.get("/", getProperties);

router.get("/:id", getPropertyById);

router.put(
  "/:id",
  upload.array("files", 10),
  updateProperty
);

router.delete("/:id", deleteProperty);

export default router;