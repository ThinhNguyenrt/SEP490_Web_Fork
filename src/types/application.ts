/**
 * Application Status enum - Maps to status codes from API
 * 0 = WAITING, 1 = REVIEWING, 2 = ACCEPTED, 3 = REJECTED
 */
export type ApplicationStatus = "WAITING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

/**
 * Application response from API
 */
export interface Application {
  applicationId: number;
  status: ApplicationStatus;
  appliedAt: string;
  portfolioId?: number;
  roomId?: number | null;
  post: {
    postId: number;
    position: string;
    salary: string;
    address: string;
    media: Array<{
      type: string;
      url: string;
    }>;
  };
  company?: {
    companyId: number;
    companyName: string;
    logo: string;
  };
  candidate?: {
    userId: number;
    name: string;
    avatar?: string;
  };
  recruiter?: {
    userId: number;
    companyId?: number;
    name?: string;
    avatar?: string;
  };
}

/**
 * Paginated applications response from API
 */
export interface PaginatedApplicationsResponse {
  items: Application[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Create application request payload
 */
export interface CreateApplicationRequest {
  companyPostId: number;
  portfolioId: number;
}

/**
 * Portfolio item for selection
 */
export interface PortfolioItem {
  portfolioId: number;
  portfolioName: string;
  category: string | null;
  createdAt: string;
  blocksCount?: number;
}
