import { CompanyPostsPaginatedResponse, CompanyPostDetail } from '@/types/companyPost';

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
  
  // On production/deployed environment, use full URL with /api suffix
  const fallbackUrl = "https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api";
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
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to fetch company posts";
      console.error("❌ Fetch error:", errorMsg);
      throw new Error(String(errorMsg));
    }

    // Validate response structure - should have items, nextCursor, hasMore
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).items)
    ) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log(
      "✅ Company posts fetched successfully:",
      ((data as Record<string, unknown>).items as unknown[])?.length || 0,
      "posts"
    );
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
 * Fetch company job posts filtered by company ID with pagination support
 * Used by recruiters to view their own company's job posts
 * @param companyId - The ID of the company
 * @param cursor - Optional cursor for pagination (ISO date string)
 * @param limit - Number of posts to fetch (default: 10)
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPostsByCompanyId = async (
  companyId: number,
  cursor?: string,
  limit: number = 10,
  accessToken?: string
): Promise<CompanyPostsPaginatedResponse> => {
  try {
    console.log("📡 [fetchCompanyPostsByCompanyId] Starting for companyId:", companyId, "cursor:", cursor, "limit:", limit);

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

    // API endpoint: GET /api/company-posts/company/{companyId}
    const fullUrl = `${API_BASE_URL}/company-posts/company/${companyId}?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company posts (by company) API response status:", response.status);

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
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to fetch company posts";
      console.error("❌ Fetch error:", errorMsg);
      throw new Error(String(errorMsg));
    }

    // Validate response structure - should have items, nextCursor, hasMore
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).items)
    ) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log(
      "✅ Company posts (by company) fetched successfully:",
      ((data as Record<string, unknown>).items as unknown[])?.length || 0,
      "posts"
    );
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
): Promise<CompanyPostDetail> => {
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
      throw new Error((data as Record<string, unknown>)?.message as string || "Failed to fetch company post detail");
    }

    console.log("✅ Company post detail fetched successfully");
    return data as CompanyPostDetail;
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
    console.log("📡 [saveCompanyPost] accessToken provided:", !!accessToken);

    if (!accessToken) {
      console.warn("⚠️ [saveCompanyPost] No accessToken provided - API may reject request");
    }

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
      console.log("📡 [saveCompanyPost] Authorization header added");
    }

    const fullUrl = `${API_BASE_URL}/company-posts/${postId}/save`;
    console.log("📡 [saveCompanyPost] Making request to:", fullUrl);
    console.log("📡 [saveCompanyPost] Headers:", { "Content-Type": headers["Content-Type"], hasAuth: !!headers["Authorization"] });

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),  // Send empty body to be explicit
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [saveCompanyPost] Response status:", response.status);
    console.log("📡 [saveCompanyPost] Response statusText:", response.statusText);
    console.log("📡 [saveCompanyPost] Response OK:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 [saveCompanyPost] Content-Type:", contentType);

    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📡 [saveCompanyPost] Parsed response data:", data);
      } catch (parseError) {
        console.error("❌ [saveCompanyPost] JSON parse error:", parseError);
        console.error("❌ [saveCompanyPost] Response status:", response.status);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ [saveCompanyPost] Non-JSON response, content-type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    // Check response status
    if (!response.ok) {
      const errorMessage = (data as Record<string, unknown>)?.message as string || "Failed to save post";
      console.error("❌ [saveCompanyPost] API returned error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ [saveCompanyPost] Post saved successfully");
    return data as { message: string };
  } catch (error) {
    console.error("❌ [saveCompanyPost] Caught error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while saving post");
  }
};

/**
 * Create a new company job post
 * @param postData - Post data containing position, salary, description, etc
 * @param files - Array of media files (images/videos)
 * @param accessToken - Optional access token for authenticated requests
 */
export const createCompanyPost = async (
  postData: {
    position: string;
    address: string;
    salary: string;
    employmentType: string;
    experienceYear?: number;
    quantity?: number;
    jobDescription: string;
    requirementsMandatory: string;
    requirementsPreferred: string;
    benefits: string;
  },
  files: File[],
  accessToken?: string
): Promise<{ postId: number; message: string }> => {
  try {
    console.log("📡 [createCompanyPost] Starting with data:", postData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Create post timeout after 60 seconds");
      controller.abort();
    }, 60000);

    const headers: Record<string, string> = {};

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Build FormData for multipart/form-data request
    const formData = new FormData();

    // Add post data as JSON string
    formData.append("postJson", JSON.stringify(postData));

    // Add files
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const fullUrl = `${API_BASE_URL}/company-posts`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: formData,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Create post API response status:", response.status);

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
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to create company post";
      console.error("❌ Create post error:", errorMsg);
      throw new Error(errorMsg as string);
    }

    console.log("✅ Company post created successfully:", (data as Record<string, unknown>)?.postId);
    return data as { postId: number; message: string };
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
