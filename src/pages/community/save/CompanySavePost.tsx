import { useEffect, useState } from "react";
import {
  Users,
  LayoutGrid,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  AlertCircle,
  Loader,
} from "lucide-react";
import { CommunityPost } from "@/types/communityPost";
import { CommunityPostCard } from "../CommunityPostCard";
import { useAppSelector } from "@/store/hook";
import { portfolioService } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

// Type for saved portfolio
interface SavedPortfolio {
  portfolioId: number;
  employeeId: number;
  portfolioName: string;
  status: string;
  interestLevel: "low" | "medium" | "high";
  followedAt: string;
  lastPortfolioUpdateAt: string;
  isUpdatedSinceFollow: boolean;
  preview: {
    type: string;
    variant: string;
    data: {
      avatar?: string;
      name?: string;
      studyField?: string;
      description?: string;
      email?: string;
      phone?: string;
    };
  };
}

// 1. Component hiển thị Hồ sơ ứng viên quan tâm
const SavedCandidates = () => {
  const [candidates, setCandidates] = useState<SavedPortfolio[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<SavedPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchSavedPortfolios = async () => {
      if (!accessToken) {
        notify.error("Vui lòng đăng nhập để xem danh sách đã lưu");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("📡 Fetching saved portfolios...");
        const data = await portfolioService.fetchSavedPortfolios(accessToken);
        console.log("✅ Saved portfolios:", data);
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Lỗi khi tải danh sách đã lưu";
        console.error("❌ Error loading saved portfolios:", errorMsg);
        notify.error(errorMsg);
        setCandidates([]);
        setFilteredCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPortfolios();
  }, [accessToken]);

  // Filter by priority
  useEffect(() => {
    if (selectedPriority === "all") {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(
        candidates.filter((c) => c.interestLevel === selectedPriority)
      );
    }
  }, [selectedPriority, candidates]);

  const getInterestLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return { border: "border-green-100", color: "text-green-500", bg: "bg-green-50", dot: "bg-green-500" };
      case "medium":
        return { border: "border-amber-100", color: "text-amber-500", bg: "bg-amber-50", dot: "bg-amber-400" };
      case "low":
        return { border: "border-red-100", color: "text-red-500", bg: "bg-red-50", dot: "bg-red-500" };
      default:
        return { border: "border-slate-100", color: "text-slate-500", bg: "bg-slate-50", dot: "bg-slate-400" };
    }
  };

  const getInterestLevelLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return level;
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="flex-1 flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-600">Đang tải danh sách đã lưu...</p>
          </div>
        </div>
        <aside className="w-64 shrink-0" />
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="flex gap-6">
        <div className="flex-1 flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300" />
            <p className="text-lg font-semibold text-gray-600">Chưa có hồ sơ được lưu</p>
            <p className="text-sm text-gray-500">Hãy lưu các hồ sơ quan tâm từ trang tìm kiếm ứng viên</p>
          </div>
        </div>
        <aside className="w-64 shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Danh sách Card */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredCandidates.map((can) => {
          const levelInfo = getInterestLevelColor(can.interestLevel);
          return (
            <div
              key={can.portfolioId}
              className={`bg-white border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md ${levelInfo.border}`}
            >
              <img
                src={can.preview?.data?.avatar || "https://i.pravatar.cc/150?u=default"}
                className="w-20 h-20 rounded-full mb-4 border-2 border-slate-50 shadow-sm object-cover"
                alt={can.preview?.data?.name || "avatar"}
              />
              <h3 className="text-xl font-bold text-slate-800">
                {can.preview?.data?.name || can.portfolioName}
              </h3>
              <p className="text-[12px] font-bold text-blue-500 uppercase mt-1">
                {can.preview?.data?.studyField || "Portfolio"}
              </p>
              <p className="text-[13px] text-slate-500 mt-3 leading-relaxed line-clamp-4">
                {can.preview?.data?.description || "Không có mô tả"}
              </p>

              <div className="flex gap-6 mt-5 text-[12px] font-medium text-slate-400">
                {can.preview?.data?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {can.preview.data.email}
                  </span>
                )}
                {can.preview?.data?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {can.preview.data.phone}
                  </span>
                )}
              </div>

              <div className="w-full border-t border-slate-100 mt-6 pt-4 flex flex-col gap-3">
                {/* Dòng 1: Mức độ quan tâm */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${levelInfo.dot}`} />
                    <span className={`text-[12px] font-bold ${levelInfo.color}`}>
                      Mức độ ưu tiên: {getInterestLevelLabel(can.interestLevel)}
                    </span>
                  </div>
                </div>

                {/* Dòng 2: Trạng thái cập nhật */}
                {can.isUpdatedSinceFollow && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Mới cập nhật
                    </span>
                    <span className="text-[10px] text-blue-400 font-medium">
                      Hồ sơ này mới cập nhật từ lần lưu
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Lọc bên phải */}
      <aside className="w-64 shrink-0">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-6">
          <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-5">
            Lọc theo ưu tiên
          </h2>
          <nav className="space-y-2">
            <button
              onClick={() => setSelectedPriority("all")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                selectedPriority === "all"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={16} /> Tất cả hồ sơ ({candidates.length})
            </button>
            {[
              { value: "high", label: "Mức độ ưu tiên: Cao", color: "bg-green-500" },
              { value: "medium", label: "Mức độ ưu tiên: Trung bình", color: "bg-amber-400" },
              { value: "low", label: "Mức độ ưu tiên: Thấp", color: "bg-red-500" },
            ].map((item) => {
              const count = candidates.filter((c) => c.interestLevel === item.value).length;
              return (
                <button
                  key={item.value}
                  onClick={() => setSelectedPriority(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-semibold transition-all ${
                    selectedPriority === item.value
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  {item.label} ({count})
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
};

// --- Main Page Component ---
const CompanySavePost = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [isLoading, setIsLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
  const { accessToken } = useAppSelector((state) => state.auth);
  const fetchCompanySavePosts = async () => {
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
        setSavedPosts(data); // Cập nhật danh sách bài viết đã lưu với dữ liệu từ API
      }
    } catch (error) {
      console.error("Lỗi khi fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab !== "candidates") {
      fetchCompanySavePosts();
    }
  }, [activeTab]);
  return (
    <div className="text-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-8 flex gap-8">
        {/* Sidebar Tabs bên trái (Cố định tỷ lệ như ảnh) */}
        <aside className="w-64 shrink-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm sticky top-16">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("candidates")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "candidates"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    size={20}
                    className={
                      activeTab === "candidates"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[14px]">Hồ sơ ứng viên</span>
                </div>
                {activeTab === "candidates" && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    size={20}
                    className={
                      activeTab === "posts" ? "text-blue-600" : "text-slate-400"
                    }
                  />
                  <span className="text-[14px]">Bài đăng cộng đồng</span>
                </div>
                {activeTab === "posts" && <ChevronRight size={16} />}
              </button>
            </nav>
          </div>
        </aside>

        {/* Nội dung thay đổi dựa trên tab */}
        <main className="flex-1 pb-20 min-h-screen">
          {/* Header Trang */}
          <div className="bg-white border-b border-slate-100 p-8 mb-6">
            <div className="max-w-[1440px] mx-auto">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Mục quan tâm
              </h1>
              <p className="text-[14px] text-slate-400 mt-1 font-medium">
                Quản lý và theo dõi các hồ sơ, bài viết bạn đã quan tâm
              </p>
            </div>
          </div>
          {activeTab === "candidates" ? (
            <SavedCandidates />
          ) : savedPosts.length > 0 ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {savedPosts.map((post: CommunityPost) => (
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
        </main>
      </div>
    </div>
  );
};

export default CompanySavePost;
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
