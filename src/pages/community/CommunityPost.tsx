import { useEffect, useRef, useState } from "react";
import { ImageIcon, Contact, Send, Loader2, Zap, Crown } from "lucide-react";
import { CommunityPostCard } from "./CommunityPostCard";
import type { CommunityPost } from "@/types/communityPost.ts";
import CreatePostModal from "./CreatePostModal";
import { useUserProfile } from "@/hook/useUserProfile";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { cn } from "@/lib/utils";

export default function CommunityPost() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { profile } = useUserProfile();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  const PAGE_SIZE = 5;
  const [nextCursor, setNextCursor] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Thêm tham số isRefresh để biết khi nào cần thay thế list cũ
  const fetchCommunityPosts = async (currentCursor: any, isRefresh = false) => {
    if (isLoading || (!hasMore && !isRefresh)) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://community-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/community/posts?pageSize=${PAGE_SIZE}&cursor=${currentCursor || ""}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched posts:", data.items);
        if (isRefresh) {
          // Nếu refresh, thay thế toàn bộ danh sách bằng dữ liệu mới nhất
          setPosts(data.items);
        } else {
          // Nếu load more, cộng dồn vào danh sách hiện tại
          setPosts((prev) => [...prev, ...data.items]);
        }

        setNextCursor(data.nextCursor);
        setHasMore(data.items.length === PAGE_SIZE && !!data.nextCursor);
      }
    } catch (error) {
      console.error("Lỗi khi fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm được gọi khi CreatePostModal thành công
  const handleRefreshPosts = () => {
    setHasMore(true); // Reset lại trạng thái còn dữ liệu
    fetchCommunityPosts(null, true); // Fetch lại từ đầu (cursor = null)
  };

  useEffect(() => {
    fetchCommunityPosts(null);
  }, []);

  const handleLoadMore = () => {
    fetchCommunityPosts(nextCursor);
  };
  // State quản lý xóa bài viết
  const [deletePostModal, setDeletePostModal] = useState({
    isOpen: false,
    postId: null as number | null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Hàm mở modal xóa bài viết
  const handleOpenDeletePost = (id: number) => {
    setDeletePostModal({ isOpen: true, postId: id });
  };

  // Hàm gọi API xóa bài viết thực tế
  const handleConfirmDeletePost = async () => {
    if (!deletePostModal.postId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/community/posts/${deletePostModal.postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.ok) {
        notify.success("Xóa bài viết thành công");

        // Cập nhật UI: Lọc bài viết đã xóa ra khỏi danh sách
        setPosts((prev) => prev.filter((p) => p.id !== deletePostModal.postId));

        setDeletePostModal({ isOpen: false, postId: null });
      } else {
        notify.error("Không thể xóa bài viết");
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setIsDeleting(false);
    }
  };
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Nếu phần tử xuất hiện trong màn hình và không phải đang loading + còn dữ liệu
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }, // 1.0 nghĩa là phần tử phải xuất hiện hoàn toàn
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, handleLoadMore]);
  return (
    <div className="text-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-2xl mx-auto py-2 px-2">
        {/* Create Post Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-2 cursor-pointer">
          <div className="flex space-x-3 mb-4">
            <div className="relative inline-block group">
              {/* 1. Vương miện/Huy hiệu đội nghiêng */}
              {profile?.planName && profile.planName !== "Free" && (
                <div
                  className={cn(
                    "absolute z-10 transition-all duration-300",
                    "-top-1.5 -right-2",
                    // Xoay nhẹ icon để tạo cảm giác đội vương miện nghiêng
                    "rotate-[35deg] group-hover:rotate-[25deg] group-hover:scale-110",
                  )}
                >
                  {profile.planName === "Premium" ? (
                    <div className="bg-yellow-400 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(234,179,8,0.5)] border-[1.5px] border-white">
                      <Crown size={14} fill="currentColor" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="bg-blue-600 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(37,99,235,0.5)] border-[1.5px] border-white">
                      <Zap size={14} fill="currentColor" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              )}

              {/* 2. Avatar */}
              <img
                alt="User"
                className={cn(
                  "w-12 h-12 rounded-full border-2 object-cover transition-all duration-300",
                  profile?.planName === "Premium"
                    ? "border-yellow-400"
                    : profile?.planName === "Pro"
                      ? "border-blue-500"
                      : "border-gray-100",
                )}
                src={profile?.avatar || "/user_placeholder.png"}
              />

              {/* 3. Tick xanh cho doanh nghiệp */}
              {user?.role === 2 && (
                <div className="absolute -bottom-0.5 -right-0.5 transform z-20">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-4 h-4 bg-white rounded-full border border-white shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm text-gray-700 placeholder-gray-500"
                placeholder="Chia sẻ suy nghĩ của bạn..."
                type="text"
                readOnly
                onClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              <button
                className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <ImageIcon size={18} className="text-blue-500" />
                <span className="text-sm font-medium">Thêm ảnh</span>
              </button>
              <button
                className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Contact size={18} className="text-green-500" />
                <span className="text-sm font-medium">Hồ sơ</span>
              </button>
            </div>
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Send size={16} />
              Đăng
            </button>
          </div>
        </div>

        {/* Feed List - Hiển thị toàn bộ bài viết từ mock data */}
        <div className="space-y-6">
          {posts.map((post: CommunityPost) => (
            <CommunityPostCard
              key={post.id}
              id={post.id} // Chuyển id sang string nếu component yêu cầu
              author={post.author.name}
              authorId={post.author.id}
              onDeletePost={handleOpenDeletePost}
              time={post.createdAt} // Bạn có thể dùng hàm format thời gian tại đây
              avatar={post.author.avatar}
              isVerified={post.author.role === "COMPANY"}
              content={post.description || ""}
              images={post?.media && post?.media.length > 0 ? post?.media : []}
              imageTitle={post.portfolioPreview?.data?.title || ""}
              likes={post.favoriteCount}
              comments={post.commentCount}
              isFavorited={post.isFavorited} // Truyền trạng thái đã thích hay chưa
              isSaved={post.isSaved} // Truyền trạng thái đã lưu hay chưa
            />
          ))}
        </div>

        {/* Footer Link */}
        {/* <div className="mt-10 text-center pb-12">
          <button className="text-sm font-semibold text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
            Xem thêm bài viết mới
          </button>
        </div> */}
        {/* Nút Xem thêm / Loading */}
        {/* <div className="mt-10 text-center pb-12">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-sm font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Đang tải bài viết...</p>
                </div>
              ) : (
                "Xem thêm bài viết"
              )}
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Bạn đã xem hết bài viết rồi!!
            </p>
          )}
        </div> */}
        <div className="mt-10 text-center pb-12">
          {/* Điểm neo để theo dõi việc cuộn */}
          <div ref={observerTarget} className="h-1"></div>

          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Đang tải bài viết...</p>
            </div>
          )}

          {!hasMore && (
            <p className="text-gray-400 text-sm">
              Bạn đã xem hết bài viết rồi!!
            </p>
          )}
        </div>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefreshPosts}
      />
      <DeleteConfirmModal
        isOpen={deletePostModal.isOpen}
        isLoading={isDeleting}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này sẽ xóa vĩnh viễn nội dung và tất cả bình luận liên quan."
        onClose={() => setDeletePostModal({ isOpen: false, postId: null })}
        onConfirm={handleConfirmDeletePost}
      />
    </div>
  );
}
