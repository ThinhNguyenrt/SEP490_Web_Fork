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
  selectedCriteria: number[];
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

  /**
   * Load both criteria and existing rating in parallel, then parse
   * selected criteria IDs from the saved content string in one shot.
   * This avoids the race condition where one useEffect fires before
   * the other async load has finished populating state.
   */
  const loadData = useCallback(async () => {
    if (!accessToken) {
      setRatingData({ id: null, score: 0, content: "", selectedCriteria: [] });
      return;
    }

    setIsLoading(true);
    setLoadingCriteria(true);
    setLoadError(null);

    try {
      const [criteriaList, existingRating] = await Promise.all([
        portfolioService.fetchCriteria(accessToken).catch((err) => {
          console.error("❌ Error loading criteria:", err);
          return [] as CriteriaItem[];
        }),
        complimentService
          .getComplimentByPortfolioId(portfolioId, accessToken)
          .catch((err) => {
            console.error("❌ Error loading rating:", err);
            return null;
          }),
      ]);

      setCriteria(criteriaList ?? []);

      if (existingRating) {
        const score =
          typeof existingRating.score === "number"
            ? existingRating.score
            : Number(existingRating.score);

        const savedContent: string = existingRating.content ?? "";

        // The content format is: "criteria1\ncriteria2\n...userComment"
        // Parse out which lines match known criteria names, the rest is
        // the user's free-text comment.
        const lines = savedContent.split("\n").map((l) => l.trim()).filter(Boolean);
        const loadedCriteria = criteriaList ?? [];

        const criteriaNames = new Set(loadedCriteria.map((c) => c.name));
        const selectedCriteriaIds: number[] = [];
        const commentLines: string[] = [];

        for (const line of lines) {
          const match = loadedCriteria.find((c) => c.name === line);
          if (match && criteriaNames.has(line)) {
            selectedCriteriaIds.push(match.id);
          } else {
            commentLines.push(line);
          }
        }

        setRatingData({
          id: existingRating.id,
          score,
          content: commentLines.join("\n"),
          selectedCriteria: selectedCriteriaIds,
        });
      } else {
        setRatingData({ id: null, score: 0, content: "", selectedCriteria: [] });
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Không thể tải dữ liệu đánh giá";
      console.error("❌ loadData error:", err);
      setLoadError(msg);
      setRatingData({ id: null, score: 0, content: "", selectedCriteria: [] });
    } finally {
      setIsLoading(false);
      setLoadingCriteria(false);
    }
  }, [portfolioId, accessToken]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      loadData();
    } else {
      document.body.style.overflow = "unset";
      setRatingData({ id: null, score: 0, content: "", selectedCriteria: [] });
      setCriteria([]);
      setLoadError(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loadData]);

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
      // Reconstruct content: criteria names first (newline-separated),
      // then the user's free-text comment on a new line.
      const selectedCriteriaNames = criteria
        .filter((c) => ratingData.selectedCriteria.includes(c.id))
        .map((c) => c.name);

      const parts = [...selectedCriteriaNames];
      if (ratingData.content.trim()) parts.push(ratingData.content.trim());
      const contentToSave = parts.join("\n");

      if (ratingData.id) {
        await complimentService.updateCompliment(
          ratingData.id,
          { content: contentToSave, score: ratingData.score },
          accessToken
        );
        notify.success("Cập nhật nhận xét thành công!");
      } else {
        await complimentService.submitCompliment(
          { portfolioId, content: contentToSave, score: ratingData.score },
          accessToken
        );
        notify.success("Gửi nhận xét thành công!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
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
          ? prev.selectedCriteria.filter((id) => id !== criteriaId)
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
      />

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
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Error Message */}
            {loadError && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{loadError}</p>
                <button
                  onClick={loadData}
                  className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {!isLoading && !loadError && (
              <>
                {/* ── 1. Criteria Selection (moved above star rating) ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tiêu chí đánh giá
                  </label>
                  {loadingCriteria ? (
                    <div className="flex justify-center items-center py-6">
                      <div className="w-5 h-5 border-[3px] border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">
                        Đang tải tiêu chí...
                      </span>
                    </div>
                  ) : criteria.length > 0 ? (
                    <div className="space-y-2">
                      {criteria.map((criteriaItem) => {
                        const isSelected = ratingData.selectedCriteria.includes(
                          criteriaItem.id
                        );
                        return (
                          <button
                            key={criteriaItem.id}
                            onClick={() => toggleCriteria(criteriaItem.id)}
                            disabled={isLoading}
                            type="button"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left ${
                              isSelected
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {isSelected ? (
                              <CheckSquare2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <span
                              className={`text-sm ${
                                isSelected
                                  ? "font-semibold text-blue-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {criteriaItem.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Không có tiêu chí nào
                    </p>
                  )}
                </div>

                {/* ── 2. Star Rating ── */}
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

                {/* ── 3. Comment Textarea ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nhận xét <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ratingData.content}
                    onChange={(e) =>
                      setRatingData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Chia sẻ nhận xét của bạn về portfolio này..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tối đa 1000 ký tự</p>
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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