import { ChallengeSubmission } from "@/types/challenge";

export const mockChallengeSubmissions: ChallengeSubmission[] = [
  {
    id: 1,
    challengeId: 1,
    userId: 50,
    fileUrl: "/uploads/submissions/1234567890_react-app.zip",
    fileName: "react-app.zip",
    submittedAt: "2024-06-15T10:30:00Z",
    status: "approved",
    feedback: "Excellent work! The app is well-structured and uses best practices. Great job on the UI/UX as well.",
  },
  {
    id: 2,
    challengeId: 2,
    userId: 51,
    fileUrl: "/uploads/submissions/1234567891_nodejs-api.zip",
    fileName: "nodejs-api.zip",
    submittedAt: "2024-07-20T14:45:00Z",
    status: "pending",
  },
  {
    id: 3,
    challengeId: 3,
    userId: 50,
    fileUrl: "/uploads/submissions/1234567892_flutter-app.apk",
    fileName: "flutter-app.apk",
    submittedAt: "2024-08-10T09:15:00Z",
    status: "rejected",
    feedback: "The app crashes on Android 10+. Please fix the permissions and test on multiple versions before resubmitting.",
  },
  {
    id: 4,
    challengeId: 4,
    userId: 52,
    fileUrl: "/uploads/submissions/1234567893_ml-model.zip",
    fileName: "ml-model.zip",
    submittedAt: "2024-09-05T16:20:00Z",
    status: "approved",
    feedback: "Great model accuracy! The preprocessing steps are well-documented.",
  },
];
