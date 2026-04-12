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
 * Map application status to Vietnamese text and styling
 */
export const getApplicationStatusInfo = (status: Application['status']): {
  text: string;
  code: number;
  description: string;
} => {
  const statusMap: Record<string, { text: string; code: number; description: string }> = {
    WAITING: {
      text: "Đơn mới, chờ xử lý",
      code: 0,
      description: "Ứng tuyển thành công, chờ nhà tuyển dụng xem xét",
    },
    REVIEWING: {
      text: "Đang xem xét",
      code: 1,
      description: "Nhà tuyển dụng đang xem xét hồ sơ của bạn",
    },
    ACCEPTED: {
      text: "Đã chấp nhận",
      code: 2,
      description: "Bạn đã được chấp nhận, chờ liên lạc từ nhà tuyển dụng",
    },
    REJECTED: {
      text: "Đã từ chối",
      code: 3,
      description: "Hồ sơ của bạn không được chọn lần này",
    },
  };
  return statusMap[status] || statusMap.WAITING;
};

/**
 * Get CSS classes for status badge
 */
export const getApplicationStatusStyles = (status: Application['status']): string => {
  const styles: Record<string, string> = {
    WAITING: "bg-amber-100 text-amber-700 border border-amber-200",
    REVIEWING: "bg-blue-100 text-blue-700 border border-blue-200",
    ACCEPTED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    REJECTED: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return styles[status] || styles.WAITING;
};

/**
 * Create a new job application
 * @param companyPostId - ID of the company job post
 * @param portfolioId - ID of the portfolio to submit
 * @param accessToken - Access token for authentication
 */
export const createApplication = async (
  companyPostId: number,
  portfolioId: number,
  accessToken?: string
): Promise<Application> => {
  try {
    console.log("📡 [createApplication] Starting with companyPostId:", companyPostId, "portfolioId:", portfolioId);

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
      companyPostId,
      portfolioId,
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
 * Get user's applications with pagination
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param accessToken - Access token for authentication
 */
export const getMyApplications = async (
  page: number = 1,
  pageSize: number = 10,
  accessToken?: string
): Promise<{
  items: Application[],
  total: number,
  page: number,
  pageSize: number,
}> => {
  try {
    console.log("📡 [getMyApplications] Starting with page:", page, "pageSize:", pageSize);

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

    // Build query params
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const fullUrl = `${API_BASE_URL}/applications/me?${params.toString()}`;
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

    // Validate response structure
    const responseData = data as Record<string, unknown>;
    if (!Array.isArray(responseData.items)) {
      throw new Error("Invalid response format: items array not found");
    }

    console.log("✅ Applications fetched successfully:", responseData.items?.length || 0, "items");
    return {
      items: responseData.items as Application[],
      total: typeof responseData.total === 'number' ? responseData.total : 0,
      page: typeof responseData.page === 'number' ? responseData.page : 1,
      pageSize: typeof responseData.pageSize === 'number' ? responseData.pageSize : 10,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to get applications";
    console.error("❌ [getMyApplications] Error:", errorMessage);
    throw err;
  }
};

/**
 * Get company's received applications with pagination
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param accessToken - Access token for authentication
 */
export const getCompanyApplications = async (
  page: number = 1,
  pageSize: number = 10,
  accessToken?: string
): Promise<{
  items: Application[],
  total: number,
  page: number,
  pageSize: number,
}> => {
  try {
    console.log("📡 [getCompanyApplications] Starting with page:", page, "pageSize:", pageSize);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Get company applications timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Build query params
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const fullUrl = `${API_BASE_URL}/applications/company?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Get company applications API response status:", response.status);

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

    // Validate response structure
    const responseData = data as Record<string, unknown>;
    if (!Array.isArray(responseData.items)) {
      throw new Error("Invalid response format: items array not found");
    }

    console.log("✅ Company applications fetched successfully:", responseData.items?.length || 0, "items");
    
    // Debug: Log detailed structure of first item
    if (responseData.items && Array.isArray(responseData.items) && responseData.items.length > 0) {
      console.log("📊 First application item structure:", {
        applicationId: (responseData.items[0] as Record<string, unknown>).applicationId,
        status: (responseData.items[0] as Record<string, unknown>).status,
        appliedAt: (responseData.items[0] as Record<string, unknown>).appliedAt,
        post: (responseData.items[0] as Record<string, unknown>).post,
        company: (responseData.items[0] as Record<string, unknown>).company,
        fullItem: responseData.items[0],
      });
    }
    
    return {
      items: responseData.items as Application[],
      total: typeof responseData.total === 'number' ? responseData.total : 0,
      page: typeof responseData.page === 'number' ? responseData.page : 1,
      pageSize: typeof responseData.pageSize === 'number' ? responseData.pageSize : 10,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to get company applications";
    console.error("❌ [getCompanyApplications] Error:", errorMessage);
    throw err;
  }
};

/**
 * Get single application detail by ID
 * @param applicationId - ID of the application
 * @param accessToken - Access token for authentication
 */
export const getApplicationDetail = async (
  applicationId: number,
  accessToken?: string
): Promise<Application> => {
  try {
    console.log("📡 [getApplicationDetail] Fetching detail for application:", applicationId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Get application detail timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = `${API_BASE_URL}/applications/${applicationId}`;
    console.log("📡 [getApplicationDetail] Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [getApplicationDetail] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 [getApplicationDetail] Response data:", data);
      } catch (parseError) {
        console.error("❌ [getApplicationDetail] JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMessage = typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : `HTTP ${response.status}`;
      console.error("❌ [getApplicationDetail] API error:", errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ [getApplicationDetail] Application detail fetched successfully");
    return data as Application;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to get application detail";
    console.error("❌ [getApplicationDetail] Error:", errorMessage);
    throw err;
  }
};

/**
 * Update application status
 * @param applicationId - ID of the application to update
 * @param statusCode - Status code (1=REVIEWING, 2=ACCEPTED, 3=REJECTED)
 * @param accessToken - Access token for authentication
 */
export const updateApplicationStatus = async (
  applicationId: number,
  statusCode: number,
  accessToken?: string
): Promise<Application> => {
  try {
    console.log("📡 [updateApplicationStatus] Starting with applicationId:", applicationId, "statusCode:", statusCode);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Update application status timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("📡 [updateApplicationStatus] Authorization header added");
    }

    const fullUrl = `${API_BASE_URL}/applications/${applicationId}/status`;
    console.log("📡 [updateApplicationStatus] Making request to:", fullUrl);
    console.log("📡 [updateApplicationStatus] Request body:", { status: statusCode });

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ status: statusCode }),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [updateApplicationStatus] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 [updateApplicationStatus] Response data:", data);
      } catch (parseError) {
        console.error("❌ [updateApplicationStatus] JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMessage = typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : `HTTP ${response.status}`;
      console.error("❌ [updateApplicationStatus] API error:", errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ [updateApplicationStatus] Status updated successfully");
    return data as Application;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update application status";
    console.error("❌ [updateApplicationStatus] Error:", errorMessage);
    throw err;
  }
};
