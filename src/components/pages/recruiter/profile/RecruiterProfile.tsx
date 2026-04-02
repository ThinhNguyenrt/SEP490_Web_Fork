import {
  Calendar,
  Users,
  Bookmark,
  ChevronRight,
  HelpCircle,
  Lock,
  Info,
  Key,
  LogOut,
  Award,
  Edit3,
  Building2,
  MapPin,
  FileText,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hook";
import { logout } from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";
import EditRecruiterProfileModal from "./EditRecruiterProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useEffect, useState } from "react";

export default function RecruiterProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // Profile state
  const [profile, setProfile] = useState<{
    activityField?: string;
    companyName?: string;
    avatar?: string;
    coverImage?: string;
    taxIdentification?: string;
    address?: string;
    description?: string;
  } | null>(null);

  // Initialize with default data - fetch from API will happen via modal when user edits
  useEffect(() => {
    const defaultProfile = {
      companyName: "Google",
      activityField: "Công nghệ thông tin",
      address: "TP Hồ Chí Minh",
      description:
        "Google Inc. là một công ty công nghệ đa quốc gia chuyên về các dịch vụ và sản phẩm Internet, tìm kiếm trực tuyến và công nghệ quảng cáo.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
      coverImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
    };
    setProfile(defaultProfile);
  }, []);

  const handleInterviewScheduleClick = () => {
    // Navigate to interview schedule management
    console.log("Navigate to interview schedule");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileUpdated = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handlePortfolioClick = () => {
    navigate("/recruitment-management");
  };

  const handleCommunityPostClick = () => {
    navigate("/my-community-posts");
  };

  const handleApplicationManagementClick = () => {
    navigate("/application-management");
  };

  const handleInterestClick = () => {
    // Navigate to saved/interested items
    console.log("Navigate to saved items");
  };

  const handleHRManagementClick = () => {
    // Navigate to HR management
    console.log("Navigate to HR management");
  };

  const handleLogout = () => {
    // Clear any stored authentication data if needed
    // localStorage.removeItem('token');
    dispatch(logout());
    notify.success("Đã đăng xuất. Hẹn gặp lại bạn!");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* CỘT TRÁI - Company Introduction */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div className="h-32 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500')] bg-cover bg-center relative border-b-2 border-slate-200">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=google" />
                <AvatarFallback>GG</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-12 pb-6 px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="font-bold text-lg text-slate-800 text-center">
                Google
              </h3>
              <button onClick={handleEditProfile}>
                <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                  <Edit3
                    size={12}
                    className="text-slate-400 group-hover:text-blue-500"
                  />
                </div>
              </button>
            </div>

            {/* Company Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 min-w-0">
                <Building2 size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  Lĩnh vực: Tên lĩnh vực hoạt động của công ty
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 min-w-0">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">TP Hồ Chí Minh</span>
              </div>
            </div>

            {/* Introduction */}
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Inc. là một công ty công nghệ đa quốc gia chuyên về các
              dịch vụ và sản phẩm Internet, tìm kiếm trực tuyến và công nghệ
              quảng cáo.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CỘT GIỮA - Main Profile & Services */}
      <div className="lg:col-span-6 space-y-6">
        {/* Quick Actions Grid - 6 items */}
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Quản lý hồ sơ"
            desc="Cập nhật hồ sơ của bạn"
            onClick={handlePortfolioClick}
          />
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Bài đăng cộng đồng"
            desc="Hoạt động cộng đồng"
            onClick={handleCommunityPostClick}
          />
          <ServiceCard
            icon={<Briefcase className="text-blue-600" />}
            title="Quản lý ứng tuyển"
            desc="Quản lý các yêu cầu ứng tuyển"
            onClick={handleApplicationManagementClick}
          />
          <ServiceCard
            icon={<Bookmark className="text-blue-600" />}
            title="Quan tâm"
            desc="Danh sách đã lưu"
            onClick={handleInterestClick}
          />
          <ServiceCard
            icon={<Calendar className="text-blue-600" />}
            title="Quản lý lịch phỏng vấn"
            desc="Quản lý, theo dõi lịch trình phỏng vấn"
            onClick={handleInterviewScheduleClick}
          />
          <ServiceCard
            icon={<Users className="text-blue-600" />}
            title="Nhân sự"
            desc="Quản lý nhân sự"
            onClick={handleHRManagementClick}
          />
        </div>

        {/* Premium Banner */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-2xl cursor-pointer hover:bg-blue-50/30 transition-all bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                <Award className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                  Gói Premium của tôi
                </h4>
                <p className="text-sm text-blue-600 font-bold">
                  Nâng cấp để mở khóa thêm các tính năng
                </p>
              </div>
            </div>
            <ChevronRight className="text-slate-400" />
          </CardContent>
        </Card>
      </div>

      {/* CỘT PHẢI - Settings & Support */}
      <div className="lg:col-span-3">
        <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-6 bg-white">
          <h3 className="font-bold text-xl text-slate-800 mb-6 border-b-2 border-slate-100 pb-2">
            Cài đặt & hỗ trợ
          </h3>
          <div className="space-y-3">
            <SettingsItem
              icon={<HelpCircle size={18} />}
              label="Trung tâm hỗ trợ"
            />
            <SettingsItem
              icon={<Lock size={18} />}
              label="Trung tâm quyền riêng tư"
            />
            <SettingsItem
              icon={<Info size={18} />}
              label="Điều khoản & chính sách"
            />
            <SettingsItem
              icon={<Key size={18} />}
              label="Đổi mật khẩu"
              onClick={handleChangePassword}
            />
            <SettingsItem
              icon={<LogOut size={18} />}
              label="Đăng xuất"
              isDanger
              onClick={handleLogout}
            />
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-12">
            SkillSnap Desktop V1.0.2
          </p>
        </Card>
      </div>

      {/* Modals */}
      <EditRecruiterProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        companyId={user?.companyId || ""}
        initialProfile={profile}
        onProfileUpdated={handleProfileUpdated}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className="border-2 border-slate-200 bg-[#EFF6FF] rounded-2xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-3">
        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-[15px]">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsItem({
  icon,
  label,
  isDanger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isDanger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-blue-200 hover:bg-slate-50 transition-all bg-white"
      onClick={onClick}
    >
      <div
        className={`flex items-center gap-3 ${isDanger ? "text-red-500" : "text-slate-700"} font-bold text-sm`}
      >
        <span className={isDanger ? "text-red-400" : "text-slate-400"}>
          {icon}
        </span>
        {label}
      </div>
      <ChevronRight className="text-slate-300" size={16} />
    </div>
  );
}