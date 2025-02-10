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
instance.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                // console.log("Authorization Token in Request Header:", config.headers.Authorization);
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
export default instance;
