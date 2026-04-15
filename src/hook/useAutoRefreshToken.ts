/**
 * AUTO-REFRESH TOKEN INTERCEPTOR (Optional)
 * 
 * ⚠️ CHỈ SỬ DỤNG NẾU BACKEND HỖ TRỢ REFRESH TOKEN ENDPOINT
 * 
 * Cách dùng:
 * 1. Backend phải có endpoint: POST /Auth/refresh
 * 2. Nhận refreshToken, trả về accessToken mới
 * 3. Import interceptor vào App.tsx
 */

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { isTokenExpiringSoon } from "@/utils/tokenUtils";
import { loginSuccess } from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface RefreshTokenResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken?: string;
  };
  message?: string;
}

/**
 * Hook để tự động refresh token trước khi hết hạn
 * 
 * Quy trình:
 * 1. Kiểm tra token sắp hết hạn (5 phút)
 * 2. Gọi /Auth/refresh endpoint với refreshToken
 * 3. Update Redux store với accessToken mới
 * 4. Tiếp tục session mà user không bị gián đoạn
 */
export const useAutoRefreshToken = () => {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    // Kiểm tra token sắp hết hạn
    if (!isTokenExpiringSoon(accessToken)) return;

    let isRefreshing = false;

    const refreshAccessToken = async () => {
      if (isRefreshing) return;
      isRefreshing = true;

      try {
        console.log("🔄 Refreshing access token...");

        const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error(`Refresh failed with status ${response.status}`);
        }

        const data: RefreshTokenResponse = await response.json();

        if (data.success && data.data?.accessToken && user) {
          console.log("✅ Token refreshed successfully");
          dispatch(
            loginSuccess({
              user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken || refreshToken,
            }),
          );
          notify.success("Phiên làm việc được gia hạn thêm");
        } else {
          throw new Error(data.message || "Refresh token failed");
        }
      } catch (error) {
        console.error("❌ Token refresh failed:", error);
        // Nếu refresh fail, user sẽ logout tự động khi token expiration check chạy
      } finally {
        isRefreshing = false;
      }
    };

    refreshAccessToken();
  }, [accessToken, refreshToken, user, dispatch]);
};

/**
 * ⚙️ CẦU HÌNH TỪ BACKEND
 * 
 * Backend cần implement endpoint:
 * 
 * POST /Auth/refresh
 * Request body:
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIs...",
 *     "refreshToken": "eyJhbGciOiJIUzI1NiIs..." (optional, nếu rotate refresh token)
 *   }
 * }
 */

/**
 * HOW TO USE:
 * 
 * 1. Thêm vào App.tsx:
 * 
 * import { useAutoRefreshToken } from "@/hook/useAutoRefreshToken";
 * 
 * function App() {
 *   useAutoRefreshToken(); // Gọi dòng này
 *   // ... rest of code
 * }
 * 
 * 2. Kiểm tra Backend hỗ trợ /Auth/refresh?
 * 
 * 3. Nếu vẫn muốn logout khi token hết hạn:
 *    - Giữ useTokenExpirationCheck() trong App.tsx
 *    - Cả hai hook sẽ chạy cùng lúc
 *    - refresh token sẽ cố gắng update trước khi timeout
 */
