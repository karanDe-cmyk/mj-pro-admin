import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Use runtime-configured API URL
const instance = axios.create({
  baseURL :'https://demo-api.phoenixappapi.com'
  // baseURL: "https://matkabar-api.kglame.com"
  // baseURL: window.ENV?.API_URL,
  // baseURL: "http://localhost:5002"
});

let isRedirecting = false;

// Attach Token
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Expired Token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data?.message === "Invalid Token !!"
    ) {
      if (!isRedirecting) {
        isRedirecting = true;

        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark"
        });

        localStorage.clear();

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
