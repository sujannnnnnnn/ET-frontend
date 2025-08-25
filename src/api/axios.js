import axios from "axios";

const api = axios.create({
  baseURL: "https://et-7.onrender.com", // FastAPI backend
});

// Auth
export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) =>
  api.post("/auth/login", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

export const getMe = (token) =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Expenses
export const getExpenses = (token) =>
  api.get("/expenses", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createExpense = (data, token) =>
  api.post("/expenses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Delete Expense
export const deleteExpense = (id, token) =>
  api.delete(`/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;

