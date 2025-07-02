import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const instance = axios.create({
 // baseURL: "https://maya-api.kglame.com",
  //baseURL :'https://maya-api.kglame.com'
  baseURL:"https://maya-api.kglame.com"
});


let isRedirecting = false; // Prevent multiple redirects

// ✅ Request Interceptor (Attach Token)
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  } 
);

// ✅ Response Interceptor (Handle Expired Token)
instance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Invalid Token !!"
    ) {
      if (!isRedirecting) {
        isRedirecting = true;

        // Show Toast Notification
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000, // 3s delay before closing
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        // Clear local storage
        localStorage.clear();

        // Redirect after a short delay (allows user to see the message)
        setTimeout(() => {
          window.location.href = "/";
        }, 300); // 3s delay before redirecting
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
