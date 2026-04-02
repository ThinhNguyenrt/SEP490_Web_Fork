/**
 * User Profile API Service
 * Handles employee/talent profile operations
 */

export interface EmployeeProfile {
  id: number;
  userId: number;
  name: string;
  phone: string;
  coverImage?: string;
  avatar?: string;
}

const API_BASE_URL = import.meta.env.VITE_USER_PROFILE_API_BASE_URL || "/user-profile-api";

/**
 * Fetch current employee/talent profile information
 */
export const fetchEmployeeProfile = async (accessToken: string): Promise<EmployeeProfile> => {
  try {
    console.log("📡 [fetchEmployeeProfile] Starting...");
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Employee profile fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const fullUrl = `${API_BASE_URL}/Employee/me`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Employee profile API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON if possible
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Employee profile API response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Employee profile fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle response format (could be direct object or wrapped in data field)
    const dataAsObj = data as Record<string, unknown> | null;
    const profileData = (dataAsObj?.data as unknown) || data;

    if (!profileData || typeof profileData !== "object") {
      console.warn("⚠️ Unexpected response format for employee profile");
      console.warn("⚠️ data:", profileData);
      throw new Error("Invalid employee profile data format");
    }

    console.log("✅ Employee profile fetched successfully:", profileData);
    return profileData as EmployeeProfile;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [fetchEmployeeProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchEmployeeProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

/**
 * Update employee/talent profile information with file uploads
 */
export const updateEmployeeProfile = async (
  employeeId: number,
  accessToken: string,
  profileData: {
    name?: string;
    phone?: string;
    avatarFile?: File;
    coverImageFile?: File;
  },
): Promise<EmployeeProfile> => {
  try {
    console.log("📡 [updateEmployeeProfile] Starting...");
    console.log("📝 Employee ID:", employeeId);
    console.log("📝 Profile data to update:", { name: profileData.name, phone: profileData.phone });

    if (!employeeId) {
      console.error("❌ No employeeId provided!");
      throw new Error("Employee ID is missing.");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Employee profile update timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Use FormData for multipart file upload
    const formData = new FormData();
    
    if (profileData.name) {
      formData.append("name", profileData.name);
      console.log("📝 Added name to FormData:", profileData.name);
    }
    
    if (profileData.phone) {
      formData.append("phone", profileData.phone);
      console.log("📝 Added phone to FormData:", profileData.phone);
    }
    
    if (profileData.avatarFile) {
      formData.append("avatar", profileData.avatarFile);
      console.log("📝 Added avatar file to FormData:", profileData.avatarFile.name);
    }
    
    if (profileData.coverImageFile) {
      formData.append("coverImage", profileData.coverImageFile);
      console.log("📝 Added cover image file to FormData:", profileData.coverImageFile.name);
    }

    const fullUrl = `${API_BASE_URL}/Employee/${employeeId}`;
    console.log("📡 Making PUT request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: formData,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Employee profile update response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON if possible
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Employee profile update response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Employee profile update error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle response format
    const dataAsObj = data as Record<string, unknown> | null;
    const updatedProfileData = (dataAsObj?.data as unknown) || data;

    if (!updatedProfileData || typeof updatedProfileData !== "object") {
      console.warn("⚠️ Unexpected response format for updated employee profile");
      throw new Error("Invalid updated profile data format");
    }

    console.log("✅ Employee profile updated successfully:", updatedProfileData);
    return updatedProfileData as EmployeeProfile;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [updateEmployeeProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [updateEmployeeProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

export const profileService = {
  fetchEmployeeProfile,
  updateEmployeeProfile,
};
