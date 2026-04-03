import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "Xóa bình luận",
  message = "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.",
}: DeleteConfirmModalProps) => {
  // Chặn scroll khi modal mở
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Nút X đóng nhanh */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon cảnh báo */}
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500" size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-shadow shadow-md hover:shadow-red-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
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
                "Đồng ý xóa"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
