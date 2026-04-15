/**
 * SESSION MANAGEMENT CONFIGURATION
 * 
 * Hướng dẫn cấu hình session và token expiration cho SEP490 Web App
 */

/**
 * 📋 HIỆN TẠI - CURRENT SETUP
 * 
 * 1. Redux Persist:
 *    - Lưu state vào localStorage
 *    - Persist auth state (user, tokens) khi user đóng/mở browser
 *    - Không có timeout - phụ thuộc hoàn toàn vào JWT token expiration
 * 
 * 2. JWT Token Expiration:
 *    - Được set ở Backend (API)
 *    - Lấy từ JWT payload - field "exp" (Unix timestamp in seconds)
 *    - Frontend kiểm tra token hết hạn bằng useTokenExpirationCheck hook
 * 
 * 3. Current Token Expiration Check:
 *    - ✅ Tự động logout khi token hết hạn
 *    - ✅ Cảnh báo khi token sắp hết hạn (5 phút)
 *    - ✅ Check mỗi 1 phút
 */

/**
 * 🔧 CÁC CÁC TÙYNH CHỈNH CÓ THỂ LÀMM
 */

/**
 * OPTION 1: Tăng JWT Token Expiration ở Backend
 * 
 * ⚠️ ĐỂ TĂNG THỜI GIAN SESSION, CẦN THAY ĐỔI BACKEND
 * 
 * - Backend API sẽ generate JWT token khi đăng nhập
 * - Thiết lập "exp" (expiration) trong JWT payload
 * - VD: 24 giờ, 7 ngày, 30 ngày, v.v.
 * 
 * Bạn cần yêu cầu Backend:
 * - Mở rộng JWT token expiration time
 * - Có thể set qua environment variables hoặc config file
 * - VD: JWT_EXPIRATION_HOURS = 24 (thay vì mặc định)
 */

/**
 * OPTION 2: Tăng Refresh Token Expiration ở Backend
 * 
 * Một số API có refresh token mechanism:
 * - Access token: ngắn hạn (15-30 phút)
 * - Refresh token: dài hạn (7-30 ngày)
 * - Frontend tự động dùng refresh token để lấy access token mới
 * 
 * Hiện tại codebase có "refreshToken" nhưng chưa implement auto-refresh
 * Cần add middleware để tự động refresh khi token hết hạn
 */

/**
 * OPTION 3: Thêm Auto-Refresh Token Middleware ở Frontend
 * 
 * Implement interceptor để:
 * - Khi access token sắp hết hạn, tự động call /refresh endpoint
 * - Lấy access token mới mà không logout user
 * - Tiếp tục session mà không gián đoạn
 * 
 * Ưu điểm:
 * - User không cần logout/login lại
 * - Session có thể kéo dài lâu (tùy refresh token expiration)
 * - Smooth UX
 */

/**
 * OPTION 4: Thêm "Remember Me" Feature
 * 
 * - Khi login, có option "Remember me for 30 days"
 * - Backend issue access token + long-lived refresh token
 * - Session kéo dài đến 30 ngày
 */

/**
 * 📂 FILES AFFECTED / MÀN HÌNH CẦN THAY ĐỔI
 * 
 * 1. Tăng token expiration:
 *    - Cần thay đổi Backend API - không phải Frontend
 * 
 * 2. Thêm auto-refresh:
 *    - Thêm middleware/interceptor cho fetch calls
 *    - Update authSlice để handle refreshToken action
 *    - Update auth.api.ts để thêm refresh endpoint
 * 
 * 3. Hiển thị session expiration:
 *    - Có thể thêm component ở Header để show "Session expires in X minutes"
 *    - Dùng tokenUtils.getTokenExpirationInfo() 
 */

/**
 * 🚀 RECOMMENDED IMPLEMENTATION
 * 
 * Step 1: Check với Backend team
 *   - Hỏi JWT token expiration hiện tại là bao lâu
 *   - Hỏi có refresh token mechanism không
 *   - Đề nghị kéo dài token (ít nhất 1-2 ngày hoặc tùy biz logic)
 * 
 * Step 2: Implement Auto-Refresh (Nếu Backend hỗ trợ)
 *   - Tạo middleware check token expiration
 *   - Gọi refresh endpoint trước khi token hết hạn
 *   - Maintain seamless session
 * 
 * Step 3: UX Improvements
 *   - Hiển thị countdown timer ở Header khi token sắp hết hạn
 *   - Nút "Extend Session" để refresh token
 *   - Modal cảnh báo trước 5 phút
 */

/**
 * 📊 KIỂM TRA TOKEN EXPIRATION
 * 
 * Để debug, thêm vào console:
 * 
 * import { decodeToken, getTokenExpirationInfo } from "@/utils/tokenUtils";
 * 
 * const token = localStorage.getItem("your-token-key");
 * const info = getTokenExpirationInfo(token);
 * console.log("Token expires in:", info.expiresIn);
 * console.log("Token expires at:", info.expiresAt);
 */

export const SESSION_CONFIG = {
  // Redux Persist config
  persist: {
    key: "root",
    storage: "localStorage", // Sử dụng localStorage (persist across browser closes)
    whitelist: ["auth", "savedPosts"],
  },

  // Token check config
  token: {
    checkIntervalMs: 60 * 1000, // Check mỗi 1 phút
    expiringWarningThresholdMs: 5 * 60 * 1000, // Cảnh báo 5 phút trước
  },

  // Suggestions
  suggestions: [
    "🔗 Hãy yêu cầu Backend tăng JWT token expiration (ít nhất 24-48 giờ)",
    "🔄 Hoặc implement auto-refresh token mechanism",
    "⏰ Có thể add session timeout với 'Remember Me' feature",
    "📝 Hiện tại token expiration phụ thuộc 100% vào Backend configuration",
  ],
};
