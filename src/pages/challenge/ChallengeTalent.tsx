import { ArrowLeft, Clock, Code2, Link as LinkIcon, Send, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchPublicChallenges } from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

type Tab = "available" | "details";

interface SelectedChallenge {
  challenge: Challenge;
  tab: "details" | "criteria";
}

function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: Challenge;
  onClick: () => void;
}) {
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const difficulty = challenge.activeVersion?.difficultyLabel || challenge.difficultyLabel || "Unknown";
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }[difficulty] || "bg-slate-100 text-slate-800";

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg border border-slate-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor}`}>
              {difficulty}
            </span>
            {daysLeft > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                <Clock size={14} />
                Còn {daysLeft} ngày
              </div>
            )}
          </div>
        </div>
      </div>

      {challenge.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {challenge.description}
        </p>
      )}

      <div className="space-y-2 text-sm mb-4 border-t border-slate-100 pt-4">
        <div className="flex justify-between">
          <span className="text-slate-500">Hạn chót:</span>
          <span className="text-slate-900 font-medium">
            {deadline.toLocaleDateString("vi-VN")}
          </span>
        </div>
        {challenge.activeVersion?.criteria && (
          <div className="flex justify-between">
            <span className="text-slate-500">Tiêu chí:</span>
            <span className="text-slate-900 font-medium">
              {challenge.activeVersion.criteria.length} tiêu chí
            </span>
          </div>
        )}
      </div>

      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
        Xem chi tiết
      </button>
    </div>
  );
}

function ChallengeDetailModal({
  challenge,
  onClose,
}: {
  challenge: Challenge;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "criteria">("details");
  const [code, setCode] = useState<string>("");
  const [submissionLink, setSubmissionLink] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const difficulty = challenge.activeVersion?.difficultyLabel || challenge.difficultyLabel || "Unknown";

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }[difficulty] || "bg-slate-100 text-slate-800";

  const handleSubmit = async () => {
    if (!code.trim() && !submissionLink.trim()) {
      notify.warning("Vui lòng nhập mã code hoặc link nộp bài");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("📡 Submitting solution...");
      // TODO: Call API to submit solution
      notify.success("Nộp bài thành công!");
      setCode("");
      setSubmissionLink("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi nộp bài";
      notify.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{challenge.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor}`}>
                {difficulty}
              </span>
              {daysLeft > 0 && (
                <span className="text-sm text-orange-600 font-medium flex items-center gap-1">
                  <Clock size={14} />
                  Còn {daysLeft} ngày
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-6 flex border-b border-slate-200">
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

              {/* Tab Content */}
              {activeTab === "details" ? (
                <div className="space-y-6">
                  {challenge.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Mô tả</h3>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>
                  )}

                  {challenge.expectedSolution && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Giải pháp mong đợi</h3>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {challenge.expectedSolution}
                      </p>
                    </div>
                  )}

                  {challenge.activeVersion?.skillWeights && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Kỹ năng yêu cầu</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(challenge.activeVersion.skillWeights).map(
                          ([skill, weight]) => (
                            <div key={skill} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-slate-900 font-medium">{skill}</span>
                              <span className="text-blue-600 font-semibold">{(weight * 100).toFixed(0)}%</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {challenge.activeVersion?.criteria && challenge.activeVersion.criteria.length > 0 ? (
                    challenge.activeVersion.criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{criterion.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">{criterion.description}</p>
                          </div>
                          <div className="ml-4 px-3 py-1 bg-blue-50 rounded-lg whitespace-nowrap">
                            <span className="text-sm font-semibold text-blue-600">
                              {criterion.maxScore} điểm
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-slate-500">Chưa có tiêu chí</p>
                  )}
                </div>
              )}
            </div>

            {/* Right: Submission Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Send size={18} className="text-blue-600" />
                  Nộp bài
                </h3>

                {/* Code Editor */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 size={16} className="text-slate-600" />
                    <label className="text-sm font-semibold text-slate-900">Mã nguồn</label>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Dán code tại đây..."
                    className="w-full h-32 p-2 border border-slate-300 rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">Tất cả ngôn ngữ</p>
                </div>

                {/* Submission Link */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon size={16} className="text-slate-600" />
                    <label className="text-sm font-semibold text-slate-900">Link</label>
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

                {/* Info */}
                <div className="mb-5 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Lưu ý:</strong> Code phải rõ ràng và dễ hiểu.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                </button>

                {/* Warnings */}
                {daysLeft <= 3 && daysLeft > 0 && (
                  <div className="mt-4 p-2 bg-orange-50 border border-orange-200 rounded-lg flex gap-2">
                    <Clock size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-900">
                      <strong>Cảnh báo:</strong> Chỉ còn {daysLeft} ngày
                    </p>
                  </div>
                )}

                {daysLeft <= 0 && (
                  <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-900">
                      <strong>Hết hạn</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublicChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📡 [ChallengeTalent] Loading public challenges...");
      const response = await fetchPublicChallenges(0, 50, accessToken ?? undefined);
      setPublicChallenges(response.items || []);
      console.log("✅ [ChallengeTalent] Loaded:", response.items?.length, "challenges");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading public challenges:", errorMessage);
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPublicChallenges();
  }, [accessToken]);

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Thử thách đang diễn ra</h1>
            <p className="text-slate-500 mt-1">Khám phá và tham gia các thử thách thú vị</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {publicChallenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Clock size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Chưa có thử thách nào
            </h3>
            <p className="text-slate-500">Vui lòng quay lại sau để xem các thử thách mới</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}
