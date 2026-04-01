import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Edit3, MoreHorizontal, User } from "lucide-react";
import { useEffect, useState } from "react";
import EditTalentProfileModal from "./EditTalentProfileModal";
import { useAppSelector } from "@/store/hook";

export default function TalentProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<{
    name?: string;
    avatar?: string;
    coverImage?: string;
  } | null>(null);
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const fetchUserProfile = async () => {
    if (!user?.employeeId) return;

    try {
      // Thay URL bằng API thật của bạn
      const response = await fetch(
        `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Employee/${user.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy avatar:", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, [user?.employeeId]);

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="sticky top-16 z-50">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
          {/* --- Phần Cover Image --- */}
          <div className="relative h-32 w-full bg-slate-100 border-b-2 border-slate-200">
            <img
              src={profile?.coverImage}
              alt="Cover"
              className="w-full h-full object-cover" // Giữ tỉ lệ, cắt phần thừa
            />

            {/* --- Phần Avatar nằm đè lên Cover --- */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <Avatar className="h-26 w-26 block">
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  <AvatarImage
                    src={profile?.avatar}
                    className="h-full w-full object-cover" // Đảm bảo avatar không bị méo
                  />
                  <AvatarFallback className="bg-slate-200 flex h-full w-full items-center justify-center">
                    <User className="text-slate-400" />
                  </AvatarFallback>
                </div>
              </Avatar>
            </div>
          </div>

          <CardContent className="pt-14 pb-6 text-center">
            {/* Tên và nút Edit */}
            <div className="flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
              <h3 className="font-bold text-lg text-slate-800">
                {profile?.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group"
              >
                <Edit3
                  size={12}
                  className="text-slate-400 group-hover:text-blue-500"
                />
              </button>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#5b99fc] hover:bg-blue-600 rounded-xl text-white font-bold cursor-pointer transition-colors">
                Chi tiết
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-2 border-slate-200 bg-white cursor-pointer hover:bg-slate-50"
              >
                <MoreHorizontal size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <EditTalentProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
}
