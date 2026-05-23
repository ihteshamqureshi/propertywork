import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/properties",
});

// CREATE
export const createProperty = async (formData) => {
  return await API.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET ALL
export const getAllProperties = async () => {
  return await API.get("/");
};

// GET ONE
export const getPropertyById = async (id) => {
  return await API.get(`/${id}`);
};

// UPDATE
export const updateProperty = async (id, formData) => {
  return await API.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
export const deleteProperty = async (id) => {
  return await API.delete(`/${id}`);
};