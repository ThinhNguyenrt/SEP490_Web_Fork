/**
 * API Configuration
 * Centralized API endpoints and base URLs for all services
 * 
 * Features:
 * - Support for both development (localhost with proxy) and production
 * - Automatic detection of environment
 * - Type-safe API configuration
 * - Easy maintenance and updates
 */

/**
 * Determine if running in development/localhost
 */
const isDevelopment = (): boolean => {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost:5173" ||
      window.location.hostname === "localhost:5174")
  );
};

/**
 * Get API base URL from environment or fallback
 */
const getBaseUrl = (
  envVarName: string,
  fallbackUrl: string,
  developmentPath?: string
): string => {
  const envUrl = import.meta.env[envVarName as keyof ImportMetaEnv];

  // If env var is set and not empty, use it
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    console.log(`✅ Using env var ${envVarName}:`, envUrl);
    return envUrl;
  }

  // On localhost/development, use relative path if provided
  if (isDevelopment() && developmentPath) {
    console.log(`📍 Development mode: using relative path ${developmentPath}`);
    return developmentPath;
  }

  // Otherwise use fallback (production URL)
  console.log(`🌐 Using fallback URL:`, fallbackUrl);
  return fallbackUrl;
};

/**
 * API Base URLs - Services
 */
export const API_BASE_URLS = {
  // Main API Gateway - Authentication and general APIs
  gateway: getBaseUrl(
    "VITE_API_BASE_URL",
    "https://api-gateway.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/api"
  ),

  // User Profile Service - Talent and company profiles
  userProfile: getBaseUrl(
    "VITE_USER_PROFILE_API_BASE_URL",
    "https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/user-profile-api"
  ),

  // Company Service - Job posts
  company: getBaseUrl(
    "VITE_COMPANY_API_BASE_URL",
    "https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/api"
  ),

  // Application Service - Job applications
  application: getBaseUrl(
    "VITE_APPLICATION_API_BASE_URL",
    "https://application-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/api"
  ),

  // Connection Service - Talent-Recruiter connections
  connection: getBaseUrl(
    "VITE_CONNECTION_API_BASE_URL",
    "https://connection-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/api"
  ),

  // Portfolio Service - Portfolio and rankings
  portfolio: getBaseUrl(
    "VITE_PORTFOLIO_API_BASE_URL",
    "https://portfolio-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api",
    "/api"
  ),
} as const;

/**
 * API Endpoints - Organization by service
 */
export const API_ENDPOINTS = {
  // Authentication Endpoints
  auth: {
    login: "/Auth/login",
    register: "/Auth/register",
    refreshToken: "/Auth/refresh-token",
    logout: "/Auth/logout",
  },

  // Application Endpoints
  application: {
    list: "/applications",
    myApplications: "/applications/me",
    companyApplications: "/applications/company",
    create: "/applications",
    detail: (id: number) => `/applications/${id}`,
    updateStatus: (id: number) => `/applications/${id}/status`,
  },

  // Company/Job Post Endpoints
  company: {
    posts: "/company-posts",
    myPosts: "/company-posts/company",
    detail: (id: number) => `/company-posts/${id}`,
    save: (id: number) => `/company-posts/${id}/save`,
    unsave: (id: number) => `/company-posts/${id}/unsave`,
    create: "/company-posts",
    update: (id: number) => `/company-posts/${id}`,
    delete: (id: number) => `/company-posts/${id}`,
    profile: "/company-profile",
  },

  // Connection Endpoints
  connection: {
    create: "/Connection",
    list: "/connections",
    detail: (id: number) => `/connections/${id}`,
    update: (id: number) => `/connections/${id}`,
    delete: (id: number) => `/connections/${id}`,
  },

  // Portfolio Endpoints
  portfolio: {
    list: "/portfolio",
    detail: (id: number) => `/portfolio/${id}`,
    ranking: (id: number) => `/portfolio/${id}/ranking`,
    create: "/portfolio",
    update: (id: number) => `/portfolio/${id}`,
    follows: "/follows",
  },

  // User Profile Endpoints
  profile: {
    me: "/profile",
    update: "/profile/update",
    getById: (id: number) => `/profile/${id}`,
  },

  // Compliment/Review Endpoints
  compliment: {
    submit: "/compliment",
    list: (portfolioId: number) => `/compliment/${portfolioId}`,
  },
} as const;

/**
 * Helper function to build full API URL
 * Usage: buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.login)
 */
export const buildApiUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl}${endpoint}`;
};

/**
 * Helper function to construct URL with path parameters
 * Usage: buildUrlWithParams("/users/:id", { id: 123 })
 * Result: "/users/123"
 */
export const buildUrlWithParams = (
  pattern: string,
  params: Record<string, string | number>
): string => {
  let url = pattern;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export default {
  API_BASE_URLS,
  API_ENDPOINTS,
  buildApiUrl,
  buildUrlWithParams,
};
