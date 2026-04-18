export interface FollowCategory {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string | null;
  portfolioCount?: number;
}

export interface FollowCategoryResponse {
  items: FollowCategory[];
}
