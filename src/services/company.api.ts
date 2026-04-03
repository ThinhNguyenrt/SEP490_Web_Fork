import { CompanyPostAPI, CompanyPostsPaginatedResponse } from '@/types/companyPost';

/**
 * Company Posts API Service
 * Handles company job posts and recruitment operations
 */

// Determine API base URL - support multiple environments
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_COMPANY_API_BASE_URL;
  
  // If environment variable is set, use it
  if (envUrl && envUrl.trim() !== "") {
    console.log("✅ Using env var VITE_COMPANY_API_BASE_URL:", envUrl);
    return envUrl;
  }
  
  // Check if we're on localhost/development
  const isLocalhost = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  
  if (isLocalhost) {
    // On localhost, use relative path (proxy can be configured in vite.config.ts)
    console.log("📍 Localhost detected, using relative path: /api");
    return "/api";
  }
  
  // On production/deployed environment, use full URL
  const fallbackUrl = "https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io";
  console.log("🌐 Production/deployed environment detected, using full URL:", fallbackUrl);
  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch company job posts with pagination support
 * @param cursor - Optional cursor for pagination (ISO date string)
 * @param limit - Number of posts to fetch (default: 10)
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPosts = async (
  cursor?: string,
  limit: number = 10,
  accessToken?: string
): Promise<CompanyPostsPaginatedResponse> => {
  try {
    console.log("📡 [fetchCompanyPosts] Starting with cursor:", cursor, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company posts fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    if (cursor) {
      params.append("cursor", cursor);
    }
    params.append("limit", limit.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Fixed URL - API_BASE_URL already includes /api
    const fullUrl = `${API_BASE_URL}/company-posts?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company posts API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ Invalid response content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMsg = (data as any)?.message || "Failed to fetch company posts";
      console.error("❌ Fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Validate response structure - should have items, nextCursor, hasMore
    if (!data || typeof data !== "object" || !Array.isArray((data as any)?.items)) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log("✅ Company posts fetched successfully:", (data as any)?.items?.length || 0, "posts");
    return data as CompanyPostsPaginatedResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Fetch a single company job post by ID
 * @param postId - The ID of the company post to fetch
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPostDetail = async (
  postId: number,
  accessToken?: string
): Promise<CompanyPostAPI> => {
  try {
    console.log("📡 [fetchCompanyPostDetail] Starting for postId:", postId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company post detail fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = `${API_BASE_URL}/company-posts/${postId}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company post detail API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error((data as any)?.message || "Failed to fetch company post detail");
    }

    console.log("✅ Company post detail fetched successfully");
    return data as CompanyPostAPI;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
};

/**
 * Save a company job post
 * @param postId - The ID of the company post to save
 * @param accessToken - Optional access token for authenticated requests
 */
export const saveCompanyPost = async (
  postId: number,
  accessToken?: string
): Promise<{ message: string }> => {
  try {
    console.log("📡 [saveCompanyPost] Starting for postId:", postId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Save post timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = `${API_BASE_URL}/company-posts/${postId}/save`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Save post API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error((data as any)?.message || "Failed to save post");
    }

    console.log("✅ Post saved successfully");
    return data as { message: string };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
};
