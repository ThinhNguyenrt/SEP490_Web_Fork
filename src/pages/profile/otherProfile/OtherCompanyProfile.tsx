import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  MessageSquare,
  Briefcase,
  MapPin,
  Globe,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { OthersCommunityPost } from "./OthersCommunityPost"; // Tái sử dụng component bài đăng
import { OthersJobPost } from "./OthersJobPost";
import ConnectionButton from "@/components/common/ConnectionButton";

interface Company {
  id: number;
  userId: number;
  email: string;
  companyName: string;
  address: string;
  coverImage: string;
  avatar: string;
  activityField: string;
  description: string;
}

const companyTabs = [
  { id: "Jobs", label: "Bài đăng tuyển dụng", icon: Briefcase },
  { id: "Community", label: "Bài đăng cộng đồng", icon: MessageSquare },
];

export default function OtherCompanyProfilePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("Jobs");
  const [profile, setProfile] = useState<Company>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Company/by-user/${userId}`,
        );
        const data = await res.json();
        setProfile(data);
        console.log("company: ", data);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyProfile();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!profile || !userId)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">
        Không tìm thấy thông tin doanh nghiệp
      </div>
    );

  return (
    <div className="min-h-screen p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 1. Back Button */}
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

        {/* 2. Company Header */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white relative overflow-visible mb-4">
          <div className="relative rounded-[2.5rem] overflow-hidden h-80">
            {profile.coverImage ? (
              <img
                src={profile.coverImage}
                className="w-full h-full object-cover rounded-[2.5rem]"
                alt="cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-[2.5rem] flex items-center justify-center" />
            )}

            {/* Logo Section */}
            <div className="absolute bottom-2 left-8 z-10">
              <div className="w-36 h-36 rounded-[2.5rem] border-8 border-white bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="text-white" size={48} />
                )}
              </div>
            </div>
          </div>

          <CardContent className="pt-8 pb-10 px-8 lg:px-12 relative z-0">
            {/* Hàng 1: Tên công ty và Nút Action */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    {profile.companyName}
                  </h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    Nhà tuyển dụng
                  </span>
                </div>
                <p className="text-blue-600 font-bold flex items-center gap-2">
                  <Globe size={16} />
                  {profile.activityField || "Lĩnh vực kinh doanh"}
                </p>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer">
                  Nhắn tin
                </button>
                <ConnectionButton 
                  targetUserId={parseInt(userId || "0", 10)}
                  targetUserRole={2}
                />
              </div>
            </div>

            {/* Hàng 2: Grid chứa Description và Contact Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
              {/* Cột trái: Description (Chiếm 2/3 chiều rộng trên desktop) */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlignLeft size={16} className="shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Mô tả
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {profile.description ||
                    "Chưa có mô tả chi tiết về doanh nghiệp này."}
                </p>
              </div>

              {/* Cột phải: Thông tin liên hệ (Chiếm 1/3) */}
              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-blue-500 transition-colors">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Email liên hệ
                      </span>
                      <span className="text-sm font-bold text-slate-700 break-all">
                        {profile.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-blue-500 transition-colors">
                      <MapPin size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Trụ sở chính
                      </span>
                      <span className="text-sm font-bold text-slate-700 leading-snug">
                        {profile.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Company Tab Switcher */}
        <div className="flex flex-col gap-6">
          <div className="flex border-b border-slate-200 gap-8 px-2">
            {companyTabs.map((tab) => (
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

          {/* 4. Tab Content Area */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "Jobs" ? (
              <OthersJobPost companyId={profile.id} />
            ) : (
              <OthersCommunityPost userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
