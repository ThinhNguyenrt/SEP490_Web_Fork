/**
 * Application Status enum
 */
export type ApplicationStatus = "WAITING" | "APPROVED" | "REJECTED";

/**
 * Application response from API
 */
export interface Application {
  applicationId: number;
  status: ApplicationStatus;
  appliedAt: string;
  post: {
    postId: number;
    position: string;
    salary: string;
    address: string;
    media: string;
  };
  company: {
    companyId: number;
    companyName: string;
    logo: string;
  };
}

/**
 * Create application request payload
 */
export interface CreateApplicationRequest {
  postId: number;
  portfolioId: number;
  companyId: number;
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
