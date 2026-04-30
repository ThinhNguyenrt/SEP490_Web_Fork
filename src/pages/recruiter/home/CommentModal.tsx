import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { X, MessageSquare, Star, CheckSquare2, Square } from "lucide-react";
import { notify } from "@/lib/toast";
import { complimentService } from "@/services/compliment.api";
import { portfolioService, CriteriaItem } from "@/services/portfolio.api";
import { RootState } from "@/store";

interface RatingData {
  id: number | null;
  score: number;
  content: string;
  selectedCriteria: number[]; // Array of criteria IDs
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: number;
  onSuccess: () => void;
}

const CommentModal = ({
  isOpen,
  onClose,
  portfolioId,
  onSuccess,
}: CommentModalProps) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [ratingData, setRatingData] = useState<RatingData>({
    id: null,
    score: 0,
    content: "",
    selectedCriteria: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<CriteriaItem[]>([]);
  const [loadingCriteria, setLoadingCriteria] = useState(false);

  console.log("🎨 CommentModal render - isOpen:", isOpen, "portfolioId:", portfolioId);

  // Load criteria from API
  const loadCriteria = useCallback(async () => {
    if (!accessToken) {
      console.log("⚠️ No access token, skipping criteria load");
      return;
    }
    
    try {
      setLoadingCriteria(true);
      console.log("📡 Loading criteria... Token available:", !!accessToken);
      const criteriaList = await portfolioService.fetchCriteria(accessToken);
      console.log("📡 fetchCriteria returned:", criteriaList);
      setCriteria(criteriaList || []);
      console.log("✅ Criteria loaded successfully. Count:", criteriaList?.length || 0);
    } catch (err) {
      console.error("❌ Error loading criteria:", err);
      console.error("❌ Error details:", err instanceof Error ? err.message : String(err));
      // Don't show error to user, just continue without criteria
      setCriteria([]);
    } finally {
      setLoadingCriteria(false);
    }
  }, [accessToken]);

  const loadExistingRating = useCallback(async () => {
    try {
      if (!accessToken) {
        console.log("⚠️ No access token, skipping load");
        setRatingData({
          id: null,
          score: 0,
          content: "",
          selectedCriteria: [],
        });
        return;
      }

      console.log("🔄 Loading existing rating for portfolio:", portfolioId);
      setIsLoading(true);
      const data = await complimentService.getComplimentByPortfolioId(portfolioId, accessToken);
      
      if (data) {
        console.log("✅ Found existing rating:", data);
        console.log("📊 Score type:", typeof data.score, "value:", data.score);
        console.log("📝 Content:", data.content);
        
        const newScore = typeof data.score === 'number' ? data.score : Number(data.score);
        console.log("🔢 Parsed score:", newScore);
        
        // Parse criteria from content will be done after criteria loads
        setRatingData({
          id: data.id,
          score: newScore,
          content: data.content || "",
          selectedCriteria: [], // Will be updated after criteria loads
        });
        console.log("💾 State set with score:", newScore, "content:", data.content);
        setLoadError(null);
      } else {
        console.log("ℹ️ No existing rating found, showing empty form");
        setRatingData({
          id: null,
          score: 0,
          content: "",
          selectedCriteria: [],
        });
        setLoadError(null);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Không thể tải dữ liệu đánh giá";
      console.error("❌ Error loading rating:", err);
      setLoadError(errorMsg);
      setRatingData({
        id: null,
        score: 0,
        content: "",
        selectedCriteria: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId, accessToken]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Load criteria and existing rating if available
      setLoadError(null);
      loadCriteria();
      loadExistingRating();
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closing modal
      setRatingData({
        id: null,
        score: 0,
        content: "",
        selectedCriteria: [],
      });
      setLoadError(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, portfolioId, loadExistingRating, loadCriteria]);

  // Parse criteria from loaded rating content after criteria is available
  useEffect(() => {
    if (criteria.length > 0 && ratingData.content && ratingData.selectedCriteria.length === 0) {
      console.log("🔄 Parsing criteria from loaded content...");
      const criteriaNames = ratingData.content.split("\n").filter(name => name.trim());
      console.log("📋 Parsed criteria names:", criteriaNames);
      
      const selectedCriteriaIds = criteria
        .filter(c => criteriaNames.some(name => name.trim() === c.name))
        .map(c => c.id);
      
      if (selectedCriteriaIds.length > 0) {
        console.log("📍 Selected criteria IDs:", selectedCriteriaIds);
        setRatingData(prev => ({
          ...prev,
          selectedCriteria: selectedCriteriaIds,
        }));
      }
    }
  }, [criteria]);

  const handleSubmit = async () => {
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập lại để gửi nhận xét");
      return;
    }

    if (ratingData.score === 0) {
      notify.error("Vui lòng chọn điểm số");
      return;
    }

    if (!ratingData.content.trim()) {
      notify.error("Vui lòng nhập nội dung nhận xét");
      return;
    }

    setIsLoading(true);
    try {
      // Build criteria text: combine selected criteria names with newline separator
      let contentToSave = ratingData.content;
      if (ratingData.selectedCriteria.length > 0) {
        const selectedCriteriaNames = criteria
          .filter(c => ratingData.selectedCriteria.includes(c.id))
          .map(c => c.name);
        
        console.log("✅ Selected criteria names:", selectedCriteriaNames);
        
        // Combine user comment with criteria (criteria first, then comment)
        contentToSave = selectedCriteriaNames.join("\n");
        if (ratingData.content.trim()) {
          contentToSave += "\n" + ratingData.content;
        }
        
        console.log("📝 Final content to save:", contentToSave);
      }

      if (ratingData.id) {
        // Update existing rating
        await complimentService.updateCompliment(ratingData.id, {
          content: contentToSave,
          score: ratingData.score,
        }, accessToken);
        notify.success("Cập nhật nhận xét thành công!");
      } else {
        // Create new rating
        await complimentService.submitCompliment({
          portfolioId,
          content: contentToSave,
          score: ratingData.score,
        }, accessToken);
        notify.success("Gửi nhận xét thành công!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Không thể gửi nhận xét";
      console.error("Error submitting comment:", errorMsg);
      notify.error("Lỗi khi gửi nhận xét. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCriteria = (criteriaId: number) => {
    setRatingData((prev) => {
      const isSelected = prev.selectedCriteria.includes(criteriaId);
      return {
        ...prev,
        selectedCriteria: isSelected
          ? prev.selectedCriteria.filter(id => id !== criteriaId)
          : [...prev.selectedCriteria, criteriaId],
      };
    });
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Chấm điểm</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {/* Loading Spinner for Rating */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error Message */}
            {loadError && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{loadError}</p>
                <button
                  onClick={loadExistingRating}
                  className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {!isLoading && !loadError && (
              <>
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Chấm điểm <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setRatingData((prev) => ({ ...prev, score: s }))
                          }
                          disabled={isLoading}
                          type="button"
                          className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              s <= ratingData.score
                                ? "fill-orange-400 text-orange-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 ml-4">
                      {ratingData.score}/10
                    </span>
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nhận xét <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ratingData.content}
                    onChange={(e) =>
                      setRatingData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Chia sẻ nhận xét của bạn về portfolio này..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tối đa 1000 ký tự
                  </p>
                </div>

                {/* Criteria Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tiêu chí đánh giá
                  </label>
                  {loadingCriteria ? (
                    <div className="flex justify-center items-center py-6">
                      <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="ml-2 text-sm text-gray-500">Đang tải tiêu chí...</span>
                    </div>
                  ) : criteria.length > 0 ? (
                    <div className="space-y-2">
                      {criteria.map((criteriaItem) => {
                        const isSelected = ratingData.selectedCriteria.includes(criteriaItem.id);
                        return (
                          <button
                            key={criteriaItem.id}
                            onClick={() => toggleCriteria(criteriaItem.id)}
                            disabled={isLoading}
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                          >
                            {isSelected ? (
                              <CheckSquare2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isSelected ? "font-semibold text-blue-600" : "text-gray-700"}`}>
                              {criteriaItem.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Không có tiêu chí nào</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
