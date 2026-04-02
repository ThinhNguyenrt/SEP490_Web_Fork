import { useState } from "react";
import { X, Lock, Eye, EyeOff, Check } from "lucide-react";
import { authAPI } from "@/services/auth.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordInput = ({
  label,
  name,
  value,
  showPassword,
  onToggle,
  onChange,
}: {
  label: string;
  name: "oldPassword" | "newPassword" | "confirmPassword";
  value: string;
  showPassword: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-500 ml-1">{label}</label>
    <div className="relative group">
      <Lock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
        size={18}
      />
      <input
        className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: "oldPassword" | "newPassword" | "confirmPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    if (!formState.oldPassword.trim()) {
      notify.error("Vui lòng nhập mật khẩu cũ");
      return false;
    }

    if (formState.oldPassword.length < 6) {
      notify.error("Mật khẩu cũ phải có ít nhất 6 ký tự");
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
      notify.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return false;
    }

    if (formState.oldPassword === formState.newPassword) {
      notify.error("Mật khẩu mới phải khác mật khẩu cũ");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (!accessToken) {
        notify.error("Access token not found. Please login again.");
        return;
      }

      console.log("💾 Changing password...");
      const result = await authAPI.changePassword(
        formState.oldPassword,
        formState.newPassword,
        accessToken,
      );

      console.log("✅ Password changed successfully");
      notify.success(result.message || "Mật khẩu đã được thay đổi thành công");

      // Reset form
      setFormState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to change password";
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-5">
          <PasswordInput
            label="Mật khẩu cũ"
            name="oldPassword"
            value={formState.oldPassword}
            showPassword={showPasswords.oldPassword}
            onToggle={() => togglePasswordVisibility("oldPassword")}
            onChange={handleInputChange}
          />

          <PasswordInput
            label="Mật khẩu mới"
            name="newPassword"
            value={formState.newPassword}
            showPassword={showPasswords.newPassword}
            onToggle={() => togglePasswordVisibility("newPassword")}
            onChange={handleInputChange}
          />

          <PasswordInput
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            value={formState.confirmPassword}
            showPassword={showPasswords.confirmPassword}
            onToggle={() => togglePasswordVisibility("confirmPassword")}
            onChange={handleInputChange}
          />

          {/* Password strength indicator */}
          {formState.newPassword && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Yêu cầu mật khẩu:</div>
              <div className="space-y-1 text-xs">
                <div className={formState.newPassword.length >= 6 ? "text-green-600" : "text-gray-400"}>
                  ✓ Ít nhất 6 ký tự
                </div>
                <div
                  className={
                    formState.newPassword !== formState.oldPassword ? "text-green-600" : "text-gray-400"
                  }
                >
                  ✓ Khác mật khẩu cũ
                </div>
                <div className={formState.newPassword === formState.confirmPassword ? "text-green-600" : "text-gray-400"}>
                  ✓ Khớp với xác nhận
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 pt-0">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full cursor-pointer bg-[#5b99fc] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            {!loading && <Check className="group-hover:translate-x-1 transition-transform" size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
