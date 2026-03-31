import {
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/auth.api";
import { notify } from "@/lib/toast";

export const RecruiterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      console.log("📝 RecruiterForm - Bắt đầu đăng ký recruiter");
      const response = await authAPI.register({
        email,
        password,
        role: 2, // 2 = recruiter
      });

      if (response.success) {
        console.log("✅ RecruiterForm - Đăng ký thành công");
        notify.success("Đăng ký thành công! Vui lòng đăng nhập.");
        // Điều hướng về login page
        navigate("/login", { replace: true });
      } else {
        setError(response.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đăng ký thất bại!";
      console.error("❌ RecruiterForm - Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-left-4 duration-500">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email công ty</Label>
        <Input
          id="email"
          type="email"
          placeholder="hr@company.com"
          className="h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

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
            className="pl-10 pr-10 h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Xác nhận</Label>
        <div className="relative">
          <RotateCcw
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Hiển thị error */}
      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-100">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm font-medium text-[#0288D1] hover:underline"
        >
          Đăng ký cho ứng viên?
        </button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 font-bold text-white cursor-pointer bg-[#0288D1] hover:bg-[#0277bd] border-none shadow-none disabled:opacity-70"
      >
        {loading ? "Đang đăng ký..." : "Đăng ký tuyển dụng"}
      </Button>
    </form>
  );
};
