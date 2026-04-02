import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

// API_BASE_URL được cấu hình từ environment:
// - Development: /api (sử dụng Vite proxy)
// - Production: full URL từ VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log("🔐 Bắt đầu login request với email:", credentials.email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Login request timeout sau 30 giây");
        controller.abort();
      }, 10000); // 30 giây timeout

      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log("📡 Response status:", response.status);
      
      // Kiểm tra nếu response có content trước khi parse JSON
      const contentType = response.headers.get("content-type");
      let data: LoginResponse;
      
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message, errors: data.errors });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response format from server (JSON parse failed)");
        }
      } else {
        console.error("❌ Invalid response content type:", contentType);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Login failed. Please try again.";
        console.error("❌ Login error:", errorMsg);
        throw new Error(errorMsg);
      }

      // Kiểm tra response format hợp lệ
      if (!data || typeof data.success === 'undefined') {
        console.error("❌ Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      if (!data.success) {
        const errorMsg = data.message || "Login failed";
        console.warn("⚠️ Login failed (success=false):", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ Login successful");
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("❌ CORS Error hoặc Network Error:", error);
        throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra internet hoặc thử lại sau.");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Vui lòng kiểm tra kết nối internet.");
    }
  },

  register: async (credentials: RegisterRequest): Promise<LoginResponse> => {
    try {
      const roleType = credentials.role === 2 ? "recruiter" : "talent";
      console.log("📝 Bắt đầu register request cho", roleType, "với email:", credentials.email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Register request timeout sau 30 giây");
        controller.abort();
      }, 30000);

      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log("📡 Response status:", response.status);
      
      // Kiểm tra nếu response có content trước khi parse JSON
      const contentType = response.headers.get("content-type");
      let data: LoginResponse;
      
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message, errors: data.errors });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response format from server (JSON parse failed)");
        }
      } else {
        console.error("❌ Invalid response content type:", contentType);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Register failed. Please try again.";
        console.error("❌ Register error:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data || typeof data.success === 'undefined') {
        console.error("❌ Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      if (!data.success) {
        const errorMsg = data.message || "Register failed";
        console.warn("⚠️ Register failed (success=false):", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ Register successful");
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("❌ CORS Error hoặc Network Error:", error);
        throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra internet hoặc thử lại sau.");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Vui lòng kiểm tra kết nối internet.");
    }
  },
};