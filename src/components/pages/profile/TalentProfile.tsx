import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { profileService, EmployeeProfile } from "@/services/profile.api";
import { notify } from "@/lib/toast";
import EditTalentProfileModal from "./EditTalentProfileModal";

export default function TalentProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile | null>(null);
  const { accessToken } = useAppSelector((state) => state.auth);

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
          avatar: profile.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Talent",
          coverImage: profile.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
        };
        
        setEmployeeProfile(enrichedProfile);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to load profile";
        console.error("❌ Error loading profile:", errorMsg);
        notify.error(errorMsg);
        
        // Set default profile on error so UI doesn't break
        setEmployeeProfile({
          id: 0,
          userId: 0,
          name: "Talent",
          phone: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Talent",
          coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
        });
      }
    };

    fetchProfile();
  }, [accessToken]);

  const displayName = employeeProfile?.name || "Talent";
  const displayAvatar = employeeProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Kala";
  const displayCoverImage = employeeProfile?.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500";

  const handleProfileUpdated = (updatedProfile: EmployeeProfile) => {
    console.log("🔄 Profile updated, refreshing display...");
    setEmployeeProfile(updatedProfile);
  };

  return (
    <div className="lg:col-span-3 space-y-6 ">
      <div className="sticky top-16 z-50 ">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div className="h-32 bg-cover bg-center relative border-b-2 border-slate-200" style={{backgroundImage: `url('${displayCoverImage}')`}}>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <CardContent className="pt-12 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
              <h3 className="font-bold text-lg text-slate-800">{displayName}</h3>
              <button onClick={() => setIsEditModalOpen(true)}>
                <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                  <Edit3
                    size={12}
                    className="text-slate-400 group-hover:text-blue-500"
                  />
                </div>
              </button>
            </div>
            <div className="flex gap-2">
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
            </div>
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