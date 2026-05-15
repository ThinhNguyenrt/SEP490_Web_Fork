import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hook";
import {
  createChallenge,
  updateChallenge,
  getChallengeDetail,
} from "@/services/challenge.api";
import { CreateChallengePayload } from "@/types/challenge";
import { notify } from "@/lib/toast";

interface CreateChallengeFormProps {
  challengeId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateChallengeForm({
  challengeId,
  onClose,
  onSuccess,
}: CreateChallengeFormProps) {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<CreateChallengePayload>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    reward: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load challenge data if editing
  useEffect(() => {
    if (challengeId && accessToken) {
      const loadChallenge = async () => {
        try {
          setIsLoading(true);
          const challenge = await getChallengeDetail(challengeId, accessToken);
          setFormData({
            title: challenge.title,
            description: challenge.description || "",
            startDate: challenge.startDate.split("T")[0], // Format as YYYY-MM-DD
            endDate: challenge.endDate.split("T")[0],
            reward: challenge.reward || "",
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Lỗi khi tải dữ liệu";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      loadChallenge();
    }
  }, [challengeId, accessToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Tên thử thách không được để trống");
      return false;
    }

    if (!formData.startDate) {
      setError("Ngày bắt đầu không được để trống");
      return false;
    }

    if (!formData.endDate) {
      setError("Ngày kết thúc không được để trống");
      return false;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setError("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.companyId || !accessToken) {
      setError("Không thể xác định công ty hoặc token. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload: CreateChallengePayload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reward: formData.reward?.trim() || undefined,
      };

      if (challengeId) {
        await updateChallenge(challengeId, payload, accessToken);
        notify.success("Cập nhật thử thách thành công");
      } else {
        await createChallenge(user.companyId, payload, accessToken);
        notify.success("Tạo thử thách thành công");
      }

      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi lưu thử thách";
      console.error("❌ Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {challengeId ? "Chỉnh sửa thử thách" : "Tạo thử thách mới"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block">
                <div className="animate-spin">
                  <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              </div>
              <p className="text-slate-600 mt-3">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tên thử thách <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Ví dụ: Thử thách Frontend Developer"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Mô tả chi tiết về thử thách, yêu cầu, và tiêu chí đánh giá"
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Ngày bắt đầu <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Ngày kết thúc <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Reward */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Giải thưởng
                </label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Ví dụ: 5,000,000 VNĐ + Job offer"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : challengeId
                    ? "Cập nhật"
                    : "Tạo thử thách"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
