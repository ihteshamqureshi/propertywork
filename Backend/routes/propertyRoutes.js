


import express from "express";


import { uploadFields } from "../middleware/upload.js";


import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.Controller.js";



const router = express.Router();



// Routes


// Create new property (with photos & video)
router.post("/", uploadFields, createProperty);

// Get all properties
router.get("/", getAllProperties);

// Get single property by ID
router.get("/:id", getPropertyById);

// Update property
router.put("/:id", uploadFields, updateProperty);

// Delete property
router.delete("/:id", deleteProperty);





export default router;