/**
 * Compliment/Review API Service
 * Handles portfolio review and rating operations for recruiters
 * 
 * Uses centralized configuration from @/config/apiConfig
 */
import { API_BASE_URLS, buildApiUrl } from "@/config/apiConfig";

export interface ComplimentRequest {
  portfolioId: number;
  content: string;
  score: number; // 1-10
}

export interface ComplimentResponse {
  id: number;
  portfolioId: number;
  companyId: number;
  content: string;
  score: number;
  state: number;
  createdAt: string;
  updatedAt: string | null;
}

// API configuration imported from centralized config

/**
 * Submit a compliment/review for a portfolio
 */
export const submitCompliment = async (compliment: ComplimentRequest, accessToken: string): Promise<ComplimentResponse> => {
  try {
    if (!accessToken) {
      const errorMsg = "Access token is missing. Please login again.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, "/compliments"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(compliment),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data: ComplimentResponse = await response.json();
    console.log("✅ Compliment submitted successfully:", data);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to submit compliment";
    console.error("❌ Error submitting compliment:", errorMsg);
    throw error;
  }
};

/**
 * Get compliment/review for a specific portfolio
 */
export const getMyCompliment = async (portfolioId: number, accessToken: string): Promise<ComplimentResponse | ComplimentResponse[]> => {
  try {
    if (!accessToken) {
      const errorMsg = "Access token is missing. Please login again.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, `/compliments/${portfolioId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No compliment found - this is not an error
        return null as any;
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Compliment retrieved successfully:", data);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to retrieve compliment";
    console.error("❌ Error retrieving compliment:", errorMsg);
    throw error;
  }
};

/**
 * Get all compliments submitted by the current recruiter/company
 */
export const getMyCompliments = async (accessToken: string): Promise<ComplimentResponse[]> => {
  try {
    if (!accessToken) {
      const errorMsg = "Access token is missing. Please login again.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, "/compliments"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No compliments found - this is not an error
        return [];
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data: ComplimentResponse[] = await response.json();
    console.log("✅ Compliments retrieved successfully:", data.length, "compliments");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to retrieve compliments";
    console.error("❌ Error retrieving compliments:", errorMsg);
    throw error;
  }
};

/**
 * Get compliment/review for a specific portfolio by recruiterId
 */
export const getComplimentByPortfolioId = async (portfolioId: number, accessToken: string): Promise<ComplimentResponse | null> => {
  try {
    if (!accessToken) {
      const errorMsg = "Access token is missing. Please login again.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("📡 Fetching compliment for portfolioId:", portfolioId);
    const url = buildApiUrl(API_BASE_URLS.gateway, `/compliments?portfolioId=${portfolioId}`);
    console.log("📍 URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("📊 Response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        // No compliment found - this is not an error
        console.log("ℹ️ No compliment found for portfolio:", portfolioId);
        return null;
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Compliment retrieved successfully:", data);
    
    // Backend returns array, get first item
    if (Array.isArray(data) && data.length > 0) {
      console.log("📦 Data is array, getting first item:", data[0]);
      return data[0] as ComplimentResponse;
    }
    
    // If data is already an object, return it
    if (data && typeof data === 'object') {
      return data as ComplimentResponse;
    }
    
    console.log("⚠️ Unexpected data format");
    return null;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to retrieve compliment";
    console.error("❌ Error retrieving compliment:", errorMsg);
    // Don't throw - return null to allow modal to show empty form
    return null;
  }
};

/**
 * Update an existing compliment/review (PUT method)
 */
export const updateComplimentPut = async (
  id: number,
  updates: { content: string; score: number },
  accessToken: string
): Promise<ComplimentResponse> => {
  try {
    if (!accessToken) {
      const errorMsg = "Access token is missing. Please login again.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, `/compliments/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data: ComplimentResponse = await response.json();
    console.log("✅ Compliment updated successfully:", data);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update compliment";
    console.error("❌ Error updating compliment:", errorMsg);
    throw error;
  }
};

export const complimentService = {
  submitCompliment,
  getMyCompliment,
  getMyCompliments,
  getComplimentByPortfolioId,
  updateCompliment: updateComplimentPut,
  updateComplimentPut,
};
