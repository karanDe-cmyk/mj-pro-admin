import axios from "axios";

const instance = axios.create({
  baseURL: "https://matka-admin-backend.onrender.com",
  timeout: 5000, 
});

// Request interceptor
instance.interceptors.request.use(
    async (config) => {
      try {
        const accessToken = localStorage.getItem("accessToken");
  
        if (accessToken) {
          // Log the Authorization header to check if the token is set
          console.log("Authorization Token in Request Header:", config.headers.Authorization);
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.log("No Authorization token found in localStorage.");
        }
  
        return config;
      } catch (error) {
        console.error("Error setting Authorization header:", error);
        return Promise.reject(error);
      }
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );
  

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log("Response status:", response.status);  // Log the status code
    console.log("Response data:", response.data);      // Log the data
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error message:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized error. Redirecting to login...");
      // Redirect to login logic if needed
    }

    return Promise.reject(error);
  }
);

export default instance;
