import Property from "../models/Property.js";
import { uploadToCloudinary } from "../middleware/upload.js";


// CREATE
export const createProperty = async (req, res) => {
  try {

    let photos = [];
    let videos = [];

    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const result = await uploadToCloudinary(file.path);

        // SAFE CHECK BY EXTENSION / MIME TYPE
        if (result.secure_url.includes("image")) {
          photos.push(result.secure_url);
        } else {
          videos.push(result.secure_url);
        }
      }
    }

    const property = await Property.create({
      ...req.body,
      photos,
      videos, 
    });

    return res.status(201).json({
      success: true,
      data: property,
    });

  } catch (error) {
    console.log("CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL
export const getProperties = async (req, res) => {
  try {

    const properties = await Property.find();

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// GET SINGLE
export const getPropertyById = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// UPDATE
export const updateProperty = async (req, res) => {
  try {

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// DELETE
export const deleteProperty = async (req, res) => {
  try {

    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};