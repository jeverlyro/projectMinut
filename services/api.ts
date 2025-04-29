import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://minutappbackend-production.up.railway.app/api";

// For debugging: Add console logs to check connection
console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to avoid long waiting times
  timeout: 10000,
});

// Add request/response interceptors for debugging
api.interceptors.request.use(async (config) => {
  try {
    console.log("Making request to:", config.url);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API methods
export const auth = {
  login: async (email: string, password: string) => {
    try {
      console.log("Sending login data:", { email, password: "****" });
      const response = await api.post("/auth/login", { email, password });
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      console.log("Sending registration data:", {
        username,
        email,
        password: "****",
      });
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  verifyOtp: async (userId: string, otp: string) => {
    try {
      const response = await api.post("/auth/verify-otp", { userId, otp });
      return response.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  resendOtp: async (userId: string) => {
    try {
      const response = await api.post("/auth/resend-otp", { userId });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Request password reset error:", error);
      throw error;
    }
  },

  verifyResetToken: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/reset-password/${token}`
      );
      return response.data;
    } catch (error) {
      console.error("Verify reset token error:", error);
      throw error;
    }
  },

  resetPassword: async (
    email: string,
    token: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        token,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};

export const user = {
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${API_URL}/users/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },
};

export default api;
