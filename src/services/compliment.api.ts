/**
 * Compliment/Review API Service
 * Handles portfolio review and rating operations for recruiters
 */

export interface ComplimentRequest {
  portfolioId: number;
  content: string;
  score: number; // 1-5
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

// Determine API base URL
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl && envUrl.trim() !== "") {
    console.log("✅ Using env var VITE_API_BASE_URL:", envUrl);
    return envUrl;
  }
  
  const isLocalhost = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  
  if (isLocalhost) {
    console.log("📍 Localhost detected, using relative path: /api");
    return "/api";
  }
  
  const fallbackUrl = "https://api.example.com/api";
  console.log("🌐 Production environment detected, using full URL:", fallbackUrl);
  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Submit a compliment/review for a portfolio
 */
export const submitCompliment = async (compliment: ComplimentRequest): Promise<ComplimentResponse> => {
  try {
    const token = localStorage.getItem("access_token");
    
    const response = await fetch(`${API_BASE_URL}/compliments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

export const complimentService = {
  submitCompliment,
};
