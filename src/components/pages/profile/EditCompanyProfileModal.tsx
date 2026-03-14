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
  Hash,
  Target,
  MapPin,
  FileText,
} from "lucide-react";
import { useEffect } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditCompanyProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
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
        <div className="flex items-center justify-between p-4 border-b ">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 "
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ">
              Chỉnh sửa thông tin cá nhân
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
              src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors">
                <Camera className="text-white" size={24} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="absolute bottom-4 right-4">
              <button className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-black/60 transition-colors border border-white/20">
                <Camera size={14} />
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute bottom-4 left-8">
            <div className=" group">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow-xl">
                <img
                  alt="User profile"
                  className="w-full h-full object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AnNhien"
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100 text-gray-600 ">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="pt-16 pb-6 px-8 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Tên hiển thị */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Tên hiển thị
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type="text"
                defaultValue="An Nhiên"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Mã số thuế (Readonly giống mẫu ảnh) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Mã số thuế
            </label>
            <div className="relative opacity-60">
              <Hash
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl text-gray-500 cursor-not-allowed outline-none"
                disabled
                type="text"
                value="0123456789"
              />
              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Lĩnh vực */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Lĩnh vực
            </label>
            <div className="relative group">
              <Target
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none"
                type="text"
                defaultValue="CNTT"
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
                defaultValue="TP Hồ Chí Minh"
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
              Mô tả
            </label>
            <div className="relative group">
              <FileText
                className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <textarea
                rows={4}
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 transition-all outline-none resize-none"
                defaultValue="Google Inc. là một công ty của Mỹ, có trụ sở tại Mountain View, California, chuyên về các dịch vụ internet, nổi bật nhất là công cụ tìm kiếm."
              />
              <Edit3
                className="absolute right-4 top-4 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Email
            </label>
            <div className="relative opacity-60">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl text-gray-500 cursor-not-allowed outline-none underline decoration-gray-400 underline-offset-4"
                disabled
                type="email"
                value="hihihaha@gmail.com"
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
            onClick={onClose}
            className="w-full cursor-pointer bg-[#5b99fc] hover:bg-[#4a88eb] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Lưu thay đổi
            <Check
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyProfileModal;