import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockLoginAccounts } from "@/data/mockUser";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  loginFailure,
  loginSuccess,
  loginStart,
} from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // xử lí error và loading
  const { error, loading } = useAppSelector((state) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // hiện loading "Đang xác thực..."
    dispatch(loginStart());

    setTimeout(() => {
      const account = mockLoginAccounts.find(
        (acc) => acc.email === email && acc.password === password,
      );

      if (account) {
        // lưu user
        dispatch(loginSuccess(account));

        // Recruiter vào recruiter-home, User vào talent-home
        if (account.role === "recruiter") {
          // Thông báo thành công
          notify.success("Login thành công!");
          navigate("/recruiter-home");
        } else {
          notify.success("Login thành công!");
          navigate("/talent-home");
        }
      } else {
        dispatch(loginFailure("Email hoặc mật khẩu không chính xác!"));
      }
    }, 2000);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 animate-in fade-in duration-500"
    >
      {/* email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            className="pl-10 h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* hiển thị error */}
      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-100 animate-shake">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <a
          href="#"
          className="text-sm font-medium text-[#0288D1] hover:underline"
        >
          Quên mật khẩu?
        </a>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd] cursor-pointer disabled:opacity-70 transition-all active:scale-[0.98]"
      >
        {loading ? (
          /* Lớp Overlay phủ toàn bộ màn hình */
          <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Container cho Spinner và Text */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
              {/* Vòng tròn Loading Spinner */}
              <div className="relative">
                {/* Vòng tròn nhạt phía dưới */}
                <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                {/* Vòng xoay chính */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  );
};
