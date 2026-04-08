import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, MessageSquare } from "lucide-react";
import { notify } from "@/lib/toast";
import { complimentService, ComplimentRequest } from "@/services/compliment.api";
import { RootState } from "@/store";

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
  const [content, setContent] = useState("");
  const [score, setScore] = useState<number>(5.0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state when closing modal
      setContent("");
      setScore(5.0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập lại để gửi nhận xét");
      return;
    }

    if (!content.trim()) {
      notify.error("Vui lòng nhập nội dung nhận xét");
      return;
    }

    if (score < 0 || score > 9.99) {
      notify.error("Điểm số phải từ 0 đến 9.99");
      return;
    }

    setIsLoading(true);
    try {
      const compliment: ComplimentRequest = {
        portfolioId,
        content: content.trim(),
        score,
      };

      await complimentService.submitCompliment(compliment, accessToken);
      notify.success("Gửi nhận xét thành công!");
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Nhận xét Portfolio</h2>
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
          <div className="p-6 space-y-4">
            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung nhận xét <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ nhận xét của bạn về portfolio này..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={5}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tối đa 1000 ký tự
              </p>
            </div>

            {/* Score Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Chấm điểm <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="9.99"
                  step="0.01"
                  value={score}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setScore(Math.min(9.99, Math.max(0, value)));
                    }
                  }}
                  disabled={isLoading}
                  className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg text-center"
                />
                <span className="text-sm font-semibold text-gray-700">/9.99</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Nhập điểm từ 0 (thấp nhất) đến 9.99 (cao nhất)
              </p>
            </div>
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
                  <span>Đang gửi...</span>
                </>
              ) : (
                "Gửi nhận xét"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
