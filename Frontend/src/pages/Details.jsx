import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty, deleteProperty } from "../services/api";

// Simple SVG fallback images
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='400' viewBox='0 0 700 400'%3E%3Crect width='700' height='400' fill='%23f3f4f6'/%3E%3Ctext x='350' y='200' font-family='Arial' font-size='20' fill='%239ca3af' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
const FALLBACK_THUMB = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Crect width='80' height='60' fill='%23f3f4f6'/%3E%3Ctext x='40' y='35' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle'%3ENo%3C/text%3E%3C/svg%3E";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [form, setForm] = useState({});
  const [newPhotos, setNewPhotos] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Available amenities list
  const amenitiesList = [
    "parking", "gym", "security", "swimming_pool", "elevator",
    "backup_electricity", "gas_connection", "water_supply", 
    "internet", "cctv", "air_conditioning", "heating"
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await getPropertyById(id);
      const propertyData = data.property || data;

      setProperty(propertyData);
      setForm({
        title: propertyData.title || "",
        description: propertyData.description || "",
        type: propertyData.type || "house",
        status: propertyData.status || "for_sale",
        price: propertyData.price || "",
        address: propertyData.location?.address || "",
        city: propertyData.location?.city || "",
        area: propertyData.location?.area || "",
        zipCode: propertyData.location?.zipCode || "",
        landmark: propertyData.location?.landmark || "",
        sizeValue: propertyData.size?.value || "",
        sizeUnit: propertyData.size?.unit || "marla",
        bedrooms: propertyData.bedrooms || "",
        bathrooms: propertyData.bathrooms || "",
        kitchens: propertyData.kitchens || "1",
        floors: propertyData.floors || "1",
        yearBuilt: propertyData.yearBuilt || "",
        condition: propertyData.condition || "good",
        isFurnished: propertyData.isFurnished || false,
        furnishedType: propertyData.furnishedType || "unfurnished",
        availableFrom: propertyData.availableFrom ? propertyData.availableFrom.split('T')[0] : "",
        contactName: propertyData.contact?.name || "",
        contactPhone: propertyData.contact?.phone || "",
        contactWhatsapp: propertyData.contact?.whatsapp || "",
        contactEmail: propertyData.contact?.email || "",
      });
      
      setNearbyPlaces(propertyData.nearby || []);
      setSelectedAmenities(propertyData.amenities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Nearby places functions
  const addNearbyPlace = () => {
    setNearbyPlaces([...nearbyPlaces, { name: "", type: "school", distance: "" }]);
  };

  const removeNearbyPlace = (index) => {
    const updated = nearbyPlaces.filter((_, i) => i !== index);
    setNearbyPlaces(updated);
  };

  const updateNearbyPlace = (index, field, value) => {
    const updated = [...nearbyPlaces];
    updated[index][field] = value;
    setNearbyPlaces(updated);
  };

  // Toggle amenities
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      
      // Basic fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      
      // Nearby places
      formData.append("nearby", JSON.stringify(nearbyPlaces));
      
      // Amenities
      formData.append("amenities", JSON.stringify(selectedAmenities));
      
      // Files
      newPhotos.forEach((photo) => formData.append("photos", photo));
      if (newVideo) formData.append("video", newVideo);

      const updated = await updateProperty(id, formData);
      setProperty(updated.property);
      setEditMode(false);
      setSuccessMsg("Property updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!property) return null;

  const photos = property.photos || [];
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[activePhoto] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-5 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
      >
        ← Back to Listings
      </button>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ {successMsg}
        </div>
      )}

      {/* View Mode */}
      {!editMode && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6">
            {/* Left Column - Images & Video */}
            <div className="lg:w-1/2">
              {/* Main Image */}
              <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-100">
                {hasPhotos ? (
                  <img
                    src={currentPhoto}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasPhotos && photos.length > 1 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`thumbnail-${index}`}
                      className={`w-16 h-14 object-cover rounded cursor-pointer transition ${index === activePhoto ? "ring-2 ring-blue-600" : "hover:opacity-80"}`}
                      onClick={() => setActivePhoto(index)}
                      onError={(e) => {
                        e.target.src = FALLBACK_THUMB;
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Video Player */}
              {property.videoUrl && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">🎬 Property Video</h4>
                  <video controls className="w-full rounded-lg" src={property.videoUrl}>
                    Your browser does not support video.
                  </video>
                </div>
              )}
            </div>

            {/* Right Column - Property Info */}
            <div className="lg:w-1/2 space-y-4">
              {/* Title & Badges */}
              <div className="flex justify-between items-start flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm capitalize">
                    {property.type}
                  </span>
                  <span className={`px-3 py-1 text-white rounded-full text-sm capitalize ${property.status === "for_sale" ? "bg-blue-600" : "bg-orange-500"}`}>
                    {property.status?.replace("_", " ") || property.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📝 Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Price */}
              <h3 className="text-3xl font-bold text-blue-600">
                Rs. {property.price?.toLocaleString() || property.price}
              </h3>

              {/* Property Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>📍 Address:</strong> {property.location?.address}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🏙️ City:</strong> {property.location?.city}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🗺️ Area:</strong> {property.location?.area}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>📐 Size:</strong> {property.size?.value} {property.size?.unit}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🛏️ Bedrooms:</strong> {property.bedrooms}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🚿 Bathrooms:</strong> {property.bathrooms}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🍳 Kitchens:</strong> {property.kitchens || 1}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <strong>🏢 Floors:</strong> {property.floors || 1}
                </div>
                {property.yearBuilt && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>🏗️ Year Built:</strong> {property.yearBuilt}
                  </div>
                )}
                {property.condition && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>🔧 Condition:</strong> {property.condition}
                  </div>
                )}
                {property.isFurnished && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>🛋️ Furnished:</strong> {property.furnishedType}
                  </div>
                )}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">✨ Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {amenity.replace(/_/g, " ").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {property.nearby?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">📍 Nearby Places</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {property.nearby.map((place, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-semibold">{place.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{place.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-600 font-semibold">{place.distance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <strong>📅 Listed:</strong> {new Date(property.listedDate).toLocaleDateString()}
                </div>
                {property.availableFrom && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <strong>📆 Available:</strong> {new Date(property.availableFrom).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">📞 Contact Info</h4>
                <p className="text-gray-600 mb-1">👤 {property.contact?.name}</p>
                <p className="text-gray-600 mb-1">📞 {property.contact?.phone}</p>
                {property.contact?.whatsapp && (
                  <p className="text-gray-600 mb-1">💬 WhatsApp: {property.contact.whatsapp}</p>
                )}
                {property.contact?.email && (
                  <p className="text-gray-600">📧 Email: {property.contact.email}</p>
                )}
              </div>

              {/* Views Counter */}
              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600">👁️ Viewed {property.views || 0} times</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  ✏️ Edit Property
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Form */}
      {editMode && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-5">✏️ Edit Property</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows="3" className="w-full border p-2 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (Rs.) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Available From</label>
                <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">📍 Location</h3>
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full border p-2 rounded mb-2" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border p-2 rounded" />
                <input name="area" placeholder="Area" value={form.area} onChange={handleChange} required className="border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} className="border p-2 rounded" />
                <input name="landmark" placeholder="Landmark" value={form.landmark} onChange={handleChange} className="border p-2 rounded" />
              </div>
            </div>

            {/* Size & Rooms */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">📐 Size & Rooms</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="sizeValue" type="number" placeholder="Size" value={form.sizeValue} onChange={handleChange} required className="border p-2 rounded" />
                <select name="sizeUnit" value={form.sizeUnit} onChange={handleChange} className="border p-2 rounded">
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal</option>
                  <option value="sqft">Sq. Ft.</option>
                </select>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <input name="bedrooms" type="number" placeholder="Beds" value={form.bedrooms} onChange={handleChange} required className="border p-2 rounded" />
                <input name="bathrooms" type="number" placeholder="Baths" value={form.bathrooms} onChange={handleChange} required className="border p-2 rounded" />
                <input name="kitchens" type="number" placeholder="Kitchens" value={form.kitchens} onChange={handleChange} className="border p-2 rounded" />
                <input name="floors" type="number" placeholder="Floors" value={form.floors} onChange={handleChange} className="border p-2 rounded" />
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">🏠 Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="yearBuilt" type="number" placeholder="Year Built" value={form.yearBuilt} onChange={handleChange} className="border p-2 rounded" />
                <select name="condition" value={form.condition} onChange={handleChange} className="border p-2 rounded">
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="isFurnished" checked={form.isFurnished} onChange={handleChange} />
                <label>Furnished</label>
                {form.isFurnished && (
                  <select name="furnishedType" value={form.furnishedType} onChange={handleChange} className="border p-2 rounded ml-2">
                    <option value="fully">Fully Furnished</option>
                    <option value="semi">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">✨ Amenities</h3>
              <div className="grid grid-cols-3 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                    {amenity.replace("_", " ")}
                  </label>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">📍 Nearby Places</h3>
              {nearbyPlaces.map((place, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input placeholder="Name" value={place.name} onChange={(e) => updateNearbyPlace(index, "name", e.target.value)} className="flex-1 border p-2 rounded" />
                  <select value={place.type} onChange={(e) => updateNearbyPlace(index, "type", e.target.value)} className="border p-2 rounded">
                    <option value="school">School</option>
                    <option value="hospital">Hospital</option>
                    <option value="mall">Mall</option>
                    <option value="park">Park</option>
                    <option value="mosque">Mosque</option>
                    <option value="bank">Bank</option>
                  </select>
                  <input placeholder="Distance" value={place.distance} onChange={(e) => updateNearbyPlace(index, "distance", e.target.value)} className="border p-2 rounded" />
                  <button type="button" onClick={() => removeNearbyPlace(index)} className="bg-red-500 text-white px-3 rounded">✕</button>
                </div>
              ))}
              <button type="button" onClick={addNearbyPlace} className="bg-green-500 text-white px-3 py-1 rounded text-sm">+ Add Nearby Place</button>
            </div>

            {/* Media */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">📷 Media</h3>
              <input type="file" multiple onChange={(e) => setNewPhotos(Array.from(e.target.files))} accept="image/*" className="w-full border p-2 rounded mb-2" />
              {newPhotos.length > 0 && <p className="text-sm text-blue-600">{newPhotos.length} new photo(s) selected</p>}
              <input type="file" onChange={(e) => setNewVideo(e.target.files[0])} accept="video/*" className="w-full border p-2 rounded" />
              {newVideo && <p className="text-sm text-blue-600">New video: {newVideo.name}</p>}
            </div>

            {/* Contact */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">📞 Contact</h3>
              <input name="contactName" placeholder="Name" value={form.contactName} onChange={handleChange} required className="w-full border p-2 rounded mb-2" />
              <input name="contactPhone" placeholder="Phone" value={form.contactPhone} onChange={handleChange} required className="w-full border p-2 rounded mb-2" />
              <input name="contactWhatsapp" placeholder="WhatsApp" value={form.contactWhatsapp} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
              <input name="contactEmail" placeholder="Email" value={form.contactEmail} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded">
                {submitting ? "Saving..." : "💾 Save Changes"}
              </button>
              <button type="button" onClick={() => { setEditMode(false); fetchProperty(); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;