import { Application, CreateApplicationRequest } from '@/types/application';

/**
 * Application Service API
 * Handles job application operations
 */

// Determine API base URL for application service
const getApiBaseUrl = (): string => {
  // On development (localhost with Vite proxy), use relative path
  // The proxy in vite.config.ts will handle routing to the application service
  const isLocalhost = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  
  if (isLocalhost) {
    console.log("📍 Localhost detected, using relative path: /api (proxied to application-service)");
    return "/api";
  }
  
  // On production/deployed environment, use full URL
  const fallbackUrl = "https://application-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api";
  console.log("🌐 Production/deployed environment detected, using full URL:", fallbackUrl);
  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Create a new job application
 * @param postId - ID of the job post
 * @param portfolioId - ID of the portfolio to submit
 * @param companyId - ID of the company
 * @param accessToken - Access token for authentication
 */
export const createApplication = async (
  postId: number,
  portfolioId: number,
  companyId: number,
  accessToken?: string
): Promise<Application> => {
  try {
    console.log("📡 [createApplication] Starting with postId:", postId, "portfolioId:", portfolioId, "companyId:", companyId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Create application timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const payload: CreateApplicationRequest = {
      postId,
      portfolioId,
      companyId,
    };

    const fullUrl = `${API_BASE_URL}/applications`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Create application API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMessage = typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as Application;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create application";
    console.error("❌ [createApplication] Error:", errorMessage);
    throw err;
  }
};

/**
 * Get user's applications
 * @param accessToken - Access token for authentication
 */
export const getMyApplications = async (
  accessToken?: string
): Promise<Application[]> => {
  try {
    console.log("📡 [getMyApplications] Starting");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Get applications timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = `${API_BASE_URL}/applications/me`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Get applications API response status:", response.status);

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
      const errorMessage = typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as Application[];
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to get applications";
    console.error("❌ [getMyApplications] Error:", errorMessage);
    throw err;
  }
};
