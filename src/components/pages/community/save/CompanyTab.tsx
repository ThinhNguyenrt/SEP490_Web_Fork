import { useState, useEffect } from "react";
import { MapPin, Banknote, Clock, ArrowUpRight, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import { CompanyPost } from "@/types/companyPost";
import { fetchSavedPosts } from "@/services/company.api";

export const CompanyTab = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  
  const [savedPosts, setSavedPosts] = useState<CompanyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const data = await fetchSavedPosts(accessToken, user?.id || 0);
        setSavedPosts(data);
      } catch (error) {
        notify.error("Lỗi khi tải bài viết đã lưu");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  // Template hiển thị khi đang tải (Skeleton)
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl aspect-[16/9] bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  // Template hiển thị khi không có dữ liệu
  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <Bookmark size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Bạn chưa lưu bài viết nào</p>
        <button 
          onClick={() => navigate("/talent-home")}
          className="mt-4 text-blue-600 font-semibold hover:underline"
        >
          Khám phá các bài đăng ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {savedPosts.map((post) => (
        <div
          key={post.postId}
          className="relative overflow-hidden rounded-2xl aspect-[16/9] min-h-[320px] shadow-lg group cursor-default"
        >
          {/* Background Image với lớp phủ */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url("https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"})`,
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] group-hover:bg-black/40 transition-colors"></div>
          </div>

          {/* Bookmark Icon */}
          <button className="absolute top-4 right-4 z-10 p-2 hover:scale-110 transition-transform cursor-pointer">
              <Bookmark className="w-8 h-8 text-blue-600 fill-blue-600" />
          </button>

          {/* Content Container */}
          <div className="relative h-full p-8 flex flex-col justify-center text-white">
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <img
                src={ "/default-avatar.png"}
                alt={post.companyName}
                className="w-20 h-20 rounded-full bg-white object-cover border-2 border-white/20 shrink-0 shadow-lg"
              />

              {/* Main Info */}
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight line-clamp-1">
                    {post.position}
                  </h2>
                  <p className="text-lg font-medium opacity-90">
                    {post.companyName}
                  </p>
                </div>

                {/* Job Details List */}
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="line-clamp-1">{post.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote size={16} className="text-green-400" />
                    <span className="font-bold">{post.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-orange-400" />
                    <span>{post.employmentType}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="mt-5 flex items-center gap-2 bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/30 py-2.5 px-8 rounded-xl transition-all w-fit group/btn cursor-pointer"
                  onClick={() => navigate(`/job/${post.postId}`)}
                >
                  <span className="text-sm font-bold">Xem chi tiết</span>
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};