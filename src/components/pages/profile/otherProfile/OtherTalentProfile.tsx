import { useEffect, useState } from "react";
import { OthersPortfolio } from "./OthersPortfolio";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  FolderKanban,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { OthersCommunityPost } from "./OthersCommunityPost";
interface Talent {
  id: number;
  userId: number;
  email: string;
  status: string;
  createAt: string;
  name: string;
  phone: string;
  coverImage: string;
  avatar: string;
}
const tabs = [
  { id: "Portfolio", label: "Hồ sơ năng lực", icon: FolderKanban },
  { id: "Community", label: "Bài đăng cộng đồng", icon: MessageSquare },
];
// ... (các import cần thiết)
export default function OtherTalentProfilePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("Portfolio");
  const [profile, setProfile] = useState<Talent>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await fetch(
          `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Employee/by-user/${userId}`,
        );
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!profile || !userId) return <div>Không tìm thấy người dùng</div>;

  return (
    <div className="min-h-screen p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 1. Nút quay lại & 2. Card Profile Header (Giữ nguyên phần UI của bạn) */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm group cursor-pointer mb-4"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Quay lại
        </button>
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white relative z-0 overflow-visible mb-4">
          <div className="relative group rounded-[2.5rem] overflow-hidden mb-4 h-80">
            {profile.coverImage ? (
              <img
                src={profile.coverImage}
                className="w-full h-full object-cover rounded-[2.5rem]"
                alt="cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 relative group rounded-[2.5rem] flex items-center justify-center">
                <span className="text-blue-600 font-bold">No cover image</span>
              </div>
            )}

            {/* Avatar Section - Trùng lên ảnh bìa */}

            <div className="absolute bottom-2 left-8 z-10">
              <div className="relative group/avatar">
                <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white bg-slate-100 shadow-xl shadow-slate-200 overflow-hidden">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-[2.5rem]">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="pt-8 pb-8 px-8 lg:px-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {profile.name}
              </h1>

              <p className="text-blue-600 font-bold flex items-center gap-2">
                <Briefcase size={16} />
                Ứng viên
              </p>

              <div className="flex flex-wrap gap-4 text-slate-400 text-sm font-semibold pt-2">
                <div className="flex items-center gap-1.5">
                  <Mail size={16} /> {profile.email}
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={16} /> {profile.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 relative z-0">
              <button className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer">
                Nhắn tin
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Tab Switcher */}
        <div className="flex flex-col gap-6">
          <div className="flex border-b border-slate-200 gap-8 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 text-sm font-black transition-all relative cursor-pointer",
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                <tab.icon size={18} /> {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* 4. Content Area gọi các component con */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "Portfolio" ? (
              <OthersPortfolio userId={userId} />
            ) : (
              <OthersCommunityPost userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
