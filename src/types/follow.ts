export interface Follow {
  portfolioId: number;
  employeeId: number;
  portfolioName: string;
  status: string;
  interestLevel: "low" | "medium" | "high";
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  followedAt: string;
  lastPortfolioUpdateAt: string;
  isUpdatedSinceFollow: boolean;
  preview: {
    blockId: number;
    type: string;
    variant: string;
    data: {
      avatar?: string;
      name?: string;
      studyField?: string;
      description?: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface FollowRequest {
  portfolioId: number;
  interestLevel: string;
  categoryId: number;
}
