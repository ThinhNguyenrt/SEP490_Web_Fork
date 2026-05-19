import {
  ArrowLeft,
  Clock,
  Code2,
  Link as LinkIcon,
  Send,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPublicChallengeDetail, createSubmission } from "@/services/challenge.api";
import { useAppSelector } from "@/store/hook";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

export default function ChallengeDetailTalent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "criteria">("details");
  const [code, setCode] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPublicChallengeDetail(id);
        setChallenge(data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
        setError(msg);
        notify.error(msg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // BƯỚC 3: Cập nhật hàm xử lý nộp bài
  const handleSubmit = async () => {
    // Validate: Ở Swagger, cả 2 trường content và githubUrl đều là string. 
    // Tùy theo thiết kế, bạn có thể chặn nếu thiếu một trong hai hoặc giữ nguyên logic của bạn.
    if (!code.trim() && !submissionLink.trim()) {
      notify.warning("Vui lòng nhập mã code hoặc link nộp bài");
      return;
    }

    if (!id) {
      notify.error("Không tìm thấy ID của thử thách");
      return;
    }

    if (!accessToken) {
      notify.error("Bạn cần đăng nhập để nộp bài!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Định nghĩa payload đúng cấu trúc CreateSubmissionPayload
      const payload = {
        content: code,
        githubUrl: submissionLink,
      };

      // Gọi hàm API thực tế đã tạo từ trước
      await createSubmission(id, payload, accessToken);

      notify.success("Nộp bài thành công!");
      
      // Reset form sau khi nộp thành công
      setCode("");
      setSubmissionLink("");
      
      // (Tùy chọn) Điều hướng user về trang danh sách hoặc trang lịch sử nộp bài nếu có
      // navigate("/talents/submissions");

    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Có lỗi khi nộp bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CustomLoading />;

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Không tìm thấy thử thách"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const deadline = new Date(challenge.deadline);
  const daysLeft = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const difficulty =
    challenge.activeVersion?.difficultyLabel ||
    challenge.difficultyLabel ||
    "Unknown";

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: { label: "Dễ", color: "bg-green-100 text-green-800" },
    Medium: { label: "Vừa", color: "bg-yellow-100 text-yellow-800" },
    Hard: { label: "Khó", color: "bg-red-100 text-red-800" },
  };

  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty || "Không xác định",
    color: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {challenge.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${currentDifficulty.color}`}
            >
              {currentDifficulty.label}
            </span>
            {daysLeft > 0 ? (
              <span className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                <Clock size={14} /> Còn {daysLeft} ngày
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                <AlertCircle size={14} /> Đã hết hạn
              </span>
            )}
            <span className="text-sm text-slate-500">
              Hạn chót: {deadline.toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details + Criteria */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setActiveTab("criteria")}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "criteria"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Tiêu chí ({challenge.activeVersion?.criteria?.length || 0})
              </button>
            </div>

            {activeTab === "details" ? (
              <div className="space-y-6">
                {challenge.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Mô tả
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                )}
                {challenge.expectedSolution && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Giải pháp mong đợi
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {challenge.expectedSolution}
                    </p>
                  </div>
                )}
                {challenge.activeVersion?.skillWeights && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Kỹ năng yêu cầu
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(challenge.activeVersion.skillWeights).map(
                        ([skill, weight]) => (
                          <div
                            key={skill}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <span className="text-slate-900 font-medium">
                              {skill}
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {(weight * 100).toFixed(0)}%
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {challenge.activeVersion?.criteria?.length ? (
                  challenge.activeVersion.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {criterion.name}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {criterion.description}
                          </p>
                        </div>
                        <div className="ml-4 px-3 py-1 bg-blue-50 rounded-lg">
                          <span className="text-sm font-semibold text-blue-600">
                            {criterion.maxScore} điểm
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-500">
                    Chưa có tiêu chí
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Submission */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Send size={18} className="text-blue-600" />
                Nộp bài
              </h3>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={16} className="text-slate-600" />
                  <label className="text-sm font-semibold text-slate-900">
                    Mã nguồn
                  </label>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Dán code tại đây..."
                  className="w-full h-40 p-2 border border-slate-300 rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Tất cả ngôn ngữ</p>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={16} className="text-slate-600" />
                  <label className="text-sm font-semibold text-slate-900">
                    Link
                  </label>
                </div>
                <input
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Tùy chọn</p>
              </div>

              <div className="mb-5 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Lưu ý:</strong> Code phải rõ ràng và dễ hiểu.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || daysLeft <= 0}
                className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </button>

              {daysLeft <= 3 && daysLeft > 0 && (
                <div className="mt-4 p-2 bg-orange-50 border border-orange-200 rounded-lg flex gap-2">
                  <Clock
                    size={16}
                    className="text-orange-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-orange-900">
                    <strong>Cảnh báo:</strong> Chỉ còn {daysLeft} ngày
                  </p>
                </div>
              )}

              {daysLeft <= 0 && (
                <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-red-900">
                    <strong>Đã hết hạn nộp bài</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}