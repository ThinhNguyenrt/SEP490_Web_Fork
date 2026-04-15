/**
 * Utility functions để xử lý JWT token
 */

interface DecodedToken {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token (không verify signature, chỉ decode payload)
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return null;
    }

    // Lấy payload (phần thứ 2)
    const payload = parts[1];
    
    // Decode base64url
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const json = JSON.parse(decoded);
    
    return json;
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

/**
 * Kiểm tra token đã hết hạn chưa
 * @param token JWT token
 * @returns true nếu token đã hết hạn, false nếu còn hạn
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    console.warn('⚠️ Cannot determine token expiration');
    return true;
  }

  // Convert exp từ seconds thành milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  const isExpired = currentTime > expirationTime;
  
  if (isExpired) {
    console.warn(`⚠️ Token expired at ${new Date(expirationTime).toISOString()}`);
  }

  return isExpired;
};

/**
 * Lấy thời gian còn lại cho token (milliseconds)
 */
export const getTokenRemainingTime = (token: string): number => {
  if (!token) return 0;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;

  return Math.max(remainingTime, 0);
};

/**
 * Lấy thông tin exp của token để hiển thị
 */
export const getTokenExpirationInfo = (token: string): { expiresIn: string; expiresAt: string } | null => {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  const expirationTime = new Date(decoded.exp * 1000);
  const remainingMs = getTokenRemainingTime(token);
  
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    expiresIn: `${hours}h ${minutes}m`,
    expiresAt: expirationTime.toISOString(),
  };
};

/**
 * Kiểm tra token sắp hết hạn (5 phút)
 */
export const isTokenExpiringSoon = (token: string, thresholdMs: number = 5 * 60 * 1000): boolean => {
  const remainingTime = getTokenRemainingTime(token);
  return remainingTime < thresholdMs;
};
