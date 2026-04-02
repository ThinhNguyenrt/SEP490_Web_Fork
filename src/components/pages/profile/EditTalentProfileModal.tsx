import {
  X,
  ArrowLeft,
  Camera,
  User,
  PhoneIcon,
  Mail,
  Lock,
  Check,
  Edit3,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { EmployeeProfile, profileService } from "@/services/profile.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: EmployeeProfile | null;
  onProfileUpdated?: (profile: EmployeeProfile) => void;
}

const EditTalentProfileModal = ({ isOpen, onClose, initialProfile, onProfileUpdated }: EditProfileModalProps) => {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    coverImage: "",
    avatar: "",
  });
  const [previewState, setPreviewState] = useState({
    coverImage: "",
    avatar: "",
  });
  const [fileState, setFileState] = useState({
    avatarFile: null as File | null,
    coverImageFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with profile data
  useEffect(() => {
    if (initialProfile) {
      setFormState({
        name: initialProfile.name || "",
        phone: initialProfile.phone || "",
        coverImage: initialProfile.coverImage || "",
        avatar: initialProfile.avatar || "",
      });
      setPreviewState({
        coverImage: initialProfile.coverImage || "",
        avatar: initialProfile.avatar || "",
      });
      console.log("📝 Form initialized with profile:", initialProfile);
    }
  }, [initialProfile, isOpen]);

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
    console.log("📝 Form field changed:", { [name]: value });
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("📸 Cover image selected:", file.name, file.size);
      setFileState((prev) => ({
        ...prev,
        coverImageFile: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setPreviewState((prev) => ({
          ...prev,
          coverImage: preview,
        }));
        console.log("👁️ Cover image preview created");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("📸 Avatar image selected:", file.name, file.size);
      setFileState((prev) => ({
        ...prev,
        avatarFile: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setPreviewState((prev) => ({
          ...prev,
          avatar: preview,
        }));
        console.log("👁️ Avatar preview created");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!accessToken) {
        notify.error("Access token not found. Please login again.");
        return;
      }

      if (!initialProfile?.id) {
        notify.error("Profile ID not found. Please reload and try again.");
        return;
      }

      console.log("💾 Saving profile changes...");
      console.log("🔍 Using profile ID:", initialProfile.id);
      const result = await profileService.updateEmployeeProfile(
        initialProfile.id,
        accessToken,
        {
          name: formState.name || undefined,
          phone: formState.phone || undefined,
          avatarFile: fileState.avatarFile || undefined,
          coverImageFile: fileState.coverImageFile || undefined,
        },
      );
      console.log("✅ Profile updated successfully:", result);
      
      // Reset file state after successful save
      setFileState({
        avatarFile: null,
        coverImageFile: null,
      });
      setPreviewState({
        coverImage: "",
        avatar: "",
      });

      // Notify parent component with updated profile
      if (onProfileUpdated && result) {
        onProfileUpdated(result);
      }

      notify.success("Thông tin cá nhân đã được cập nhật");
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to update profile";
      console.error("❌ Error updating profile:", errorMsg);
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayCoverImage = previewState.coverImage || formState.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000";
  const displayAvatar = previewState.avatar || formState.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=AnNhien";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white  w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b ">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100  rounded-full transition-colors text-gray-700 "
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ">
              Chỉnh sửa thông tin cá nhân
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100  rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Images Section (Banner & Avatar) */}
        <div className="relative">
          {/* Banner */}
          <div className="h-44 w-full bg-gray-200  relative group overflow-hidden">
            <img
              alt="Profile Banner"
              className="w-full h-full object-cover"
              src={displayCoverImage}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors">
                <Camera className="text-white" size={24} />
                <input 
                  ref={coverImageInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                />
              </label>
            </div>
            <div className="absolute bottom-4 right-4">
              <button 
                onClick={() => coverImageInputRef.current?.click()}
                className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-black/60 transition-colors border border-white/20"
              >
                <Camera size={14} />
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white  overflow-hidden bg-gray-300 shadow-xl">
                <img
                  alt="User profile"
                  className="w-full h-full object-cover"
                  src={displayAvatar}
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-white  p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100 text-gray-600 ">
                <Camera size={18} />
                <input 
                  ref={avatarInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarSelect}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="pt-16 pb-6 px-8 space-y-5">
          {/* Tên hiển thị */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500  ml-1">
              Tên hiển thị
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100  border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900  transition-all outline-none"
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500  ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <PhoneIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100  border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900  transition-all outline-none"
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={handleInputChange}
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500  ml-1">
              Email
            </label>
            <div className="relative opacity-60">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100  border-none rounded-xl text-gray-500  cursor-not-allowed outline-none"
                disabled
                type="email"
                value={formState.name || "email@gmail.com"}
              />
              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full cursor-pointer bg-[#5b99fc] hover:bg-[#5b99fc] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
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
  );
};

export default EditTalentProfileModal;
