import {
  X,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { notify } from "@/lib/toast";
import { useAppSelector } from "@/store/hook";
import { authAPI } from "@/services/auth.api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [formState, setFormState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formState.currentPassword.trim()) {
      notify.error("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }

    if (!formState.newPassword.trim()) {
      notify.error("Vui lòng nhập mật khẩu mới");
      return false;
    }

    if (formState.newPassword.length < 6) {
      notify.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      notify.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (formState.currentPassword === formState.newPassword) {
      notify.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setLoading(true);

      if (!accessToken) {
        notify.error("Token không hợp lệ. Vui lòng đăng nhập lại");
        return;
      }

      console.log("🔄 Changing password...");

      const result = await authAPI.changePassword(
        formState.currentPassword,
        formState.newPassword,
        accessToken
      );

      notify.success(result.message || "Mật khẩu đã được thay đổi thành công!");
      console.log("✅ Password changed successfully");

      // Reset form
      setFormState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Không thể đổi mật khẩu";
      console.error("❌ Error changing password:", errorMsg);
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Đổi mật khẩu
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-8 space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Mật khẩu hiện tại
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formState.currentPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Mật khẩu mới
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formState.newPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
              <button
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>
            {formState.newPassword && formState.newPassword.length < 6 && (
              <p className="text-xs text-red-500 ml-1">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>
            {formState.confirmPassword &&
              formState.newPassword !== formState.confirmPassword && (
                <p className="text-xs text-red-500 ml-1">
                  Mật khẩu không khớp
                </p>
              )}
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-700">
              💡 <strong>Lưu ý:</strong> Mật khẩu phải ít nhất 6 ký tự. Sau khi
              thay đổi, bạn cần đăng nhập lại.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0 border-t">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="flex-1 cursor-pointer bg-[#5b99fc] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              {!loading && (
                <Check
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
