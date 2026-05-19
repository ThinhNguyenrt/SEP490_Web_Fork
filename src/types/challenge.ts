export interface ChallengeVersion {
  id: string;
  versionNumber: number;
  difficultyScore: number;
  difficultyLabel: "Easy" | "Medium" | "Hard";
  skillWeights?: Record<string, number>;
  criteria: ChallengeCriteria[];
  createdAt: string;
}

export interface ChallengeCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  displayOrder: number;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  expectedSolution?: string;
  status?: "Draft" | "Published" | "Closed" | "Archived";
  createdAt: string;
  createdById?: number;
  reviewedById?: number | null;
  deadline: string;
  publishedAt?: string | null;
  currentVersionId?: string | null;
  updatedAt?: string;
  difficultyScore?: number;
  difficultyLabel?: "Easy" | "Medium" | "Hard";
  activeVersion?: ChallengeVersion;
  startDate?: string;
  endDate?: string;
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
  expectedSolution?: string;
  deadline: string; // ISO 8601 format
}

export interface UpdateChallengePayload extends CreateChallengePayload {
  id: string;
}

export interface CreatorChallengesResponse {
  items: Challenge[];
  totalCount: number;
  skip: number;
  take: number;
}

export interface ChallengePaginatedResponse {
  data: Challenge[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}
