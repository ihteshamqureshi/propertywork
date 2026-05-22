// src/pages/PropertyForm.jsx

import React, { useState } from "react";
import axios from "axios";

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "house",
    status: "for_sale",
    price: "",

    address: "",
    city: "",
    area: "",

    lat: "",
    lng: "",

    sizeValue: "",
    sizeUnit: "marla",

    bedrooms: "",
    bathrooms: "",

    contactName: "",
    phone: "",
    whatsapp: "",
  });

  const [files, setFiles] = useState([]);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // FILE CHANGE
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("status", formData.status);
      data.append("price", formData.price);

      data.append("location[address]", formData.address);
      data.append("location[city]", formData.city);
      data.append("location[area]", formData.area);

      data.append("location[coordinates][lat]", formData.lat);
      data.append("location[coordinates][lng]", formData.lng);

      data.append("size[value]", formData.sizeValue);
      data.append("size[unit]", formData.sizeUnit);

      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);

      data.append("contact[name]", formData.contactName);
      data.append("contact[phone]", formData.phone);
      data.append("contact[whatsapp]", formData.whatsapp);

      // FILES
      for (let i = 0; i < files.length; i++) {
        data.append("files", files[i]);
      }

      const res = await axios.post(
        "/api/properties",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      alert("Property Created Successfully");

    } catch (error) {
      console.log(error);
      alert("Error Creating Property");
    }
  };

  return (



    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto py-20 px-3">

      {/* POPUP */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl">

        {/* HEADER */}
        <div className="bg-blue-600 px-6 sm:px-10 py-6 rounded-t-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Create Property
          </h1>

          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Add your property details below
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* INPUT STYLE */}
          {/* add this same class in all inputs */}
          {/* h-12 sm:h-14 */}

          {/* TITLE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Property Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter property title"
              value={formData.title}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Property Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Address
            </label>

            <input
              type="text"
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              City
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* AREA */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Area
            </label>

            <input
              type="text"
              name="area"
              placeholder="Enter area"
              value={formData.area}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LATITUDE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Latitude
            </label>

            <input
              type="number"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LONGITUDE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Longitude
            </label>

            <input
              type="number"
              name="lng"
              placeholder="Longitude"
              value={formData.lng}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SIZE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Size
            </label>

            <input
              type="number"
              name="sizeValue"
              placeholder="Enter size"
              value={formData.sizeValue}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SIZE UNIT */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Size Unit
            </label>

            <select
              name="sizeUnit"
              value={formData.sizeUnit}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
              <option value="sqft">Sqft</option>
            </select>
          </div>

          {/* BEDROOMS */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Bedrooms
            </label>

            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BATHROOMS */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Bathrooms
            </label>

            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CONTACT NAME */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Contact Name
            </label>

            <input
              type="text"
              name="contactName"
              placeholder="Owner name"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* WHATSAPP */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              WhatsApp
            </label>

            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp number"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* FILE */}
          <div className="md:col-span-2">
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              Upload Photos / Videos
            </label>

            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50 text-center">

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm cursor-pointer"
              />

              <p className="text-gray-500 mt-3 text-sm">
                Upload property images and videos
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 pt-3">
            <button
              type="submit"
              className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
            >
              Create Property
            </button>
          </div>

        </form>
      </div>
    </div>







  );
};

export default PropertyForm;