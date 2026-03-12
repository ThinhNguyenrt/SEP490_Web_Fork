import { Home, Users, MessageSquare, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAppSelector } from "@/store/hook";

export function Header() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Xác định trang home dựa trên role
  const homeHref = user?.role === 'recruiter' ? '/recruiter-home' : '/talent-home';
  
  // Xác định trang profile dựa trên role
  const profileHref = user?.role === 'recruiter' ? '/recruiter-profile' : '/profile';

  // Danh sách các tab điều hướng trung tâm
  const navItems = [
    { icon: Home, label: "Trang chủ", href: homeHref },
    { icon: Users, label: "Cộng đồng", href: "/community" },
    { icon: MessageSquare, label: "Tin nhắn", href: "/chat" },
    { icon: Bell, label: "Thông báo", href: "/notification" },
  ];

  return (
    <header className="h-20 border-b border-slate-100 bg-white px-8 flex items-center justify-between transition-colors sticky top-0 z-50">
      
      {/* 1. Logo Section (Bên trái) */}
      <div className="flex items-center gap-2 min-w-37.5">
        <img 
          src="/product-logo.png" 
          alt="SkillSnap" 
          className="h-16 w-auto object-contain" 
        />
      </div>

      {/* 2. Navigation Tabs (Trung tâm) */}
      <nav className="flex items-center gap-4 bg-slate-50/50 p-1.5 rounded-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.label === "Trang chủ" && (location.pathname === "/talent-home" || location.pathname === "/recruiter-home"));
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm font-semibold"
                  : "text-slate-500 hover:bg-white hover:text-slate-700 "
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. User Section (Bên phải) */}
      <div className="flex items-center justify-end min-w-37.5">
        <Link to={profileHref} className="flex items-center gap-4 cursor-pointer group p-1 pr-2 rounded-full hover:bg-slate-50 transition-all">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:ring-4 group-hover:ring-blue-500/10 transition-all">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </Link>
      </div>
      
    </header>
  );
}