import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid token -> back to login (401 only; 403 means "no permission")
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLogin = err.config?.url?.includes("/auth/login");
    if (err.response?.status === 401 && !isLogin) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Accepts [..] or { data: [..] } or { items: [..] }
export const toList = (res) => {
  const d = res.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    const arr = Object.values(d).find(Array.isArray);
    if (arr) return arr;
  }
  return [];
};

export const errMsg = (e) => e.response?.data?.message || e.message || "Something went wrong";

export default api;