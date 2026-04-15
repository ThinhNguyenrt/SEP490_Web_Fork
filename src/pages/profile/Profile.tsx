import {
  FileText,
  Users,
  Bookmark,
  ChevronRight,
  HelpCircle,
  Lock,
  Info,
  Key,
  LogOut,
  Award,
  Calendar,
  Briefcase,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { type ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { portfolioService } from "@/services/portfolio.api";
import TalentProfile from "./TalentProfile";
import { logout } from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hook";
import ChangePasswordModal from "./ChangePasswordModal";
import { type PortfolioResponse, type PortfolioBlock } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import BlockRenderer from "@/components/portfolio/render/BlockRenderer";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  // Fetch portfolio on component mount
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.employeeId || !accessToken) {
        return;
      }

      setIsPortfolioLoading(true);
      setPortfolioError(null);
      try {
        const data = await portfolioService.fetchMainPortfolioByEmployeeId(
          user.employeeId,
          accessToken,
        );
        setPortfolio(data || null);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setPortfolioError(error instanceof Error ? error.message : "Failed to load portfolio");
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    fetchPortfolio();
  }, [user?.employeeId, accessToken]);

  const handlePortfolioClick = async () => {
    try {
      const userId = 2; // Mock user ID
      const portfolios =
        await portfolioService.fetchMainPortfoliosManagerByUser(userId);

      if (portfolios && portfolios.length > 0) {
        navigate("/portfolioManagement");
      } else {
        navigate("/emptyPortfolio");
      }
    } catch (error) {
      console.error("Error checking portfolios:", error);
      navigate("/emptyPortfolio");
    }
  };

  const handleCommunityPostClick = () => {
    navigate("/my-community-posts");
  };

  const handleApplicationHistoryClick = () => {
    navigate("/application-history");
  };

  const handleSavedClick = () => {
    navigate("/talent-saved");
  };
  const handleApplicationManagementClick = () => {
    navigate("/application-management");
  };

  const handleSupportCenterClick = () => {
    navigate("/support-center");
  };

  const handlePrivacyCenterClick = () => {
    navigate("/privacy-center");
  };

  const handleTermsPolicyClick = () => {
    navigate("/terms-policy");
  };

  const handleLogout = () => {
    // Clear any stored authentication data if needed
    // localStorage.removeItem('token');
    dispatch(logout());
    notify.success("Đã đăng xuất. Hẹn gặp lại bạn!");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500 ">
      <TalentProfile />
      {/* <CompanyProfile /> */}
      {/* CỘT GIỮA - Main Profile & Services */}
      <div className="lg:col-span-6 space-y-6">
        <PortfolioIntroCard
          portfolio={portfolio}
          isLoading={isPortfolioLoading}
          isExpanded={isPortfolioExpanded}
          setIsExpanded={setIsPortfolioExpanded}
          error={portfolioError}
        />
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Quản lý hồ sơ"
            desc="Cập nhật hồ sơ của bạn"
            onClick={handlePortfolioClick}
          />
          <ServiceCard
            icon={<Users className="text-blue-600" />}
            title="Bài đăng cộng đồng"
            desc="Hoạt động cộng đồng"
            onClick={handleCommunityPostClick}
          />
          <ServiceCard
            icon={<Briefcase className="text-blue-600" />}
            title="Quản lí ứng tuyển"
            desc="Quản lí, theo dõi ứng tuyển"
            onClick={handleApplicationHistoryClick}
          />
          <ServiceCard
            icon={<Bookmark className="text-blue-600" />}
            title="Quan tâm"
            desc="Danh sách đã lưu"
            onClick={handleSavedClick}
          />
          <ServiceCard
            icon={<Calendar className="text-blue-600" />}
            title="Quản lý lịch phỏng vấn"
            desc="Quản lý, theo dõi lịch trình phỏng vấn"
            onClick={handleApplicationManagementClick}
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
        <div className="sticky top-16 z-20">
          <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-6 bg-white">
            <h3 className="font-bold text-xl text-slate-800 mb-6 border-b-2 border-slate-100 pb-2">
              Cài đặt & hỗ trợ
            </h3>
            <div className="space-y-3">
              <SettingsItem
                icon={<HelpCircle size={18} />}
                label="Trung tâm hỗ trợ"
                onClick={handleSupportCenterClick}
              />
              <SettingsItem
                icon={<Lock size={18} />}
                label="Trung tâm quyền riêng tư"
                onClick={handlePrivacyCenterClick}
              />
              <SettingsItem
                icon={<Info size={18} />}
                label="Điều khoản & chính sách"
                onClick={handleTermsPolicyClick}
              />
              <SettingsItem
                icon={<Key size={18} />}
                label="Đổi mật khẩu"
                onClick={() => setIsChangePasswordModalOpen(true)}
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
      </div>

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
  icon?: ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className="border-2 border-slate-200 bg-white rounded-2xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
      onClick={onClick}
    >
      <CardContent className={icon ? "p-6 space-y-3" : "p-6"}>
        {icon ? (
          <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
            {icon}
          </div>
        ) : null}
        <div>
          <h4 className="font-bold text-slate-800 text-[15px]">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PortfolioIntroCard({
  portfolio,
  isLoading,
  isExpanded,
  setIsExpanded,
  error,
}: {
  portfolio: PortfolioResponse | null;
  isLoading: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  error: string | null;
}) {
  // Find intro block
  const introBlock = portfolio?.blocks?.find((block: PortfolioBlock) => block.type === "INTRO");

  // Get all non-intro blocks for expanded view
  const otherBlocks = portfolio?.blocks?.filter((block: PortfolioBlock) => block.type !== "INTRO") || [];

  if (isLoading) {
    return (
      <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-8 bg-white">
        <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error || !portfolio || !introBlock) {
    return (
      <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-8 bg-white">
        <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
          <p className="text-slate-500 text-sm">{error || "Không thể tải portfolio"}</p>
        </CardContent>
      </Card>
    );
  }

  // If expanded, show all blocks using PortfolioRenderer
  if (isExpanded && portfolio.blocks && portfolio.blocks.length > 0) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <PortfolioRenderer blocks={portfolio.blocks} />
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors cursor-pointer"
          >
            Thu gọn
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Collapsed view - render only the intro block with its actual variant styling
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-x-hidden">
        <BlockRenderer block={introBlock} />
      </div>

      {/* Show "Xem thêm" button only if there are other blocks */}
      {otherBlocks.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors cursor-pointer"
          >
            Xem thêm
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function SettingsItem({
  icon,
  label,
  isDanger,
  onClick,
}: {
  icon: ReactNode;
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
