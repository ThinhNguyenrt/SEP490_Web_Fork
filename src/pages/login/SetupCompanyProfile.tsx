import { useState, useRef } from "react";
import {
  Camera,
  Building2,
  ArrowRight,
  MapPin,
  FileText,
  Hash,
} from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { updateUserInfo } from "@/store/features/auth/authSlice";
import { useDispatch } from "react-redux";

const SetupCompanyProfile = () => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. State thông tin text (Khớp với Swagger)
  const [companyName, setCompanyName] = useState("");
  const [activityField, setActivityField] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  // 2. State lưu file & preview
  const [avatar, setAvatar] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview: "",
  });
  const [cover, setCover] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return notify.error("Ảnh không được quá 2MB");
      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") setAvatar({ file, preview: previewUrl });
      else setCover({ file, preview: previewUrl });
    }
  };

  const validate = () => {
    if (!companyName.trim()) {
      notify.warning("Vui lòng nhập tên công ty");
      return false;
    }
    if (!activityField.trim()) {
      notify.warning("Vui lòng nhập lĩnh vực hoạt động");
      return false;
    }
    if (isNaN(Number(taxId)) || taxId.trim() === "") {
      notify.warning("Mã số thuế phải là một dãy số");
      return false;
    }
    return true;
  };

  const handleFinish = async () => {
    if (!validate()) return;

    const formData = new FormData();
    // Đóng gói data chuẩn theo Key trong Swagger
    formData.append("CompanyName", companyName);
    formData.append("ActivityField", activityField);
    formData.append("TaxIdentification", taxId); // Backend nhận int32, gửi string số vẫn OK
    formData.append("Address", address);
    formData.append("Description", description);

    if (avatar.file) formData.append("Avatar", avatar.file);
    if (cover.file) formData.append("CoverImage", cover.file);

    // Gửi ID của user để liên kết (nếu backend yêu cầu)
    if (user?.id) formData.append("UserId", user.id.toString());

    try {
      setLoading(true);
      const response = await fetch(
        `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Company`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        },
      );

      if (response.ok) {
        // 1. Lấy dữ liệu mới từ response
        const checkResponse = await fetch(
          `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Company/by-user/${user?.id}`,
        );
        const companyData = await checkResponse.json();

        // 3. Cập nhật vào Redux
        // Chúng ta lấy field 'id' từ API (là 12) và gán nó vào 'companyId' trong Redux
        dispatch(
          updateUserInfo({
            companyId: companyData.id,
          }),
        );
        notify.success("Thiết lập hồ sơ công ty thành công!");
        navigate("/recruiter-home");
      } else {
        notify.error("Không thể lưu thông tin công ty. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6  no-scrollbar">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />

      <div className="relative z-10 bg-white w-full max-w-[480px] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col my-8">
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Thông tin doanh nghiệp
          </h1>
          <p className="text-[16px] text-slate-500 mt-2 font-medium">
            Xây dựng uy tín thương hiệu để thu hút nhân tài
          </p>
        </div>

        {/* Cover & Avatar */}
        <div className="relative h-36 shrink-0 z-50 sticky">
          <div
            className="w-full h-full bg-slate-200 bg-cover bg-center cursor-pointer relative"
            style={{ backgroundImage: `url('${cover.preview}')` }}
            onClick={() => coverInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-tighter">
              <Camera size={20} />
            </div>
          </div>
          <input
            type="file"
            hidden
            ref={coverInputRef}
            accept="image/*"
            onChange={(e) => handleImageChange(e, "cover")}
          />

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div
              className="w-28 h-28 rounded-[2rem] border-[5px] border-white bg-slate-100 shadow-xl cursor-pointer flex items-center justify-center relative group overflow-hidden"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatar.preview ? (
                <img
                  src={avatar.preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={32} className="text-slate-300" />
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

        {/* Scrollable Content Area */}
        <div className="p-8 pt-12 space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Tên công ty *
            </label>
            <div className="relative group">
              <Building2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                placeholder="SkillSnap Corp"
              />
            </div>
          </div>

          {/* Activity Field & Tax ID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Lĩnh vực *
              </label>
              <input
                type="text"
                value={activityField}
                onChange={(e) => setActivityField(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                placeholder="Công nghệ"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Mã số thuế *
              </label>
              <div className="relative group">
                <Hash
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                  size={14}
                />
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                  placeholder="12345..."
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Địa chỉ
            </label>
            <div className="relative group">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10"
                placeholder="Hồ Chí Minh, Việt Nam"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mô tả công ty
            </label>
            <div className="relative group">
              <FileText
                className="absolute left-4 top-4 text-slate-300"
                size={16}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none"
                placeholder="Hãy viết vài dòng về doanh nghiệp..."
              />
            </div>
          </div>
        </div>

        {/* Footer Submit */}
        <div className="p-8 pt-4">
          <button
            disabled={loading}
            onClick={handleFinish}
            className="w-full py-4 bg-[#0288D1] hover:bg-[#039BE5] text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group cursor-pointer"
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
                HOÀN TẤT SETUP{" "}
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

export default SetupCompanyProfile;
