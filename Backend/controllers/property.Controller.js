import Property from "../models/Property.js";

// Helper: build public URL for a file
const getFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// ================= 1. CREATE PROPERTY =================
export const createProperty = async (req, res) => {
  try {
    const photoFiles = req.files?.["photos"] || [];
    const videoFile = req.files?.["video"]?.[0] || null;

    if (photoFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 1 photo",
      });
    }

    const photoUrls = photoFiles.map((file) => getFileUrl(req, file.filename));
    const videoUrl = videoFile ? getFileUrl(req, videoFile.filename) : null;

    // Parse nearby places
    let nearbyPlaces = [];
    if (req.body.nearby) {
      try {
        nearbyPlaces = typeof req.body.nearby === 'string' 
          ? JSON.parse(req.body.nearby) 
          : req.body.nearby;
      } catch (error) {
        nearbyPlaces = [];
      }
    }

    // Parse amenities
    let amenitiesList = [];
    if (req.body.amenities) {
      try {
        amenitiesList = typeof req.body.amenities === 'string'
          ? JSON.parse(req.body.amenities)
          : req.body.amenities;
      } catch (error) {
        amenitiesList = [];
      }
    }

    const propertyData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      status: req.body.status,
      price: req.body.price,
      
      location: {
        address: req.body.address,
        city: req.body.city,
        area: req.body.area,
        zipCode: req.body.zipCode,
        landmark: req.body.landmark,
      },
      
      nearby: nearbyPlaces,
      amenities: amenitiesList,
      
      size: {
        value: req.body.sizeValue,
        unit: req.body.sizeUnit,
      },
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      kitchens: req.body.kitchens || 1,
      floors: req.body.floors || 1,
      
      yearBuilt: req.body.yearBuilt,
      condition: req.body.condition,
      isFurnished: req.body.isFurnished === "true" || req.body.isFurnished === true,
      furnishedType: req.body.furnishedType,
      
      availableFrom: req.body.availableFrom || null,
      
      photos: photoUrls,
      videoUrl: videoUrl,
      
      contact: {
        name: req.body.contactName,
        phone: req.body.contactPhone,
        whatsapp: req.body.contactWhatsapp || "",
        email: req.body.contactEmail || "",
      },
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: "Property created successfully!",
      property: property,
    });

  } catch (error) {
    console.error("Create Property Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create property",
    });
  }
};

// ================= 2. GET ALL PROPERTIES =================
export const getAllProperties = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.city) filter["location.city"] = req.query.city;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { "location.city": { $regex: req.query.search, $options: "i" } },
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: total,
      page: page,
      pages: Math.ceil(total / limit),
      properties: properties,
    });

  } catch (error) {
    console.error("Get All Properties Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch properties",
    });
  }
};

// ================= 3. GET SINGLE PROPERTY =================
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    property.views = (property.views || 0) + 1;
    await property.save();

    res.status(200).json({
      success: true,
      property: property,
    });

  } catch (error) {
    console.error("Get Property By ID Error:", error.message);
    
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch property",
    });
  }
};

// ================= 4. UPDATE PROPERTY =================
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const photoFiles = req.files?.["photos"] || [];
    const videoFile = req.files?.["video"]?.[0] || null;

    const photoUrls = photoFiles.length > 0
      ? photoFiles.map((file) => getFileUrl(req, file.filename))
      : property.photos;

    const videoUrl = videoFile
      ? getFileUrl(req, videoFile.filename)
      : property.videoUrl;

    // Parse nearby places
    let nearbyPlaces = property.nearby;
    if (req.body.nearby) {
      try {
        nearbyPlaces = typeof req.body.nearby === 'string'
          ? JSON.parse(req.body.nearby)
          : req.body.nearby;
      } catch (error) {
        nearbyPlaces = property.nearby;
      }
    }

    // Parse amenities
    let amenitiesList = property.amenities;
    if (req.body.amenities) {
      try {
        amenitiesList = typeof req.body.amenities === 'string'
          ? JSON.parse(req.body.amenities)
          : req.body.amenities;
      } catch (error) {
        amenitiesList = property.amenities;
      }
    }

    // Update fields
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.type = req.body.type || property.type;
    property.status = req.body.status || property.status;
    property.price = req.body.price || property.price;
    property.bedrooms = req.body.bedrooms || property.bedrooms;
    property.bathrooms = req.body.bathrooms || property.bathrooms;
    property.kitchens = req.body.kitchens || property.kitchens;
    property.floors = req.body.floors || property.floors;
    property.yearBuilt = req.body.yearBuilt || property.yearBuilt;
    property.condition = req.body.condition || property.condition;
    property.isFurnished = req.body.isFurnished === "true" || req.body.isFurnished === true || property.isFurnished;
    property.furnishedType = req.body.furnishedType || property.furnishedType;
    property.availableFrom = req.body.availableFrom || property.availableFrom;
    
    property.photos = photoUrls;
    property.videoUrl = videoUrl;
    property.nearby = nearbyPlaces;
    property.amenities = amenitiesList;

    // Update location
    if (req.body.address || req.body.city || req.body.area) {
      property.location.address = req.body.address || property.location.address;
      property.location.city = req.body.city || property.location.city;
      property.location.area = req.body.area || property.location.area;
      property.location.zipCode = req.body.zipCode || property.location.zipCode;
      property.location.landmark = req.body.landmark || property.location.landmark;
    }

    // Update size
    if (req.body.sizeValue || req.body.sizeUnit) {
      property.size.value = req.body.sizeValue || property.size.value;
      property.size.unit = req.body.sizeUnit || property.size.unit;
    }

    // Update contact
    if (req.body.contactName || req.body.contactPhone) {
      property.contact.name = req.body.contactName || property.contact.name;
      property.contact.phone = req.body.contactPhone || property.contact.phone;
      property.contact.whatsapp = req.body.contactWhatsapp || property.contact.whatsapp;
      property.contact.email = req.body.contactEmail || property.contact.email;
    }

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully!",
      property: updatedProperty,
    });

  } catch (error) {
    console.error("Update Property Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update property",
    });
  }
};

// ================= 5. DELETE PROPERTY =================
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
      message: "Property deleted successfully!",
    });

  } catch (error) {
    console.error("Delete Property Error:", error.message);
    
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete property",
    });
  }
};