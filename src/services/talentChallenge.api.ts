import { Challenge, ChallengeSubmission } from '@/types/challenge';
import { mockChallenges } from '@/data/mockChallenge';
import { mockChallengeSubmissions } from '@/data/mockChallengeSubmission';

/**
 * Talent Challenge API Service
 * Handles challenge viewing and submission for talent users
 * Currently using mock data - replace with real API calls when backend is ready
 */

// Mock data storage
let submissions: ChallengeSubmission[] = JSON.parse(JSON.stringify(mockChallengeSubmissions));
let nextSubmissionId = Math.max(...submissions.map(s => s.id), 0) + 1;

const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Fetch active challenges (for talent users)
 */
export const fetchActiveChallenges = async (
  _accessToken?: string
): Promise<Challenge[]> => {
  try {
    console.log("📡 [fetchActiveChallenges] Fetching active challenges");

    await simulateNetworkDelay(600);

    const now = new Date();
    const activeChallenges = mockChallenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      return startDate <= now && now <= endDate && challenge.status === 'active';
    });

    console.log("✅ [fetchActiveChallenges] Success:", activeChallenges.length);
    return activeChallenges;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch active challenges";
    console.error("❌ [fetchActiveChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch completed challenges for a user
 */
export const fetchCompletedChallenges = async (
  userId: number,
  _accessToken?: string
): Promise<Challenge[]> => {
  try {
    console.log("📡 [fetchCompletedChallenges] Fetching completed challenges for user:", userId);

    await simulateNetworkDelay(600);

    // Get all submissions for this user
    const userSubmissions = submissions.filter(s => s.userId === userId);
    const submittedChallengeIds = userSubmissions.map(s => s.challengeId);

    // Get challenges that have submissions from this user
    const completedChallenges = mockChallenges.filter(c => submittedChallengeIds.includes(c.id));

    console.log("✅ [fetchCompletedChallenges] Success:", completedChallenges.length);
    return completedChallenges;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch completed challenges";
    console.error("❌ [fetchCompletedChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get challenge detail with submission status
 */
export const getChallengeDetailWithSubmission = async (
  challengeId: number,
  userId: number,
  _accessToken?: string
): Promise<{ challenge: Challenge; submission: ChallengeSubmission | null }> => {
  try {
    console.log("📡 [getChallengeDetailWithSubmission] Fetching challenge:", challengeId, "for user:", userId);

    await simulateNetworkDelay(400);

    const challenge = mockChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }

    const submission = submissions.find(s => s.challengeId === challengeId && s.userId === userId) || null;

    console.log("✅ [getChallengeDetailWithSubmission] Success");
    return { challenge, submission };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch challenge detail";
    console.error("❌ [getChallengeDetailWithSubmission] Error:", errorMessage);
    throw error;
  }
};

/**
 * Submit a challenge solution
 */
export const submitChallengeSolution = async (
  challengeId: number,
  userId: number,
  file: File,
  _accessToken?: string
): Promise<ChallengeSubmission> => {
  try {
    console.log("📡 [submitChallengeSolution] Submitting challenge:", challengeId);

    await simulateNetworkDelay(1000);

    // Simulate file upload
    const fileUrl = `/uploads/submissions/${Date.now()}_${file.name}`;

    // Check if user already submitted this challenge
    const existingSubmission = submissions.find(
      s => s.challengeId === challengeId && s.userId === userId
    );

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.fileName = file.name;
      existingSubmission.submittedAt = new Date().toISOString();
      existingSubmission.status = 'pending';
      console.log("✅ [submitChallengeSolution] Updated submission");
      return existingSubmission;
    }

    // Create new submission
    const newSubmission: ChallengeSubmission = {
      id: nextSubmissionId++,
      challengeId,
      userId,
      fileUrl,
      fileName: file.name,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    submissions.push(newSubmission);
    console.log("✅ [submitChallengeSolution] Created new submission");
    return newSubmission;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit challenge";
    console.error("❌ [submitChallengeSolution] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get submission detail
 */
export const getSubmissionDetail = async (
  submissionId: number,
  _accessToken?: string
): Promise<ChallengeSubmission> => {
  try {
    console.log("📡 [getSubmissionDetail] Fetching submission:", submissionId);

    await simulateNetworkDelay(300);

    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) {
      throw new Error(`Submission with ID ${submissionId} not found`);
    }

    console.log("✅ [getSubmissionDetail] Success");
    return submission;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch submission detail";
    console.error("❌ [getSubmissionDetail] Error:", errorMessage);
    throw error;
  }
};
