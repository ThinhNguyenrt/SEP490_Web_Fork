import { useEffect, useState } from "react";
import { CommunityPost } from "@/types/communityPost";
import { CommunityPostCard } from "../CommunityPostCard";
import { CompanyTab } from "./CompanyTab";
import { useAppSelector } from "@/store/hook";
import { CompanyPost } from "@/types/companyPost";
import { notify } from "@/lib/toast";

type TabType = "company" | "community";

export default function TalentSavePost() {
  const [activeTab, setActiveTab] = useState<TabType>("company");
  const [isLoading, setIsLoading] = useState(false);
  const [communitySavedPosts, setCommunitySavedPosts] = useState<CommunityPost[]>([]); // Lưu danh sách bài viết đã lưu
  // Giả sử lọc dữ liệu cho từng tab

  const { accessToken } = useAppSelector((state) => state.auth);
  const [companySavedPosts, setCompanySavedPosts] = useState<CompanyPost[]>([]);

    const fetchCompanySavedPosts = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/company-posts/saved`,
          {
            // Thay endpoint thực tế của bạn
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        setCompanySavedPosts(data.items);
        console.log("data: ", data.items);
      } catch (error) {
        notify.error("Lỗi khi tải bài viết đã lưu");
      } finally {
        setIsLoading(false);
      }
    };
  const fetchTalentSavePosts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://community-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/community/posts/saved`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched saved posts:", data.items);
        setCommunitySavedPosts(data); // Cập nhật danh sách bài viết đã lưu với dữ liệu từ API
      }
    } catch (error) {
      notify.error("Lỗi khi tải bài viết đã lưu");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "community") {
      fetchTalentSavePosts();
    }else {
      fetchCompanySavedPosts();
    }
  }, [activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header Section & Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Tab Menu UI */}
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "company"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tuyển dụng
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "community"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cộng đồng
            </button>
          </div>
        </div>
        <div className="pb-0">
          <p className="text-1 text-gray-900 mb-4">
            Bạn có{" "}
            <span className="font-bold">
              {activeTab === "company"
                ? companySavedPosts.length
                : communitySavedPosts.length}
            </span>{" "}
            bài lưu
          </p>
        </div>
        {/* Dynamic Content */}
        {activeTab === "company" ? (
          companySavedPosts.length > 0 ? (
            <CompanyTab companySavedPosts={companySavedPosts} />
          ) : (
            <EmptyState />
          )
        ) : communitySavedPosts.length > 0 ? (
          <div className="space-y-6">
            {communitySavedPosts.map((post: CommunityPost) => (
              <CommunityPostCard
                key={post.id}
                id={post.id}
                author={post.author.name}
                authorId={post.author.id}
                time={post.createdAt}
                avatar={post.author.avatar}
                isVerified={post.author.role === "COMPANY"}
                content={post.description || ""}
                images={
                  post?.media && post?.media.length > 0 ? post?.media : []
                }
                imageTitle={post.portfolioPreview?.data?.title || ""}
                likes={post.favoriteCount}
                comments={post.commentCount}
                isFavorited={post.isFavorited}
                isSaved={post.isSaved}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// Component phụ cho trạng thái trống
const EmptyState = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    </div>
    <h3 className="text-gray-900 font-medium">
      Không có bài viết nào trong mục này
    </h3>
  </div>
);
