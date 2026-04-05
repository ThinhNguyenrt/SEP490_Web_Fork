import {
  MapPin,
  Banknote,
  Clock,
  ArrowUpRight,
  Bookmark,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompanyPost } from "@/types/companyPost";
import { useState } from "react";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

interface CompanySavedPostsProps {
  companySavedPosts: CompanyPost[];
}

export const CompanyTab = ({
  companySavedPosts: initialPosts,
}: CompanySavedPostsProps) => {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  // Quản lý danh sách posts cục bộ để update UI nhanh
  const [posts, setPosts] = useState<CompanyPost[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUnsave = async (postId: number) => {
    if (deletingId) return; // Chống spam click

    setDeletingId(postId); // Hiệu ứng UX: Đang xử lý
    try {
      const response = await fetch(
        `https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/company-posts/${postId}/save`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        // Xóa khỏi UI sau khi API thành công
        setPosts((prev) => prev.filter((post) => post.postId !== postId));
        notify.success("Bỏ lưu bài viết thành công");
      } else {
        console.error("Lỗi khi bỏ lưu bài viết");
        notify.error("Lỗi khi bỏ lưu bài viết");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
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
      {posts.map((post) => (
        <div
          key={post.postId}
          className={`relative overflow-hidden rounded-2xl aspect-[16/9] min-h-[320px] shadow-lg group transition-all duration-500 ${
            deletingId === post.postId
              ? "scale-95 opacity-50 grayscale"
              : "scale-100"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.mediaUrl})` }} // Sửa lại syntax backgroundImage
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] group-hover:bg-black/40 transition-colors"></div>
          </div>

          {/* Bookmark Icon (Unsave Button) */}
          <button
            onClick={() => handleUnsave(post.postId)}
            disabled={deletingId === post.postId}
            className="absolute top-4 right-4 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/20 group/bookmark"
          >
            {deletingId === post.postId ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Bookmark className="w-6 h-6 text-blue-500 fill-blue-500 group-hover/bookmark:scale-110 transition-transform" />
            )}
          </button>

          {/* Content Container */}
          <div className="relative h-full p-8 flex flex-col justify-center text-white">
            <div className="flex items-start gap-6">
              <img
                src={post.companyAvatar}
                alt={post.companyName}
                className="w-20 h-20 rounded-full bg-white object-cover border-2 border-white/20 shrink-0 shadow-lg"
              />

              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight line-clamp-1">
                    {post.position}
                  </h2>
                  <p className="text-lg font-medium opacity-90">
                    {post.companyName}
                  </p>
                </div>

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
