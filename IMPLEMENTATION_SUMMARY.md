# SEP490 Web - Session & Token Management Fixes

## ✅ CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1. 🔐 Logo Navigation - Header Fix
**File**: `src/components/common/Header.tsx`

**Vấn đề**: Logo không kiểm tra đăng nhập
**Giải pháp**:
- ✅ Thay thế `<Link>` bằng `<button>` với click handler
- ✅ Kiểm tra `isLoggedIn` trước khi navigate
- ✅ Nếu chưa login: hiển thị cảnh báo toast + redirect đến `/login`
- ✅ Nếu đã login: navigate đến home page tuỳ role (talent-home hoặc recruiter-home):

```typescript
const handleLogoClick = (e: React.MouseEvent) => {
  e.preventDefault();
  
  if (!isLoggedIn) {
    notify.warning("Vui lòng đăng nhập để vào trang chủ");
    navigate("/login");
    return;
  }
  
  navigate(homeHref); // Dựa trên role
};
```

### 2. 📋 Token Expiration Utilities
**File**: `src/utils/tokenUtils.ts` (NEW)

Các utility functions để xử lý JWT token:
- `decodeToken()` - Decode JWT payload
- `isTokenExpired()` - Kiểm tra token đã hết hạn
- `getTokenRemainingTime()` - Lấy thời gian còn lại (ms)
- `getTokenExpirationInfo()` - Lấy info "X giờ Y phút"
- `isTokenExpiringSoon()` - Kiểm tra token sắp hết hạn (5 phút)

**Ví dụ sử dụng**:
```typescript
import { isTokenExpired, getTokenRemainingTime } from "@/utils/tokenUtils";

const token = localStorage.getItem("token");
if (isTokenExpired(token)) {
  console.log("Token đã hết hạn!");
}
const remaining = getTokenRemainingTime(token);
console.log(`Token hết hạn trong ${remaining}ms`);
```

### 3. ⏰ Token Expiration Check Hook
**File**: `src/hook/useTokenExpirationCheck.ts` (NEW)

**Chức năng**:
- ✅ Kiểm tra token đã hết hạn khi app load
- ✅ Tự động logout + redirect đến login nếu token hết hạn
- ✅ Cảnh báo khi token sắp hết hạn (5 phút)
- ✅ Kiểm tra mỗi 1 phút

**Đã thêm vào**:
- App.tsx - called trên top level của component tree

```typescript
useEffect(() => {
  // Check token expiration
  useTokenExpirationCheck();
}, []); // runs when component mounts
```

### 4. 🔄 Auto-Refresh Token Interceptor (Optional)
**File**: `src/hook/useAutoRefreshToken.ts` (NEW)

**⚠️ CHỈ SỬ DỤNG NẾU BACKEND HỖ TRỢ REFRESH TOKEN ENDPOINT**

Cách dùng:
1. Backend phải có endpoint: `POST /Auth/refresh`
2. Import vào App.tsx
3. Hook sẽ tự động refresh token trước khi hết hạn
4. Session kéo dài mà user không bị logout

```typescript
function App() {
  useAutoRefreshToken(); // Thêm dòng này nếu backend hỗ trợ
  useTokenExpirationCheck(); // Giữ backup logout
}
```

### 5. 📚 Session Configuration Document
**File**: `src/config/sessionConfig.ts` (NEW)

Chi tiết cấu hình:
- Redux Persist setup (localStorage)
- Token check intervals
- Recommendation để tăng session duration

## 🔍 HIỆN TẠI - Current Session Duration

### Trạng thái hiện tại:
1. **Redux Persist**: Lưu auth state vào localStorage → Persist qua browser close
2. **JWT Token Expiration**: Phụ thuộc hoàn toàn vào Backend API
   - Backend set "exp" field trong JWT payload
   - Frontend kiểm tra mỗi 1 phút
3. **Logout trigger**: Khi token hết hạn

### Vấn đề:
- Thời gian session phụ thuộc Backend, sẽ logout nếu token hết hạn
- Cần hỏi Backend: token expiration hiện tại bao lâu?

## 🚀 CÁC BƯỚC TIẾP THEO - RECOMMENDATIONS

### Option 1: Tăng Token Expiration ở Backend ⭐ RECOMMENDED
**Hành động**: Liên hệ Backend team
- Hiện tại JWT token expiration là bao lâu? (1 giờ? 24 giờ?)
- Có thể tăng lên ít nhất 24-48 giờ không?
- có thể set thông qua environment config?

**Ưu điểm**: Đơn giản, không cần thay đổi Frontend

### Option 2: Implement Auto-Refresh (Advanced)
**Hành động**: 
1. Yêu cầu Backend implement `/Auth/refresh` endpoint
2. Frontend tự động call refresh trước khi token hết hạn (5 phút)
3. Uncomment/import `useAutoRefreshToken()` ở App.tsx

**Ưu điểm**: 
- Access token ngắn hạn (15-30 phút) → An toàn
- Refresh token dài hạn (7-30 ngày) → Session kéo dài
- User không bị logout đột ngột

**Cách implement**:
```typescript
// src/App.tsx
function App() {
  useTokenExpirationCheck(); // Backup logout
  useAutoRefreshToken(); // Auto-refresh token
  
  // ... rest of code
}
```

Backend endpoint (`/Auth/refresh`) format:
```
POST /Auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Option 3: Add "Remember Me" Feature
**Hành động**: 
- Khi login, user có option "Remember me for 30 days"
- Backend issue long-lived refresh token
- Session tự động extend đến 30 ngày

## 📊 FILES MODIFIED & CREATED

✅ **Modified**:
- `src/components/common/Header.tsx` - Logo click handler + login check

✅ **Created**:
- `src/utils/tokenUtils.ts` - JWT token utilities
- `src/hook/useTokenExpirationCheck.ts` - Automatic token expiration check
- `src/hook/useAutoRefreshToken.ts` - Optional auto-refresh (if backend supports)
- `src/config/sessionConfig.ts` - Session configuration document

## 🧪 TESTING

### Test Logo Functionality
1. **Test khi chưa login**:
   ```
   - Không login vào trang
   - Click logo
   - Expect: Toast "Vui lòng đăng nhập để vào trang chủ" + redirect login page
   ```

2. **Test khi đã login**:
   ```
   - Login vào trang
   - Click logo
   - Expect: Navigate tới talent-home (hoặc recruiter-home tuỳ role)
   ```

### Test Token Expiration
1. **Check console** khi app load:
   ```
   - Nếu token còn hạn: Không log gì
   - Nếu token hết hạn: Log "🔌 Token đã hết hạn" → Auto logout
   - Nếu token sắp hết: Log "⏰ Token sắp hết hạn" → Show toast warning
   ```

2. **Debug token info**:
   ```javascript
   // Paste vào Chrome DevTools:
   import { getTokenExpirationInfo } from "@/utils/tokenUtils";
   const token = localStorage.getItem("persist:root");
   // (Cần extract accessToken từ localStorage string)
   ```

## 💡 ADDITIONAL TIPS

### Debug Token Expiration
```javascript
// Console in DevTools:
import { decodeToken, getTokenExpirationInfo } from "@/utils/tokenUtils";

// Get token từ Redux store
// hoặc từ localStorage

const token = "your-jwt-token";
const decoded = decodeToken(token);
console.log("Token decoded:", decoded);

const info = getTokenExpirationInfo(token);
console.log("Expires in:", info.expiresIn);
console.log("Expires at:", info.expiresAt);
```

### Session Storage Info
- Session state lưu ở: `localStorage` key `persist:root`
- được restore tự động khi open browser lại
- Token thực tế trong: `state.auth.accessToken`

## ✨ SUMMARY

| Vấn đề | Giải pháp | Status |
|--------|----------|--------|
| Logo không check login | Thêm click handler + login check | ✅ Hoàn thành |
| Không kiểm tra token expiration | Thêm useTokenExpirationCheck hook | ✅ Hoàn thành |
| Token thông tin không accessible | TokenUtils functions để decode & check | ✅ Hoàn thành |
| Session hết hạn nhanh | Recommend tăng backend expiration | 📋 Cần Backend |
| Logout đột ngột | Optional auto-refresh hook ready | 🔧 Ready to implement |

---

**Next steps**: Hãy liên hệ Backend team để:
1. Kiểm tra token expiration hiện tại
2. Xin tăng lên 24-48 giờ (hoặc configure thông qua env)
3. Hoặc implement `/Auth/refresh` endpoint để support auto-refresh
