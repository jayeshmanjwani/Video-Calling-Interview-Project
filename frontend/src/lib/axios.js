import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "";
const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, "");

const axiosInstance = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

export default axiosInstance;
