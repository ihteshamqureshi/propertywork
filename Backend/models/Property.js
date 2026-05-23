import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["house", "apartment", "plot", "commercial"] },
    status: { type: String, required: true, enum: ["for_sale", "for_rent"] },
    price: { type: Number, required: true },

    // Dates
    listedDate: { type: Date, default: Date.now },
    availableFrom: Date,

    // Location
    location: {
      address: String,
      city: String,
      area: String,
      zipCode: String,
      landmark: String,
    },

    // Nearby Places - Array of objects (CORRECT WAY)
    nearby: {
      type: [
        {
          name: { type: String },
          type: { type: String },
          distance: { type: String },
        }
      ],
      default: []
    },

    // Amenities - Array of strings
    amenities: {
      type: [String],
      default: []
    },

    // Size & Rooms
    size: { value: Number, unit: String },
    bedrooms: Number,
    bathrooms: Number,
    kitchens: { type: Number, default: 1 },
    floors: { type: Number, default: 1 },

    // Features
    yearBuilt: Number,
    condition: String,
    isFurnished: { type: Boolean, default: false },
    furnishedType: String,

    // Media
    photos: [String],
    videoUrl: String,

    // Contact
    contact: {
      name: String,
      phone: String,
      whatsapp: String,
      email: String,
    },

    // Status
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;