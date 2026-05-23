import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties, createProperty, deleteProperty } from "../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form state with all new fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "house",
    status: "for_sale",
    price: "",
    address: "",
    city: "",
    area: "",
    zipCode: "",
    landmark: "",
    sizeValue: "",
    sizeUnit: "marla",
    bedrooms: "",
    bathrooms: "",
    kitchens: "1",
    floors: "1",
    yearBuilt: "",
    condition: "good",
    isFurnished: false,
    furnishedType: "unfurnished",
    availableFrom: "",
    contactName: "",
    contactPhone: "",
    contactWhatsapp: "",
    contactEmail: "",
  });

  // For nearby places
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  
  // For amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);

  // Available amenities list
  const amenitiesList = [
    "parking", "gym", "security", "swimming_pool", "elevator",
    "backup_electricity", "gas_connection", "water_supply", 
    "internet", "cctv", "air_conditioning", "heating"
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties();
      setProperties(data.properties);
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

  const handlePhotos = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      
      // Basic fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      
      // Nearby places (convert to JSON)
      formData.append("nearby", JSON.stringify(nearbyPlaces));
      
      // Amenities (convert to JSON)
      formData.append("amenities", JSON.stringify(selectedAmenities));
      
      // Files
      photos.forEach((photo) => formData.append("photos", photo));
      if (video) formData.append("video", video);

      await createProperty(formData);
      setSuccessMsg("Property added successfully!");
      setShowPopup(false);
      resetForm();
      fetchProperties();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "house",
      status: "for_sale",
      price: "",
      address: "",
      city: "",
      area: "",
      zipCode: "",
      landmark: "",
      sizeValue: "",
      sizeUnit: "marla",
      bedrooms: "",
      bathrooms: "",
      kitchens: "1",
      floors: "1",
      yearBuilt: "",
      condition: "good",
      isFurnished: false,
      furnishedType: "unfurnished",
      availableFrom: "",
      contactName: "",
      contactPhone: "",
      contactWhatsapp: "",
      contactEmail: "",
    });
    setNearbyPlaces([]);
    setSelectedAmenities([]);
    setPhotos([]);
    setVideo(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-blue-600">🏠 PropertyApp</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Property
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-600 py-10">Loading properties...</div>
      )}

      {!loading && properties.length === 0 && (
        <div className="text-center text-gray-600 py-10">No properties found. Add one!</div>
      )}

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            {/* Image */}
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              {property.photos?.[0] ? (
                <img
                  src={property.photos[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="text-gray-500">No Image</div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{property.title}</h3>
              <p className="text-gray-600 text-sm mb-1">
                📍 {property.location?.city}, {property.location?.area}
              </p>
              <p className="text-blue-600 font-bold text-lg mb-2">
                Rs. {property.price?.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                🏷️ {property.type} | {property.status?.replace("_", " ")}
              </p>
              <p className="text-gray-600 text-sm">
                🛏️ {property.bedrooms} Beds | 🚿 {property.bathrooms} Baths
              </p>
              
              {/* Show amenities badges */}
              {property.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {property.amenities.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.replace("_", " ")}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      +{property.amenities.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="flex gap-2 p-4 pt-0">
              <button
                onClick={() => navigate(`/property/${property._id}`)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
              <button
                onClick={() => handleDelete(property._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Add New Property</h2>
              <button
                onClick={() => {
                  setShowPopup(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Popup Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe your property..."
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
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
                    <input placeholder="Distance (e.g., 500m)" value={place.distance} onChange={(e) => updateNearbyPlace(index, "distance", e.target.value)} className="border p-2 rounded" />
                    <button type="button" onClick={() => removeNearbyPlace(index)} className="bg-red-500 text-white px-3 rounded">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addNearbyPlace} className="bg-green-500 text-white px-3 py-1 rounded text-sm">+ Add Nearby Place</button>
              </div>

              {/* Media */}
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">📷 Media</h3>
                <input type="file" multiple onChange={handlePhotos} accept="image/*" className="w-full border p-2 rounded mb-2" />
                <input type="file" onChange={handleVideo} accept="video/*" className="w-full border p-2 rounded" />
              </div>

              {/* Contact */}
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">📞 Contact</h3>
                <input name="contactName" placeholder="Name" value={form.contactName} onChange={handleChange} required className="w-full border p-2 rounded mb-2" />
                <input name="contactPhone" placeholder="Phone" value={form.contactPhone} onChange={handleChange} required className="w-full border p-2 rounded mb-2" />
                <input name="contactWhatsapp" placeholder="WhatsApp" value={form.contactWhatsapp} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
                <input name="contactEmail" placeholder="Email" value={form.contactEmail} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {submitting ? "Saving..." : "Save Property"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;