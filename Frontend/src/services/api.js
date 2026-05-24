
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});



export default api;



/* ---------------- AUTH ---------------- */

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

export const logout = () => api.post("/auth/logout");





/* ---------------- PROPERTIES ---------------- */

export const getAllProperties = async (filters = {}) => {
  const res = await api.get("/properties", { params: filters });
  return res.data;
};

export const getPropertyById = async (id) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

export const createProperty = async (formData) => {
  const res = await api.post("/properties", formData);
  return res.data;
};

export const updateProperty = async (id, formData) => {
  const res = await api.put(`/properties/${id}`, formData);
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;

};






