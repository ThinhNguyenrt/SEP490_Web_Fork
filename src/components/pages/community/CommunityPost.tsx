import { useEffect, useState } from "react";
import { ImageIcon, Contact, Send } from "lucide-react";
import { CommunityPostCard } from "./CommunityPostCard";
import type { CommunityPost } from "@/types/communityPost.ts";
import CreatePostModal from "./CreatePostModal";

export default function CommunityPost() {
  const [posts, setPosts] = useState<CommunityPost[]>([]); // Lưu trữ danh sách bài viết
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Quản lý phân trang
  const PAGE_SIZE = 5;
  const [nextCursor, setNextCursor] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Để biết còn dữ liệu để fetch không

  const fetchCommunityPosts = async (currentCursor: any) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // API sẽ nhận cursor để biết lấy tiếp từ đâu
      const response = await fetch(
        `https://community-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/community/posts?pageSize=${PAGE_SIZE}&cursor=${currentCursor || ""}`,
      );

      if (response.ok) {
        const data = await response.json();
        // Giả sử data trả về có dạng: { items: CommunityPost[], nextCursor: string | null }
        console.log("Data fetched:", data);
        if (data.items.length > 0) {
          setPosts((prev) => [...prev, ...data.items]); // Cộng dồn bài viết mới vào list cũ
          setNextCursor(data.nextCursor); // Lưu cursor cho lần gọi tiếp theo
        }

        // Nếu số lượng trả về ít hơn PAGE_SIZE, nghĩa là hết dữ liệu
        if (data.items.length < PAGE_SIZE || !data.nextCursor) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lần đầu tiên
  useEffect(() => {
    fetchCommunityPosts(null);
  }, []);

  // Hàm xử lý khi click "Xem thêm" hoặc dùng Intersection Observer cho scroll
  const handleLoadMore = () => {
    fetchCommunityPosts(nextCursor);
  };
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-2xl mx-auto py-4 px-4">
        {/* Create Post Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 cursor-pointer">
          <div className="flex space-x-3 mb-4">
            <img
              alt="User"
              className="w-12 h-12 rounded-full border border-gray-100 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBsjvi0ArLl2XqTraIl2aHGRPylpHqFv_bVfqa61Xh0wJBB-a-tohjy7lUVXCnLgaE6jem9etqCZFeoUnm-_rVD1mmqLc3_QE1xCBesU6jGA0-1vjyUxg4ecyzd7Hv6c8YjmGG4IuVd9L9aXXJ4Nzn1mokwny3g1_G4vwmxo8LdKnQR8pbPVZ3P8ltMgxDBi0Pw6X5c_XGhsKYtcTlRsjvwihYnkDPuffHdEpgwnUCtpzvhY-JXfzVauuEjfGSa0B1NWj2OIImtto"
            />
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm text-gray-700 placeholder-gray-500"
                placeholder="Chia sẻ suy nghĩ của bạn..."
                type="text"
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
              id={post.id.toString()} // Chuyển id sang string nếu component yêu cầu
              author={post.author.name}
              time={post.createdAt} // Bạn có thể dùng hàm format thời gian tại đây
              avatar={post.author.avatar}
              isVerified={post.author.role === "COMPANY"}
              content={post.description || ""}
              image={post.media && post.media.length > 0 ? post.media[0] : ""}
              imageTitle={post.portfolioPreview?.data?.title || ""}
              likes={post.favoriteCount}
              comments={post.commentCount}
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
        <div className="mt-10 text-center pb-12">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-sm font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              {isLoading ? (
                <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                  {/* Container cho Spinner và Text */}
                  <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                    {/* Vòng tròn Loading Spinner */}
                    <div className="relative">
                      {/* Vòng tròn nhạt phía dưới */}
                      <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                      {/* Vòng xoay chính */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
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
        </div>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
