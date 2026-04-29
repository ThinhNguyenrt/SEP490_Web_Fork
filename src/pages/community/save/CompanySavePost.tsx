import { useEffect, useState, useCallback } from "react";
import {
  Users,
  LayoutGrid,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  AlertCircle,
  Loader,
  Folder,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import { CommunityPost } from "@/types/communityPost";
import { CommunityPostCard } from "../CommunityPostCard";
import { useAppSelector } from "@/store/hook";
import { portfolioService, unfollowPortfolio, PortfolioResponse } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";
import { SavedFollowCategories } from "@/components/common/SavedFollowCategories";
import { followCategoryService } from "@/services/followCategory.api";
import { FollowCategory } from "@/types/followCategory";
import BookmarkModal from "@/pages/recruiter/home/BookmarkModal";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";

// Type for saved portfolio
interface SavedPortfolio {
  portfolioId: number;
  employeeId: number;
  portfolioName: string;
  status: string;
  interestLevel: "low" | "medium" | "high";
  categoryId?: number;
  categoryName?: string;
  categoryCode?: string;
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
  const [categories, setCategories] = useState<FollowCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<SavedPortfolio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [portfolioToEdit, setPortfolioToEdit] = useState<SavedPortfolio | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [portfolioToView, setPortfolioToView] = useState<SavedPortfolio | null>(null);
  const [portfolioDetail, setPortfolioDetail] = useState<PortfolioResponse | null>(null);
  const [portfolioDetailLoading, setPortfolioDetailLoading] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;

      try {
        setIsLoadingCategories(true);
        const data = await followCategoryService.fetchFollowCategories(accessToken);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [accessToken]);

  // Function to refresh the saved portfolios list
  const refreshSavedPortfolios = useCallback(async (categoryId?: number | null) => {
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập để xem danh sách đã lưu");
      return;
    }

    try {
      setIsLoading(true);
      // Use provided categoryId if explicitly passed, otherwise use selectedCategoryId from state
      const effectiveCategoryId = categoryId !== undefined ? categoryId : selectedCategoryId;
      console.log("📡 Refreshing saved portfolios...", effectiveCategoryId ? `for category ${effectiveCategoryId}` : "all");
      const data = await portfolioService.fetchSavedPortfolios(accessToken, effectiveCategoryId === null ? undefined : effectiveCategoryId);
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
  }, [accessToken, selectedCategoryId]);

  // Fetch portfolios based on selected category
  useEffect(() => {
    refreshSavedPortfolios();
  }, [refreshSavedPortfolios]);

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

  const handleDeletePortfolio = (portfolio: SavedPortfolio) => {
    setOpenMenuId(null);
    setPortfolioToDelete(portfolio);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!portfolioToDelete || !accessToken) return;

    try {
      setIsDeleting(true);
      await unfollowPortfolio(portfolioToDelete.portfolioId, accessToken);
      notify.success("Đã xóa hồ sơ khỏi danh sách lưu");
      setCandidates((prev) => prev.filter((c) => c.portfolioId !== portfolioToDelete.portfolioId));
      setFilteredCandidates((prev) => prev.filter((c) => c.portfolioId !== portfolioToDelete.portfolioId));
      setShowDeleteConfirm(false);
      setPortfolioToDelete(null);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xóa hồ sơ";
      notify.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPortfolio = (portfolio: SavedPortfolio) => {
    setOpenMenuId(null);
    setPortfolioToEdit(portfolio);
    setShowEditModal(true);
  };

  const handleViewPortfolio = async (portfolio: SavedPortfolio) => {
    setOpenMenuId(null);
    setPortfolioToView(portfolio);
    setShowDetailModal(true);

    // Fetch full portfolio details
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập để xem chi tiết");
      return;
    }

    try {
      setPortfolioDetailLoading(true);
      const detail = await portfolioService.fetchPortfolioByIdAPI(portfolio.portfolioId, accessToken);
      if (detail) {
        setPortfolioDetail(detail);
      } else {
        notify.error("Không thể tải chi tiết portfolio");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Lỗi khi tải chi tiết portfolio";
      console.error("❌ Error loading portfolio detail:", errorMsg);
      notify.error(errorMsg);
    } finally {
      setPortfolioDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs - Always visible when categories exist */}
      {!isLoadingCategories && categories.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Danh sách theo dõi</h3>
          <div className="flex flex-wrap gap-2">
            {/* "Không phân loại" button */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategoryId === null
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <AlertCircle size={16} />
              Không phân loại
            </button>

            {/* Category buttons */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategoryId === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Folder size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Portfolios Grid */}
      <div className="flex gap-6">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center min-h-96">
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-slate-600">Đang tải danh sách...</p>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="col-span-full flex items-center justify-center min-h-96">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300" />
                <p className="text-lg font-semibold text-gray-600">Chưa có hồ sơ được lưu</p>
                <p className="text-sm text-gray-500">Hãy lưu các hồ sơ quan tâm từ trang tìm kiếm ứng viên</p>
              </div>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="col-span-full flex items-center justify-center min-h-96">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300" />
                <p className="text-lg font-semibold text-gray-600">Không tìm thấy hồ sơ</p>
                <p className="text-sm text-gray-500">Không có hồ sơ phù hợp với bộ lọc của bạn</p>
              </div>
            </div>
          ) : (
            filteredCandidates.map((can) => {
              const levelInfo = getInterestLevelColor(can.interestLevel);
              return (
                <div
                  key={can.portfolioId}
                  className={`bg-white border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md relative group ${levelInfo.border}`}
                >
                  {/* Action Menu Button */}
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === can.portfolioId ? null : can.portfolioId)
                        }
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Tùy chọn"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === can.portfolioId && (
                        <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-lg shadow-lg z-10 min-w-40">
                          <button
                            onClick={() => handleViewPortfolio(can)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg"
                          >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </button>
                          <button
                            onClick={() => handleEditPortfolio(can)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeletePortfolio(can)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors last:rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

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
            })
          )}
        </div>

        {/* Delete Portfolio Modal */}
        {showDeleteConfirm && portfolioToDelete && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            ></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Xóa hồ sơ khỏi danh sách</h3>
                  <button
                    onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <p className="text-gray-700 font-medium mb-2">Bạn có chắc chắn muốn xóa hồ sơ này?</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Tên hồ sơ: <span className="font-semibold">{portfolioToDelete.preview?.data?.name || portfolioToDelete.portfolioName}</span>
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ℹ️ Hồ sơ sẽ được xóa khỏi danh sách lưu của bạn. Bạn có thể lưu lại hồ sơ này sau.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmDeletePortfolio}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Xóa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Portfolio Modal */}
        {/* BookmarkModal for editing portfolio */}
        {showEditModal && portfolioToEdit && (
          <BookmarkModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setPortfolioToEdit(null);
            }}
            portfolioId={portfolioToEdit.portfolioId}
            onSuccess={() => {
              // Refresh the list after successful update
              refreshSavedPortfolios(selectedCategoryId);
            }}
            mode="edit"
            currentInterestLevel={portfolioToEdit.interestLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH"}
            currentCategoryId={portfolioToEdit.categoryId || null}
          />
        )}

        {/* Detail Portfolio Modal (View Only) */}
        {showDetailModal && portfolioToView && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !portfolioDetailLoading && setShowDetailModal(false)}
            ></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Chi tiết Portfolio</h3>
                    <p className="text-sm text-gray-500 mt-1">{portfolioToView.portfolioName}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    disabled={portfolioDetailLoading}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {portfolioDetailLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-slate-600">Đang tải chi tiết portfolio...</p>
                      </div>
                    </div>
                  ) : portfolioDetail ? (
                    <PortfolioRenderer
                      blocks={portfolioDetail.blocks}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-semibold text-gray-600">Không thể tải chi tiết portfolio</p>
                        <p className="text-sm text-gray-500">Vui lòng thử lại</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    disabled={portfolioDetailLoading}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

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
    </div>
  );
};

// 2. Component hiển thị Danh sách theo dõi
const SavedCandidatesWithCategories = () => {
  return (
    <div className="space-y-8">
      {/* Section: Hồ sơ ứng viên */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Hồ sơ ứng viên đã lưu</h2>
        <SavedCandidates />
      </div>

      {/* Section: Danh sách theo dõi */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Danh sách theo dõi</h2>
        <SavedFollowCategories />
      </div>
    </div>
  );
};

// --- Main Page Component ---
const CompanySavePost = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompanySavePostsData = async () => {
      try {
        const response = await fetch(
          `https://community-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/community/posts/saved`,
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
      }
    };

    if (activeTab !== "candidates") {
      fetchCompanySavePostsData();
    }
  }, [activeTab, accessToken]);

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
            <SavedCandidatesWithCategories />
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
