import { FollowCategory } from "@/types/followCategory";
import { API_BASE_URLS, buildApiUrl } from "@/config/apiConfig";

/**
 * Follow Categories API Service
 * Handles follow categories operations
 */

export const followCategoryService = {
  /**
   * Create a new follow category
   */
  createFollowCategory: async (
    name: string,
    accessToken: string
  ): Promise<FollowCategory> => {
    try {
      console.log("📡 [createFollowCategory] Creating category:", name);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const url = buildApiUrl(API_BASE_URLS.portfolio, "/follow-categories");

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create follow category: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Follow category created:", result);
      return result;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi tạo danh sách theo dõi";
      console.error("❌ Error creating follow category:", errorMsg);
      throw error;
    }
  },

  /**
   * Fetch all follow categories
   */
  fetchFollowCategories: async (accessToken: string): Promise<FollowCategory[]> => {
    try {
      console.log("📡 [fetchFollowCategories] Starting...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Follow categories fetch timeout after 30 seconds");
        controller.abort();
      }, 30000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const url = buildApiUrl(API_BASE_URLS.portfolio, "/follow-categories");
      console.log("📡 Making request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch follow categories: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Follow categories:", data);
      return Array.isArray(data) ? data : data.items || [];
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi tải danh sách theo dõi";
      console.error("❌ Error fetching follow categories:", errorMsg);
      throw error;
    }
  },

  /**
   * Update a follow category
   */
  updateFollowCategory: async (
    id: number,
    data: Partial<FollowCategory>,
    accessToken: string
  ): Promise<FollowCategory> => {
    try {
      console.log("📡 [updateFollowCategory] Updating category:", id);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const url = buildApiUrl(API_BASE_URLS.portfolio, `/follow-categories/${id}`);

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update follow category: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Follow category updated:", result);
      return result;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi cập nhật danh sách theo dõi";
      console.error("❌ Error updating follow category:", errorMsg);
      throw error;
    }
  },

  /**
   * Delete a follow category
   */
  deleteFollowCategory: async (
    id: number,
    accessToken: string
  ): Promise<void> => {
    try {
      console.log("📡 [deleteFollowCategory] Deleting category:", id);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const url = buildApiUrl(API_BASE_URLS.portfolio, `/follow-categories/${id}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete follow category: ${response.status}`);
      }

      console.log("✅ Follow category deleted successfully");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xóa danh sách theo dõi";
      console.error("❌ Error deleting follow category:", errorMsg);
      throw error;
    }
  },
};
