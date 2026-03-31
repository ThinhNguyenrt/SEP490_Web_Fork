import { Home, Users, MessageSquare, Bell, Library } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy user từ store
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<{
    name?: string;
    avatar?: string;
    coverImage?: string;
  } | null>(null);
  const isLoggedIn = !!user; // Kiểm tra xem user có tồn tại không
// 1. Hàm gọi API lấy Profile
  const fetchUserProfile = async () => {
    if (!user?.employeeId) return;
    
    try {
      // Thay URL bằng API thật của bạn
      const response = await fetch(`https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Employee/${user.employeeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy avatar:", error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn, user?.employeeId]);
  // Xác định trang home/profile dựa trên role
  const homeHref =
    user?.role === 2 ? "/recruiter-home" : "/talent-home";
  const profileHref =
    user?.role === 2 ? "/recruiter-profile" : "/profile";

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
        <Link to="/">
          <img
            src="/product-logo.png"
            alt="SkillSnap"
            className="h-16 w-auto object-contain cursor-pointer"
          />
        </Link>
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
              <span className="text-[16px] tracking-tight group-hover:text-blue-500">{item.label}</span>
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
                {profile?.name}
              </p>
            </div>
            {/* <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-blue-500/30 transition-all">
              <AvatarImage src={user.avatar || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar> */}
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:ring-4 group-hover:ring-blue-500/10 transition-all">
              <AvatarImage src={profile?.avatar} alt="/user_placeholder.png" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
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
