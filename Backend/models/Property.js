import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["house", "apartment", "plot", "commercial"],
      required: true,
    },
    status: { type: String, enum: ["for_sale", "for_rent"], required: true },
    price: { type: Number, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    size: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["marla", "kanal", "sqft"], required: true },
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    photos: {
      type: [String],
      validate: [(arr) => arr.length >= 1, "At least 1 photo is required"],
    },
    videos: {
      type: [String],
      default: [],
    },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      whatsapp: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;