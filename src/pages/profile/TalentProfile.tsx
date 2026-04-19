import { Card, CardContent } from "@/components/ui/card";
import { Crown, Edit3, MoreHorizontal, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { profileService, EmployeeProfile } from "@/services/profile.api";
import { notify } from "@/lib/toast";
import EditTalentProfileModal from "./EditTalentProfileModal";
import { useUserProfile } from "@/hook/useUserProfile";
import { cn } from "@/lib/utils";

export default function TalentProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const { accessToken } = useAppSelector((state) => state.auth);
  const { profile, isLoading, isLoggedIn, user } = useUserProfile();
  // Fetch employee profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!accessToken) {
          console.warn("⚠️ No access token available");
          return;
        }

        console.log("📡 Fetching employee profile...");
        const profile = await profileService.fetchEmployeeProfile(accessToken);
        console.log("✅ Profile loaded:", profile);

        // Ensure profile has avatar and coverImage, with fallbacks
        const enrichedProfile = {
          ...profile,
          avatar: profile.avatar || "/user_placeholder.png",
          coverImage:
            profile.coverImage ||
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
        };

        setEmployeeProfile(enrichedProfile);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to load profile";
        console.error("❌ Error loading profile:", errorMsg);
        notify.error(errorMsg);

        // Set default profile on error so UI doesn't break
        setEmployeeProfile({
          id: 0,
          userId: 0,
          name: "Talent",
          phone: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Talent",
          coverImage:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
        });
      }
    };

    fetchProfile();
  }, [accessToken]);

  const displayName = employeeProfile?.name || "Talent";
  const displayAvatar =
    employeeProfile?.avatar ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Kala";
  const displayCoverImage =
    employeeProfile?.coverImage ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500";

  const handleProfileUpdated = (updatedProfile: EmployeeProfile) => {
    console.log("🔄 Profile updated, refreshing display...");
    setEmployeeProfile(updatedProfile);
  };

  return (
    <div className="lg:col-span-3 space-y-6 ">
      <div className="sticky top-16 z-50 ">
        <Card
          className={cn(
            "overflow-hidden border-2 shadow-sm rounded-2xl bg-white transition-all",
            isLoading ? "opacity-50" : "opacity-100",
            "border-slate-200",
          )}
        >
          <div
            className="h-32 bg-cover bg-center relative border-b-2 border-slate-200"
            style={{ backgroundImage: `url('${displayCoverImage}')` }}
          >
            {/* Vị trí Avatar Wrapper */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="relative inline-block group">
                {/* 2. HIỂN THỊ HUY HIỆU GÓI CƯỚC (VƯƠNG MIỆN/SÉT) */}
                {isLoggedIn && profile?.planName && (
                  <div
                    className={cn(
                      "absolute z-10 transition-all duration-300",
                      "-top-1 -right-1", // Căn góc trên bên phải avatar lớn
                      "rotate-[25deg] group-hover:rotate-[15deg] group-hover:scale-110",
                    )}
                  >
                    {profile?.planName === "Premium" ? (
                      <div className="bg-yellow-400 text-white p-1 rounded-md shadow-lg border-2 border-white">
                        <Crown
                          size={16}
                          fill="currentColor"
                          strokeWidth={2.5}
                        />
                      </div>
                    ) : profile?.planName === "Pro" ? (
                      <div className="bg-blue-600 text-white p-1 rounded-md shadow-lg border-2 border-white">
                        <Zap size={16} fill="currentColor" strokeWidth={2.5} />
                      </div>
                    ) : null}
                  </div>
                )}

                {/* 3. AVATAR CHÍNH VỚI VIỀN THEO GÓI */}
                <div
                  className={cn(
                    "h-20 w-20 rounded-full border-4 shadow-lg overflow-hidden bg-white transition-all",
                    profile?.planName === "Premium"
                      ? "border-yellow-400"
                      : profile?.planName === "Pro"
                        ? "border-blue-500"
                        : "border-white",
                  )}
                >
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 4. TICK XANH CHO DOANH NGHIỆP (GÓC DƯỚI) */}
                {user?.role === 2 && (
                  <div className="absolute -bottom-1 -right-1 transform z-20">
                    <img
                      src="/blue-tick-company.png"
                      alt="Verified"
                      className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardContent className="pt-12 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
              <h3 className="font-bold text-lg text-slate-800">
                {displayName}
              </h3>
              <button onClick={() => setIsEditModalOpen(true)} className="ml-1">
                <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                  <Edit3
                    size={12}
                    className="text-slate-400 group-hover:text-blue-500"
                  />
                </div>
              </button>
              <button className="ml-1">
                <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                  <MoreHorizontal size={20} />
                </div>
              </button>
            </div>
            {/* 
            <div className="flex gap-2 px-4">
              <Button className="flex-1 bg-[#5b99fc] hover:bg-blue-600 rounded-xl text-white font-bold cursor-pointer">
                Chi tiết
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-2 border-slate-200 bg-white cursor-pointer"
              >
                <MoreHorizontal size={20} />
              </Button>
            </div> */}
          </CardContent>
        </Card>
        <EditTalentProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialProfile={employeeProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </div>
  );
}
