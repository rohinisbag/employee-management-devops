import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await api.post("/employees", employee);
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};