import { Home, Users, MessageSquare, Bell, Library } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { useUserProfile } from "@/hook/useUserProfile";
import { notify } from "@/lib/toast";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoggedIn } = useUserProfile();

  // Xác định trang home/profile dựa trên role
  const homeHref = user?.role === 2 ? "/recruiter-home" : "/talent-home";
  const profileHref = user?.role === 2 ? "/recruiter-profile" : "/profile";

  // Xử lý click vào logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      notify.warning("Vui lòng đăng nhập để vào trang chủ");
      navigate("/login");
      return;
    }
    
    // Nếu đã login, chuyển đến trang home
    navigate(homeHref);
  };

  // Danh sách các tab điều hướng trung tâm
  const allNavItems = [
    { icon: Library, label: "Giới thiệu", href: "/", public: true },
    { icon: Home, label: "Trang chủ", href: homeHref, public: false },
    { icon: Users, label: "Cộng đồng", href: "/community", public: false },
    { icon: MessageSquare, label: "Tin nhắn", href: "/chat", public: false },
    { icon: Bell, label: "Thông báo", href: "/notification", public: false },
  ];

  // Lọc items: Nếu chưa login chỉ hiện các item có public: true
  const visibleNavItems = allNavItems.filter(
    (item) => isLoggedIn || item.public,
  );

  return (
    <header className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between sticky top-0 z-50">
      {/* 1. Logo Section */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
          title={isLoggedIn ? "Về trang chủ" : "Đăng nhập để tiếp tục"}
        >
          <img
            src="/product-logo.png"
            alt="SkillSnap"
            className="h-16 w-auto object-contain"
          />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <nav className="flex items-center gap-2 bg-slate-50/80 p-1 rounded-2xl border border-slate-100">
        {visibleNavItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.label === "Trang chủ" &&
              (location.pathname === "/talent-home" ||
                location.pathname === "/recruiter-home"));

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-white text-blue-600 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-blue-500",
                )}
              />
              <span className="text-[16px] tracking-tight group-hover:text-blue-500">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 3. User Section (Conditional Rendering) */}
      <div className="flex items-center justify-end min-w-[150px]">
        {isLoggedIn ? (
          /* TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP */
          <Link
            to={profileHref}
            className="flex items-center gap-3 group p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            <div className="text-right hidden md:block">
              <p className="text-[16px] font-black text-slate-800 leading-none">
                {profile?.displayName}
              </p>
            </div>

            {/* Bọc Avatar vào một div relative inline-block để định vị tick xanh */}
            <div className="relative inline-block">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:ring-4 group-hover:ring-blue-500/10 transition-all object-cover rounded-full">
                <AvatarImage
                  src={profile?.avatar || "/user_placeholder.png"}
                  alt={profile?.displayName || "User"}
                  // Đảm bảo ảnh cover hết diện tích hình tròn
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-sm">
                  {/* Tự động lấy 2 chữ cái đầu của tên */}
                  {profile?.displayName?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>

              {/* Hiển thị tick xanh tuyệt đối: Phải - Dưới nếu role là COMPANY */}
              {user?.companyId === 2 && (
                <div className="absolute -bottom-0.5 -right-0.5 transform">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    // w-4 h-4 là kích thước cân đối nhất cho Avatar w-10
                    className="w-4 h-4 bg-white rounded-full border border-white shadow-sm"
                  />
                </div>
              )}
            </div>
          </Link>
        ) : (
          /* TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP */
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-100 transition-all active:scale-95 cursor-pointer"
          >
            <span className="text-[13px] font-black text-slate-600 group-hover:text-blue-600 uppercase tracking-wider">
              Đăng nhập
            </span>
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:rotate-12 transition-transform">
              <img
                src="/user_placeholder.png"
                alt="Guest"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
