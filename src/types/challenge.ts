export interface Challenge {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  reward?: string;
  status: "active" | "inactive" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeSubmission {
  id: number;
  challengeId: number;
  userId: number;
  fileUrl: string;
  fileName: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
}

export interface CreateChallengePayload {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  reward?: string;
}

export interface UpdateChallengePayload extends CreateChallengePayload {
  id: number;
}

export interface ChallengePaginatedResponse {
  data: Challenge[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}
