import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";
import { AuthUser } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

interface LoginSuccessPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // nhấn nút đăng nhập
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // đăng nhập thành công
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
    },
    // có lỗi
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    // đăng xuất
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateUserInfo: (state, action) => {
      if (state.user) {
        // Hợp nhất thông tin cũ và mới
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserInfo,
} = authSlice.actions;
export default authSlice.reducer;
