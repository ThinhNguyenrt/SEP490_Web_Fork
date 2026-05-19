import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Bookmark,
  BookmarkX,
  AlertCircle,
  ChevronDown,
  Loader,
} from "lucide-react";
import { notify } from "@/lib/toast";
import { portfolioService } from "@/services/portfolio.api";
import { followCategoryService } from "@/services/followCategory.api";
import {
  followPortfolioWithCategory,
  updateFollow,
  unfollowPortfolio,
} from "@/services/portfolio.api"; // ← thêm unfollowPortfolio
import { RootState } from "@/store";
import { FollowCategory } from "@/types/followCategory";

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: number;
  onSuccess: (data: {
    interestLevel: "LOW" | "MEDIUM" | "HIGH";
    categoryId: number | null;
  }) => void;
  isAlreadySaved?: boolean;
  mode?: "create" | "edit";
  currentInterestLevel?: "LOW" | "MEDIUM" | "HIGH";
  currentCategoryId?: number | null;
  onUnsave?: () => void;
}

type InterestLevel = "LOW" | "MEDIUM" | "HIGH";

const BookmarkModal = ({
  isOpen,
  onClose,
  portfolioId,
  onSuccess,
  isAlreadySaved = false,
  mode = "create",
  currentInterestLevel = "MEDIUM",
  currentCategoryId = null,
  onUnsave, // ← thêm prop
}: BookmarkModalProps) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [interestLevel, setInterestLevel] =
    useState<InterestLevel>(currentInterestLevel);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false); // ← state riêng cho unsave
  const [categories, setCategories] = useState<FollowCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    currentCategoryId,
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false); // ← confirm dialog

  const isRestricted = isAlreadySaved && mode === "create";

  useEffect(() => {
    if (isOpen) {
      console.log(
        "🔍 BookmarkModal opened - currentInterestLevel:",
        currentInterestLevel,
      );
      console.log(
        "🔍 BookmarkModal opened - currentCategoryId:",
        currentCategoryId,
      );
      console.log("🔍 BookmarkModal opened - mode:", mode);

      document.body.style.overflow = "hidden";
      setShowUnsaveConfirm(false);

      // ← Bỏ điều kiện if (mode === "edit"), luôn sync state với props
      setInterestLevel(currentInterestLevel);
      setSelectedCategoryId(currentCategoryId);

      if (accessToken) {
        const fetchCategoriesData = async () => {
          try {
            setIsLoadingCategories(true);
            const data =
              await followCategoryService.fetchFollowCategories(accessToken);
            setCategories(data);

            if (currentCategoryId !== null) {
              // ← Ưu tiên sync từ prop trước (cả create lẫn edit mode)
              setSelectedCategoryId(currentCategoryId);
            } else if (data.length > 0 && mode === "create") {
              // ← Chỉ auto-select first khi không có currentCategoryId
              setSelectedCategoryId(data[0].id);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          } finally {
            setIsLoadingCategories(false);
          }
        };
        fetchCategoriesData();
      }
    } else {
      document.body.style.overflow = "unset";
      setInterestLevel("MEDIUM");
      setSelectedCategoryId(null);
      setShowCategoryDropdown(false);
      setShowUnsaveConfirm(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, accessToken, mode, currentInterestLevel, currentCategoryId]);

  if (!isOpen) return null;

  // ← Hàm xử lý bỏ lưu
  const handleUnsave = async () => {
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập lại để thực hiện thao tác này");
      return;
    }

    setIsUnsaving(true);
    try {
      await unfollowPortfolio(portfolioId, accessToken);
      notify.success("Đã bỏ lưu portfolio thành công!");
      onUnsave?.();
      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Không thể bỏ lưu portfolio";
      console.error("Error unfollowing portfolio:", errorMsg);
      notify.error("Lỗi khi bỏ lưu portfolio. Vui lòng thử lại.");
    } finally {
      setIsUnsaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isRestricted) {
      notify.error(
        "Không thể lưu portfolio này vì đã lưu và nhận xét trước đó",
      );
      return;
    }

    if (!accessToken) {
      notify.error(
        mode === "edit"
          ? "Vui lòng đăng nhập lại để cập nhật portfolio"
          : "Vui lòng đăng nhập lại để lưu portfolio",
      );
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "edit") {
        await updateFollow(
          portfolioId,
          { interestLevel, categoryId: selectedCategoryId },
          accessToken,
        );
        notify.success("Cập nhật portfolio thành công!");
      } else {
        if (selectedCategoryId) {
          await followPortfolioWithCategory(
            { portfolioId, interestLevel, categoryId: selectedCategoryId },
            accessToken,
          );
        } else {
          await portfolioService.followPortfolio(
            { portfolioId, interestLevel },
            accessToken,
          );
        }
        notify.success("Đã lưu portfolio thành công!");
      }
      onSuccess({
        interestLevel,
        categoryId: selectedCategoryId,
      });
      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Không thể xử lý yêu cầu";
      console.error("Error handling portfolio:", errorMsg);
      notify.error(
        mode === "edit"
          ? "Lỗi khi cập nhật portfolio. Vui lòng thử lại."
          : "Lỗi khi lưu portfolio. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const interestLevelOptions: {
    value: InterestLevel;
    label: string;
    color: string;
  }[] = [
    {
      value: "LOW",
      label: "Mức độ thấp",
      color: "bg-green-100 text-green-800 border-green-300",
    },
    {
      value: "MEDIUM",
      label: "Mức độ trung bình",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    {
      value: "HIGH",
      label: "Mức độ cao",
      color: "bg-red-100 text-red-800 border-red-300",
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto transform transition-all max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "edit" ? "Thay đổi mức độ ưu tiên Portfolio" : "Lưu Portfolio"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading || isUnsaving}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {isRestricted ? (
              <div className="space-y-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="text-red-600 text-2xl mt-1">⛔</div>
                    <div>
                      <h3 className="font-bold text-red-900 mb-2">
                        Không thể lưu portfolio này
                      </h3>
                      <p className="text-sm text-red-700">
                        Portfolio này đã được lưu và bạn đã gửi nhận xét. Bạn
                        không thể lưu lại portfolio này.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 Mỗi portfolio chỉ có thể được lưu một lần. Nếu bạn muốn
                    cập nhật mức độ quan tâm, vui lòng xem mục "Danh sách đã
                    lưu".
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Interest Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Đánh giá mức độ quan tâm{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {interestLevelOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                        style={{
                          borderColor:
                            interestLevel === option.value
                              ? "#3B82F6"
                              : "#E5E7EB",
                          backgroundColor:
                            interestLevel === option.value
                              ? "#EFF6FF"
                              : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="interestLevel"
                          value={option.value}
                          checked={interestLevel === option.value}
                          onChange={(e) =>
                            setInterestLevel(e.target.value as InterestLevel)
                          }
                          disabled={isLoading || isUnsaving}
                          className="w-4 h-4 text-blue-500 cursor-pointer"
                        />
                        <span className="ml-3 flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            {option.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {option.value === "LOW" &&
                              "Ứng viên tiềm năng cho tương lai"}
                            {option.value === "MEDIUM" &&
                              "Ứng viên đáng chú ý, cần xem xét thêm"}
                            {option.value === "HIGH" &&
                              "Ứng viên rất tiềm năng, ưu tiên liên hệ"}
                          </p>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 Mức độ quan tâm sẽ giúp bạn quản lý danh sách ứng viên
                    yêu thích một cách hiệu quả hơn.
                  </p>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Danh sách theo dõi
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      disabled={
                        isLoading ||
                        isUnsaving ||
                        isLoadingCategories ||
                        categories.length === 0
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left bg-white hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">
                        {isLoadingCategories ? (
                          <span className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Đang tải...
                          </span>
                        ) : selectedCategoryId ? (
                          categories.find((c) => c.id === selectedCategoryId)
                            ?.name || "Chọn danh sách"
                        ) : categories.length > 0 ? (
                          "Chọn danh sách"
                        ) : (
                          "Không có danh sách nào"
                        )}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showCategoryDropdown && categories.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategoryId(category.id);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-blue-50 ${selectedCategoryId === category.id ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
                          >
                            <p className="font-semibold">{category.name}</p>
                            <p className="text-xs text-gray-500">
                              {category.code}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Chọn danh sách để phân loại portfolio này
                  </p>
                </div>

                {/* ← Unsave confirm section - chỉ hiện ở edit mode */}
                {mode === "edit" && (
                  <div className="border-t border-gray-200 pt-4">
                    {!showUnsaveConfirm ? (
                      <button
                        onClick={() => setShowUnsaveConfirm(true)}
                        disabled={isLoading || isUnsaving}
                        className="w-full py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <BookmarkX className="w-4 h-4" />
                        Bỏ lưu portfolio này
                      </button>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                        <p className="text-sm font-semibold text-red-800 text-center">
                          Bạn có chắc muốn bỏ lưu portfolio này?
                        </p>
                        <p className="text-xs text-red-600 text-center">
                          Hành động này sẽ xóa portfolio khỏi danh sách đã lưu
                          của bạn.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowUnsaveConfirm(false)}
                            disabled={isUnsaving}
                            className="flex-1 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Không
                          </button>
                          <button
                            onClick={handleUnsave}
                            disabled={isUnsaving}
                            className="flex-1 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            {isUnsaving ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <BookmarkX className="w-4 h-4" />
                                Bỏ lưu
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 shrink-0">
            <button
              onClick={onClose}
              disabled={isLoading || isUnsaving}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRestricted ? "Đóng" : "Hủy"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || isUnsaving || isRestricted}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isRestricted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : isRestricted ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Không thể lưu</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{mode === "edit" ? "Cập nhật" : "Lưu"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookmarkModal;
