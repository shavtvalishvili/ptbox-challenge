import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`Sending request to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error: ", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response received: ", response);
    return response.data;
  },
  (error) => {
    console.error("Response Error: ", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;