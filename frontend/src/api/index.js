import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API = axios.create({ baseURL: API_BASE_URL });

export const uploadFile = (formData) =>
  API.post("/users/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const fetchUsers = (params) => API.get("/users", { params });
export const fetchSavedSearches = () => API.get("/searches");
export const saveSearch = (data) => API.post("/searches", data);
export const deleteSearch = (id) => API.delete(`/searches/${id}`);
export const updateUser = (id, updatedData) => API.put(`/users/${id}`, updatedData);
export const deleteUser = (id) => API.delete(`/users/${id}`);