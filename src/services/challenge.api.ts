import { Challenge, ChallengePaginatedResponse, CreateChallengePayload, CreatorChallengesResponse } from '@/types/challenge';
import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from '@/config/apiConfig';

/**
 * Challenge API Service
 * Handles challenge operations for company users
 * Uses real API calls to the Challenge Service
 */

/**
 * Build authorization header with Bearer token
 */
const getAuthHeader = (accessToken: string) => ({
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
});

/**
 * Fetch creator's challenges (for challenge management page)
 */
export const fetchCreatorChallenges = async (
  skip: number = 0,
  take: number = 20,
  accessToken?: string
): Promise<CreatorChallengesResponse> => {
  try {
    console.log("📡 [fetchCreatorChallenges] Fetching creator challenges from API");

    const url = buildApiUrl(API_BASE_URLS.challenge, API_ENDPOINTS.challenge.creatorList);
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

    console.log("🔗 [fetchCreatorChallenges] Full URL:", `${url}?${queryParams}`);
    console.log("🔐 [fetchCreatorChallenges] Token exists:", !!accessToken);

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: accessToken ? getAuthHeader(accessToken) : { 'Content-Type': 'application/json' },
    });

    console.log("📊 [fetchCreatorChallenges] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [fetchCreatorChallenges] Error response:", error);
      throw new Error(error.message || `Failed to fetch creator challenges: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [fetchCreatorChallenges] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch creator challenges";
    console.error("❌ [fetchCreatorChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch challenges with optional pagination
 */
export const fetchChallengesByCompanyId = async (
  cursor?: string,
  limit: number = 10,
  accessToken?: string
): Promise<ChallengePaginatedResponse> => {
  try {
    console.log("📡 [fetchChallengesByCompanyId] Fetching challenges from API");

    const url = buildApiUrl(API_BASE_URLS.challenge, API_ENDPOINTS.challenge.list);
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      ...(cursor && { cursor }),
    });

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: accessToken ? getAuthHeader(accessToken) : { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to fetch challenges: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [fetchChallengesByCompanyId] Success");
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch challenges";
    console.error("❌ [fetchChallengesByCompanyId] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get challenge details by ID
 */
export const getChallengeDetail = async (
  challengeId: string | number,
  accessToken?: string
): Promise<Challenge> => {
  try {
    console.log("📡 [getChallengeDetail] Fetching challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.detail(String(challengeId))
    );

    console.log("🔗 [getChallengeDetail] Full URL:", url);
    console.log("🔐 [getChallengeDetail] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: 'GET',
      headers: accessToken ? getAuthHeader(accessToken) : { 'Content-Type': 'application/json' },
    });

    console.log("📊 [getChallengeDetail] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getChallengeDetail] Error response:", error);
      throw new Error(error.message || `Failed to fetch challenge: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [getChallengeDetail] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch challenge detail";
    console.error("❌ [getChallengeDetail] Error:", errorMessage);
    throw error;
  }
};

/**
 * Create a new challenge
 */
export const createChallenge = async (
  payload: CreateChallengePayload,
  accessToken: string
): Promise<Challenge> => {
  try {
    console.log("📡 [createChallenge] Creating challenge:", payload);

    const url = buildApiUrl(API_BASE_URLS.challenge, API_ENDPOINTS.challenge.create);
    console.log("🔗 [createChallenge] Full URL:", url);
    console.log("📦 [createChallenge] Payload:", JSON.stringify(payload, null, 2));
    console.log("🔐 [createChallenge] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(payload),
    });

    console.log("📊 [createChallenge] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [createChallenge] Error response:", error);
      throw new Error(error.message || `Failed to create challenge: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [createChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create challenge";
    console.error("❌ [createChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Update a challenge
 */
export const updateChallenge = async (
  challengeId: string | number,
  payload: CreateChallengePayload,
  accessToken: string
): Promise<Challenge> => {
  try {
    console.log("📡 [updateChallenge] Updating challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.update(String(challengeId))
    );

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to update challenge: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [updateChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update challenge";
    console.error("❌ [updateChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Delete a challenge
 */
export const deleteChallenge = async (
  challengeId: string | number,
  accessToken: string
): Promise<void> => {
  try {
    console.log("📡 [deleteChallenge] Deleting challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.delete(String(challengeId))
    );

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeader(accessToken),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to delete challenge: ${response.statusText}`);
    }

    console.log("✅ [deleteChallenge] Success");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete challenge";
    console.error("❌ [deleteChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch public challenges (ongoing challenges for talents to participate)
 */
export const fetchPublicChallenges = async (
  skip: number = 0,
  take: number = 20,
  accessToken?: string
): Promise<CreatorChallengesResponse> => {
  try {
    console.log("📡 [fetchPublicChallenges] Fetching public challenges from API");

    const url = buildApiUrl(API_BASE_URLS.challenge, API_ENDPOINTS.challenge.publicList);
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

    console.log("🔗 [fetchPublicChallenges] Full URL:", `${url}?${queryParams}`);

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log("📊 [fetchPublicChallenges] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [fetchPublicChallenges] Error response:", error);
      throw new Error(error.message || `Failed to fetch public challenges: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [fetchPublicChallenges] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch public challenges";
    console.error("❌ [fetchPublicChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Submit a challenge for admin review
 * POST /api/challenges/{id}/submit-review
 */
export const submitChallengeForReview = async (
  challengeId: string,
  accessToken: string
): Promise<Challenge> => {
  try {
    console.log("📡 [submitChallengeForReview] Submitting challenge ID:", challengeId);

    // Bạn hãy cấu hình endpoint này trong apiConfig nếu cần, dưới đây là fallback nối chuỗi URL trực tiếp
    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `${API_ENDPOINTS.challenge.list}/${challengeId}/submit-review`
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
    });

    console.log("📊 [submitChallengeForReview] Response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Gửi duyệt thất bại: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [submitChallengeForReview] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi khi gửi duyệt thử thách";
    console.error("❌ [submitChallengeForReview] Error:", errorMessage);
    throw error;
  }
};

/**
 * Creator self-approve and publish challenge
 * POST /api/creator/challenges/{challengeId}/approve-and-publish
 */
export const approveAndPublishChallenge = async (
  challengeId: string,
  accessToken: string
): Promise<Challenge> => {
  try {
    console.log("📡 [approveAndPublishChallenge] Publishing challenge ID:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `/api/creator/challenges/${challengeId}/approve-and-publish`
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeader(accessToken),
    });

    console.log("📊 [approveAndPublishChallenge] Response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Xuất bản thất bại: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [approveAndPublishChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi khi xuất bản thử thách";
    console.error("❌ [approveAndPublishChallenge] Error:", errorMessage);
    throw error;
  }
};

