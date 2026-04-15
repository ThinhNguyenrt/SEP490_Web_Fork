import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { X, MessageSquare, Star } from "lucide-react";
import { notify } from "@/lib/toast";
import { complimentService } from "@/services/compliment.api";
import { RootState } from "@/store";

interface RatingData {
  id: number | null;
  score: number;
  content: string;
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  console.log("🎨 CommentModal render - isOpen:", isOpen, "portfolioId:", portfolioId);

  const loadExistingRating = useCallback(async () => {
    try {
      if (!accessToken) {
        console.log("⚠️ No access token, skipping load");
        setRatingData({
          id: null,
          score: 0,
          content: "",
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
        
        setRatingData({
          id: data.id,
          score: newScore,
          content: data.content || "",
        });
        console.log("💾 State set with score:", newScore, "content:", data.content);
        setLoadError(null);
      } else {
        console.log("ℹ️ No existing rating found, showing empty form");
        setRatingData({
          id: null,
          score: 0,
          content: "",
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
      });
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId, accessToken]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Load existing rating if available
      setLoadError(null);
      loadExistingRating();
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closing modal
      setRatingData({
        id: null,
        score: 0,
        content: "",
      });
      setLoadError(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, portfolioId, loadExistingRating]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("🎯 RatingData state changed:", ratingData);
  }, [ratingData]);

  useEffect(() => {
    console.log("⏳ Loading state changed:", isLoading);
  }, [isLoading]);

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
      if (ratingData.id) {
        // Update existing rating
        await complimentService.updateCompliment(ratingData.id, {
          content: ratingData.content,
          score: ratingData.score,
        }, accessToken);
        notify.success("Cập nhật nhận xét thành công!");
      } else {
        // Create new rating
        await complimentService.submitCompliment({
          portfolioId,
          content: ratingData.content,
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
            {/* Loading Spinner */}
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
