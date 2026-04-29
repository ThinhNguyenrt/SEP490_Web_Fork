import { useState, useRef } from "react";
import { Camera, User, ArrowRight, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { updateUserInfo } from "@/store/features/auth/authSlice";

const SetupTalentProfile = () => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // State thông tin text
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // State lưu file & preview
  const [avatar, setAvatar] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview: "",
  });
  const [cover, setCover] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Xử lý thay đổi ảnh
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return toast.error("Ảnh không được quá 2MB");

      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") setAvatar({ file, preview: previewUrl });
      else setCover({ file, preview: previewUrl });
    }
  };

  // Hàm Validate
  const validate = () => {
    if (!displayName.trim()) {
      toast.warn("Vui lòng nhập tên hiển thị");
      return false;
    }
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phoneNumber && !vnf_regex.test(phoneNumber)) {
      toast.warn("Số điện thoại không đúng định dạng Việt Nam");
      return false;
    }
    return true;
  };

  // Xử lý Submit
  const handleFinish = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("Name", displayName);
    formData.append("Phone", phoneNumber);
    if (avatar.file) formData.append("Avatar", avatar.file);
    if (cover.file) formData.append("CoverImage", cover.file);
    if (user?.employeeId)
      formData.append("employeeId", user.employeeId.toString());

    try {
      setLoading(true);
      const response = await fetch(
        "https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/Employee",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        // 1. Lấy dữ liệu mới từ response
        const checkResponse = await fetch(
          `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Employee/by-user/${user?.id}`,
        );
        const employeeData = await checkResponse.json();

        // 3. Cập nhật vào Redux
        // Chúng ta lấy field 'id' từ API (là 12) và gán nó vào 'employeeId' trong Redux
        dispatch(
          updateUserInfo({
            employeeId: employeeData.id,
          }),
        );
        notify.success("Thiết lập hồ sơ thành công!");
        navigate("/talent-home");
      } else {
        notify.error("Có lỗi xảy ra khi lưu thông tin");
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />

      <div className="relative z-10 bg-white w-full max-w-[420px] rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Chào mừng người mới
          </h1>
          <p className="text-[16px] text-slate-500 mt-2 leading-relaxed px-4 font-medium">
            Hãy hoàn thiện Profile để bắt đầu hành trình SkillSnap của bạn
          </p>
        </div>

        {/* Cover & Avatar Area */}
        <div className="relative h-36 shrink-0">
          <div
            className="w-full h-full bg-slate-200 bg-cover bg-center cursor-pointer relative"
            style={{ backgroundImage: `url('${cover.preview}')` }}
            onClick={() => coverInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <input
            type="file"
            hidden
            ref={coverInputRef}
            accept="image/*"
            onChange={(e) => handleImageChange(e, "cover")}
          />

          {/* Avatar */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div
              className="w-24 h-24 rounded-[2rem] border-[5px] border-white bg-slate-100 shadow-xl cursor-pointer flex items-center justify-center relative group overflow-hidden"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatar.preview ? (
                <img
                  src={avatar.preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-slate-300" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              hidden
              ref={avatarInputRef}
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-8 pt-12 space-y-4">
          {/* Field: Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Tên hiển thị *
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                placeholder="Ví dụ: An Nhiên"
              />
            </div>
          </div>

          {/* Field: Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                placeholder="09xx xxx xxx"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleFinish}
            className="w-full py-4 mt-2 bg-[#0288D1] hover:bg-[#039BE5] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
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
              <>
                HOÀN THÀNH{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupTalentProfile;
