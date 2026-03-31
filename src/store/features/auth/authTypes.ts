import { AuthUser } from "@/types/auth";

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}