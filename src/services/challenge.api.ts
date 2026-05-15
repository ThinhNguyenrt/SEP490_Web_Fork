import { Challenge, ChallengePaginatedResponse, CreateChallengePayload } from '@/types/challenge';
import { mockChallenges } from '@/data/mockChallenge';

/**
 * Challenge API Service
 * Handles challenge operations for company users
 * Currently using mock data - replace with real API calls when backend is ready
 */

// Mock data storage (simulating database)
let challenges: Challenge[] = JSON.parse(JSON.stringify(mockChallenges));
let nextId = Math.max(...challenges.map(c => c.id)) + 1;

// Helper function to simulate network delay
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Fetch challenges for a company with pagination support
 */
export const fetchChallengesByCompanyId = async (
  companyId: number,
  cursor?: string,
  limit: number = 10,
  _accessToken?: string
): Promise<ChallengePaginatedResponse> => {
  try {
    console.log("📡 [fetchChallengesByCompanyId] Fetching mock data with companyId:", companyId);

    // Simulate network delay
    await simulateNetworkDelay(600);

    // Filter challenges by companyId
    const filteredChallenges = challenges.filter(c => c.companyId === companyId);

    // Implement simple cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      startIndex = filteredChallenges.findIndex(c => c.id.toString() === cursor) + 1;
    }

    const paginatedChallenges = filteredChallenges.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filteredChallenges.length;
    const nextCursor = hasMore ? paginatedChallenges[paginatedChallenges.length - 1]?.id.toString() : undefined;

    console.log("✅ [fetchChallengesByCompanyId] Success:", {
      count: paginatedChallenges.length,
      total: filteredChallenges.length,
      hasMore,
    });

    return {
      data: paginatedChallenges,
      total: filteredChallenges.length,
      hasMore,
      cursor: nextCursor,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch challenges";
    console.error("❌ [fetchChallengesByCompanyId] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get challenge details
 */
export const getChallengeDetail = async (
  challengeId: number,
  _accessToken?: string
): Promise<Challenge> => {
  try {
    console.log("📡 [getChallengeDetail] Fetching challenge:", challengeId);

    await simulateNetworkDelay(400);

    const challenge = challenges.find(c => c.id === challengeId);

    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }

    console.log("✅ [getChallengeDetail] Success:", challenge);
    return challenge;
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
  companyId: number,
  payload: CreateChallengePayload,
  _accessToken?: string
): Promise<Challenge> => {
  try {
    console.log("📡 [createChallenge] Creating challenge:", payload);

    await simulateNetworkDelay(500);

    const now = new Date().toISOString();
    const newChallenge: Challenge = {
      id: nextId++,
      companyId,
      title: payload.title,
      description: payload.description,
      startDate: new Date(payload.startDate).toISOString(),
      endDate: new Date(payload.endDate).toISOString(),
      reward: payload.reward,
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    };

    challenges.push(newChallenge);
    console.log("✅ [createChallenge] Success:", newChallenge);
    return newChallenge;
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
  challengeId: number,
  payload: CreateChallengePayload,
  _accessToken?: string
): Promise<Challenge> => {
  try {
    console.log("📡 [updateChallenge] Updating challenge:", challengeId);

    await simulateNetworkDelay(500);

    const challengeIndex = challenges.findIndex(c => c.id === challengeId);

    if (challengeIndex === -1) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }

    const updatedChallenge: Challenge = {
      ...challenges[challengeIndex],
      title: payload.title,
      description: payload.description,
      startDate: new Date(payload.startDate).toISOString(),
      endDate: new Date(payload.endDate).toISOString(),
      reward: payload.reward,
      updatedAt: new Date().toISOString(),
    };

    challenges[challengeIndex] = updatedChallenge;
    console.log("✅ [updateChallenge] Success:", updatedChallenge);
    return updatedChallenge;
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
  challengeId: number,
  _accessToken?: string
): Promise<void> => {
  try {
    console.log("📡 [deleteChallenge] Deleting challenge:", challengeId);

    await simulateNetworkDelay(500);

    const challengeIndex = challenges.findIndex(c => c.id === challengeId);

    if (challengeIndex === -1) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }

    challenges.splice(challengeIndex, 1);
    console.log("✅ [deleteChallenge] Success");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete challenge";
    console.error("❌ [deleteChallenge] Error:", errorMessage);
    throw error;
  }
};
