import axios from "axios";

const instance = axios.create({
    baseURL: "https://api.kalyandpboss.shop",
});

// Request interceptor
instance.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
                // Log the Authorization header to check if the token is set
                // console.log("Authorization Token in Request Header:", config.headers.Authorization);
                config.headers.Authorization = `Bearer ${accessToken}`;
            } else {
                // console.log("No Authorization token found in localStorage.");
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
  (response) => response, // pass through successful responses
  (error) => {
    // Check if the response error contains the "Invalid Token" message
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Invalid Token !!"
    ) {
      // Clear all localStorage data
      localStorage.clear();
      // Optionally, display a toast message that the session expired
      // Redirect the user to the login page
      window.location.href = "/"; // adjust this path based on your routing setup
    }
    return Promise.reject(error);
  }
);


export default instance;
