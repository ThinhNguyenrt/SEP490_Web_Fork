import { UserNotification } from '@/types/notification';
import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from '@/config/apiConfig';

/**
 * Notification API Service
 * Handles system notifications and community notifications
 * 
 * Uses centralized configuration from @/config/apiConfig
 * Supports both development and production environments
 */

/**
 * Response type for system notifications API
 */
interface SystemNotificationsResponse {
  items: UserNotification[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Fetch community notifications with pagination support
 * @param cursor - Optional cursor for pagination
 * @param limit - Number of notifications to fetch (default: 10)
 * @param accessToken - Access token for authenticated requests
 */
export const fetchCommunityNotifications = async (
  cursor?: string | null,
  limit: number = 10,
  accessToken?: string
): Promise<SystemNotificationsResponse> => {
  try {
    console.log("📡 [fetchCommunityNotifications] Starting with cursor:", cursor, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Community notifications fetch timeout after 30 seconds");
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

    // Use centralized config
    const fullUrl = buildApiUrl(API_BASE_URLS.notification, "/notifications/community") + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Community notifications API response status:", response.status);

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
      const errorMsg = ((data as Record<string, unknown>)?.message as string) || "Failed to fetch community notifications";
      console.error(`❌ API Error: ${response.status} - ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Type-safe response validation
    const typedData = data as SystemNotificationsResponse;
    if (!typedData.items || !Array.isArray(typedData.items)) {
      console.error("❌ Invalid API response structure - missing items array");
      throw new Error("Invalid API response structure");
    }

    return typedData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("❌ Request timeout");
        throw new Error("Request timeout - please try again");
      }
      console.error("❌ [fetchCommunityNotifications] Error:", error.message);
      throw error;
    }

    console.error("❌ [fetchCommunityNotifications] Unknown error:", error);
    throw new Error("Failed to fetch community notifications");
  }
};

/**
 * Fetch system notifications with pagination support
 * @param cursor - Optional cursor for pagination
 * @param limit - Number of notifications to fetch (default: 10)
 * @param accessToken - Access token for authenticated requests
 */
export const fetchSystemNotifications = async (
  cursor?: string | null,
  limit: number = 10,
  accessToken?: string
): Promise<SystemNotificationsResponse> => {
  try {
    console.log("📡 [fetchSystemNotifications] Starting with cursor:", cursor, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ System notifications fetch timeout after 30 seconds");
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

    // Use centralized config
    const fullUrl = buildApiUrl(API_BASE_URLS.notification, API_ENDPOINTS.notification.system) + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 System notifications API response status:", response.status);

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
      const errorMsg = ((data as Record<string, unknown>)?.message as string) || "Failed to fetch system notifications";
      console.error(`❌ API Error: ${response.status} - ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Type-safe response validation
    const typedData = data as SystemNotificationsResponse;
    if (!typedData.items || !Array.isArray(typedData.items)) {
      console.error("❌ Invalid API response structure - missing items array");
      throw new Error("Invalid API response structure");
    }

    return typedData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("❌ Request timeout");
        throw new Error("Request timeout - please try again");
      }
      console.error("❌ [fetchSystemNotifications] Error:", error.message);
      throw error;
    }

    console.error("❌ [fetchSystemNotifications] Unknown error:", error);
    throw new Error("Failed to fetch system notifications");
  }
};

/**
 * Fetch all notifications (including community notifications)
 * @param cursor - Optional cursor for pagination
 * @param limit - Number of notifications to fetch (default: 5)
 * @param accessToken - Access token for authenticated requests
 */
export const fetchNotifications = async (
  cursor?: number,
  limit: number = 5,
  accessToken?: string
): Promise<SystemNotificationsResponse> => {
  try {
    console.log("📡 [fetchNotifications] Starting with cursor:", cursor, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Notifications fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    if (cursor) {
      params.append("cursor", cursor.toString());
    }
    params.append("limit", limit.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Use centralized config
    const fullUrl = buildApiUrl(API_BASE_URLS.notification, API_ENDPOINTS.notification.list) + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Notifications API response status:", response.status);

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
      const errorMsg = ((data as Record<string, unknown>)?.message as string) || "Failed to fetch notifications";
      console.error(`❌ API Error: ${response.status} - ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return data as SystemNotificationsResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("❌ Request timeout");
        throw new Error("Request timeout - please try again");
      }
      console.error("❌ [fetchNotifications] Error:", error.message);
      throw error;
    }

    console.error("❌ [fetchNotifications] Unknown error:", error);
    throw new Error("Failed to fetch notifications");
  }
};

/**
 * Get unread notification count
 * @param accessToken - Access token for authenticated requests
 */
export const fetchUnreadCount = async (accessToken?: string): Promise<number> => {
  try {
    console.log("📡 [fetchUnreadCount] Starting");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.notification, API_ENDPOINTS.notification.unreadCount);
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      credentials: "include",
    });

    console.log("📡 Unread count API response status:", response.status);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      throw new Error("Failed to fetch unread count");
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("❌ [fetchUnreadCount] Error:", error);
    throw error;
  }
};

/**
 * Mark a single notification as read
 * @param id - Notification ID
 * @param accessToken - Access token for authenticated requests
 */
export const markNotificationAsRead = async (
  id: number,
  accessToken?: string
): Promise<void> => {
  try {
    console.log("📡 [markNotificationAsRead] Marking notification", id, "as read");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.notification, API_ENDPOINTS.notification.markAsRead(id));
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      credentials: "include",
    });

    console.log("📡 Mark as read API response status:", response.status);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      throw new Error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("❌ [markNotificationAsRead] Error:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @param accessToken - Access token for authenticated requests
 */
export const markAllNotificationsAsRead = async (accessToken?: string): Promise<void> => {
  try {
    console.log("📡 [markAllNotificationsAsRead] Marking all notifications as read");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.notification, API_ENDPOINTS.notification.markAllAsRead);
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      credentials: "include",
    });

    console.log("📡 Mark all as read API response status:", response.status);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status}`);
      throw new Error("Failed to mark all notifications as read");
    }
  } catch (error) {
    console.error("❌ [markAllNotificationsAsRead] Error:", error);
    throw error;
  }
};
