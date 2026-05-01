export type NotificationType =
  | "CONNECTION_ACCEPTED"
  | "CONNECTION_REJECTED"
  | "CONNECTION_REQUEST_SENT"
  | "PROFILE_VIEWED"
  | "JOB_INVITATION"
  | "PORTFOLIO_APPROVED"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "POST_APPROVED"
  | "SYSTEM_ANNOUNCEMENT"
  | "COMMUNITY_POST_REPORTED"
  | "PORTFOLIO_REPORTED"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "POST_COMMENT_REPLIED"
  | "POST_SHARED"
  | "POST_MENTIONED";
export type UserNotification = {
  id: number;
  userId: number | string;
  title: string;
  content: string;
  type: NotificationType;
  objectId?: number | string;
  createdAt: string;
  isRead: boolean;

  actor?: {
    id: number;
    name: string;
    avatar: string;
    Role: string;
  };
  company?: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
};
