import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { isTokenExpired, isTokenExpiringSoon } from "@/utils/tokenUtils";
import { logout } from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";
import { useNavigate } from "react-router-dom";

/**
 * Hook để kiểm tra token expiration
 * - Tự động logout nếu token đã hết hạn
 * - Cảnh báo khi token sắp hết hạn (5 phút)
 */
export const useTokenExpirationCheck = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) return;

    // Kiểm tra token đã hết hạn
    if (isTokenExpired(accessToken)) {
      console.warn("🔌 Token đã hết hạn, logout...");
      notify.error("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
      dispatch(logout());
      navigate("/login");
      return;
    }

    // Kiểm tra token sắp hết hạn
    if (isTokenExpiringSoon(accessToken)) {
      console.warn("⏰ Token sắp hết hạn (5 phút nữa)");
      notify.info("Phiên làm việc sắp hết hạn, vui lòng làm mới trang hoặc đăng nhập lại");
    }

    // Set interval để kiểm tra mỗi phút
    const interval = setInterval(() => {
      if (isTokenExpired(accessToken)) {
        console.warn("🔌 Token đã hết hạn, logout...");
        notify.error("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
        dispatch(logout());
        navigate("/login");
        clearInterval(interval);
      }
    }, 60 * 1000); // Check mỗi 1 phút

    return () => clearInterval(interval);
  }, [accessToken, dispatch, navigate]);
};
