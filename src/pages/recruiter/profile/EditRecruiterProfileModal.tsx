import {
  X,
  ArrowLeft,
  Camera,
  User,
  Check,
  Edit3,
  Target,
  MapPin,
  FileText,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { notify } from "@/lib/toast";
import { useAppSelector } from "@/store/hook";
import { profileService } from "@/services/profile.api";
import { Company } from "@/types/company";

interface EditRecruiterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number | string;
  initialProfile?: Partial<Company> | null;
  onProfileUpdated?: (profile: Partial<Company>) => void;
}

const EditRecruiterProfileModal = ({
  isOpen,
  onClose,
  companyId,
  initialProfile,
  onProfileUpdated,
}: EditRecruiterProfileModalProps) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    companyName: "",
    activityField: "",
    address: "",
    description: "",
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
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with profile data
  useEffect(() => {
    if (initialProfile) {
      setFormState({
        companyName: initialProfile.companyName || "",
        activityField: initialProfile.activityField || "",
        address: initialProfile.address || "",
        description: initialProfile.description || "",
      });
      setPreviewState({
        coverImage: initialProfile.coverImage || "",
        avatar: initialProfile.avatar || "",
      });
      console.log("📝 Form initialized with recruiter profile:", initialProfile);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

      if (!formState.companyName.trim()) {
        notify.error("Vui lòng nhập tên công ty");
        return;
      }

      if (!accessToken) {
        notify.error("Token không hợp lệ. Vui lòng đăng nhập lại");
        return;
      }

      if (!companyId) {
        notify.error("Không lấy được ID công ty. Vui lòng đăng nhập lại");
        return;
      }

      console.log("💾 Saving recruiter profile changes...");
      console.log("📦 Form state:", formState);
      console.log("📦 Files:", fileState);

      const updatedProfile = await profileService.updateCompanyProfile(
        companyId,
        accessToken,
        {
          companyName: formState.companyName,
          activityField: formState.activityField,
          address: formState.address,
          description: formState.description,
          avatarFile: fileState.avatarFile || undefined,
          coverImageFile: fileState.coverImageFile || undefined,
        }
      );

      console.log("✅ Profile updated successfully:", updatedProfile);

      notify.success("Thông tin công ty đã được cập nhật");

      if (onProfileUpdated) {
        onProfileUpdated({
          ...initialProfile,
          ...formState,
          coverImage: previewState.coverImage || initialProfile?.coverImage,
          avatar: previewState.avatar || initialProfile?.avatar,
        });
      }

      setFileState({
        avatarFile: null,
        coverImageFile: null,
      });
      setPreviewState({
        coverImage: "",
        avatar: "",
      });

      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Không thể cập nhật profile";
      console.error("❌ Error updating profile:", errorMsg);
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const displayCoverImage =
    previewState.coverImage ||
    initialProfile?.coverImage ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000";

  const displayAvatar =
    previewState.avatar ||
    initialProfile?.avatar ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

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
              Chỉnh sửa thông tin công ty
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Images Section (Banner & Avatar) */}
        <div className="relative">
          {/* Banner */}
          <div className="h-44 w-full bg-gray-200 relative group overflow-hidden">
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
          <div className="absolute bottom-4 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-xl">
                <img
                  alt="Company logo"
                  className="w-full h-full object-cover"
                  src={displayAvatar}
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100 text-gray-600">
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
        <div className="pt-16 pb-6 px-8 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Tên công ty */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Tên công ty
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type="text"
                name="companyName"
                value={formState.companyName}
                onChange={handleInputChange}
                placeholder="Nhập tên công ty"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Lĩnh vực hoạt động */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Lĩnh vực hoạt động
            </label>
            <div className="relative group">
              <Target
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type="text"
                name="activityField"
                value={formState.activityField}
                onChange={handleInputChange}
                placeholder="Ví dụ: Công nghệ thông tin"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Địa chỉ
            </label>
            <div className="relative group">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type="text"
                name="address"
                value={formState.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ công ty"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Mô tả về công ty
            </label>
            <div className="relative group">
              <FileText
                className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <textarea
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none resize-none"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Mô tả về công ty của bạn..."
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full cursor-pointer bg-[#5b99fc] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
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

export default EditRecruiterProfileModal;
