import Property from "../models/Property.js";
import fs from "fs";
import path from "path";
// Helper: build absolute URL for a file path
const buildFileUrl = (req, filePath) => {
  if (!filePath) return null;
  // If already a full URL, return as-is
  if (filePath.startsWith("http")) return filePath;
  const relativePath = filePath.replace(/\\/g, "/").split("uploads/")[1];
  return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
};

// Helper: delete a file from disk safely
const deleteFile = (filePath) => {
  if (!filePath || filePath.startsWith("http")) return;
  try {
    const fullPath = path.join(__dirname, "../uploads", filePath.split("uploads/")[1]);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (e) {
    console.error("File delete error:", e.message);
  }
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const body = req.body;

    // Collect uploaded photo paths
    const photoPaths = req.files?.photos?.map((f) => f.path) || [];
    if (photoPaths.length === 0) {
      return res.status(400).json({ success: false, message: "At least 1 photo is required." });
    }

    // Collect optional video path
    const videoFile = req.files?.video?.[0];
    const videoPath = videoFile ? videoFile.path : null;

    // Build nested objects from flat form-data keys
    const propertyData = {
      title: body.title,
      type: body.type,
      status: body.status,
      price: Number(body.price),
      location: {
        address: body["location.address"] || body.address,
        city: body["location.city"] || body.city,
        area: body["location.area"] || body.area,
        coordinates: {
          lat: body["location.coordinates.lat"] ? Number(body["location.coordinates.lat"]) : undefined,
          lng: body["location.coordinates.lng"] ? Number(body["location.coordinates.lng"]) : undefined,
        },
      },
      size: {
        value: Number(body["size.value"] || body.sizeValue),
        unit: body["size.unit"] || body.sizeUnit,
      },
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      photos: photoPaths,
      videoUrl: videoPath,
      contact: {
        name: body["contact.name"] || body.contactName,
        phone: body["contact.phone"] || body.contactPhone,
        whatsapp: body["contact.whatsapp"] || body.contactWhatsapp || undefined,
      },
      isActive: body.isActive !== undefined ? body.isActive === "true" : true,
    };

    const property = new Property(propertyData);
    await property.save();

    // Return URLs instead of raw disk paths in response
    const responseData = property.toObject();
    responseData.photos = responseData.photos.map((p) => buildFileUrl(req, p));
    responseData.videoUrl = buildFileUrl(req, responseData.videoUrl);

    res.status(201).json({ success: true, message: "Property created successfully.", data: responseData });
  } catch (error) {
    // Clean up uploaded files on validation failure
    if (req.files?.photos) req.files.photos.forEach((f) => deleteFile(f.path));
    if (req.files?.video) req.files.video.forEach((f) => deleteFile(f.path));

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("createProperty error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── FIND ALL ─────────────────────────────────────────────────────────────────
// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const {
      type,
      status,
      city,
      area,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sizeUnit,
      isActive,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (city) filter["location.city"] = { $regex: city, $options: "i" };
    if (area) filter["location.area"] = { $regex: area, $options: "i" };
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);
    if (sizeUnit) filter["size.unit"] = sizeUnit;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Property.countDocuments(filter),
    ]);

    // Convert paths to URLs
    const data = properties.map((p) => ({
      ...p,
      photos: p.photos.map((ph) => buildFileUrl(req, ph)),
      videoUrl: buildFileUrl(req, p.videoUrl),
    }));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data,
    });
  } catch (error) {
    console.error("getAllProperties error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── FIND ONE ─────────────────────────────────────────────────────────────────
// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    property.photos = property.photos.map((p) => buildFileUrl(req, p));
    property.videoUrl = buildFileUrl(req, property.videoUrl);

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid property ID." });
    }
    console.error("getPropertyById error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    const body = req.body;

    // Handle new photo uploads
    const newPhotoPaths = req.files?.photos?.map((f) => f.path) || [];
    // Handle new video upload
    const newVideoFile = req.files?.video?.[0];

    // Photos: if new photos uploaded, replace old; otherwise keep existing
    let finalPhotos = property.photos;
    if (newPhotoPaths.length > 0) {
      // Delete old photos from disk
      property.photos.forEach((p) => deleteFile(p));
      finalPhotos = newPhotoPaths;
    }

    // Video: if new video uploaded, replace old
    let finalVideo = property.videoUrl;
    if (newVideoFile) {
      if (property.videoUrl) deleteFile(property.videoUrl);
      finalVideo = newVideoFile.path;
    }

    // Build update object (only update fields provided)
    const updates = {
      ...(body.title && { title: body.title }),
      ...(body.type && { type: body.type }),
      ...(body.status && { status: body.status }),
      ...(body.price && { price: Number(body.price) }),
      location: {
        address: body["location.address"] || body.address || property.location.address,
        city: body["location.city"] || body.city || property.location.city,
        area: body["location.area"] || body.area || property.location.area,
        coordinates: {
          lat: body["location.coordinates.lat"]
            ? Number(body["location.coordinates.lat"])
            : property.location.coordinates?.lat,
          lng: body["location.coordinates.lng"]
            ? Number(body["location.coordinates.lng"])
            : property.location.coordinates?.lng,
        },
      },
      size: {
        value: body["size.value"] ? Number(body["size.value"]) : property.size.value,
        unit: body["size.unit"] || property.size.unit,
      },
      ...(body.bedrooms && { bedrooms: Number(body.bedrooms) }),
      ...(body.bathrooms && { bathrooms: Number(body.bathrooms) }),
      photos: finalPhotos,
      videoUrl: finalVideo,
      contact: {
        name: body["contact.name"] || body.contactName || property.contact.name,
        phone: body["contact.phone"] || body.contactPhone || property.contact.phone,
        whatsapp:
          body["contact.whatsapp"] || body.contactWhatsapp || property.contact.whatsapp,
      },
      ...(body.isActive !== undefined && { isActive: body.isActive === "true" }),
    };

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    updated.photos = updated.photos.map((p) => buildFileUrl(req, p));
    updated.videoUrl = buildFileUrl(req, updated.videoUrl);

    res.status(200).json({ success: true, message: "Property updated successfully.", data: updated });
  } catch (error) {
    if (req.files?.photos) req.files.photos.forEach((f) => deleteFile(f.path));
    if (req.files?.video) req.files.video.forEach((f) => deleteFile(f.path));

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid property ID." });
    }
    console.error("updateProperty error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    // Delete all associated files from disk
    property.photos.forEach((p) => deleteFile(p));
    if (property.videoUrl) deleteFile(property.videoUrl);

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid property ID." });
    }
    console.error("deleteProperty error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty };