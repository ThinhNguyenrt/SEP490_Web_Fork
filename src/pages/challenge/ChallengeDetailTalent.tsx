import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { getChallengeDetail } from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

export default function ChallengeDetailTalent() {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadChallengeDetail = async () => {
    try {
      setIsLoading(true);

      if (!challengeId) {
        throw new Error("Invalid challenge ID");
      }

      console.log("📡 [ChallengeDetailTalent] Loading challenge:", challengeId);
      const challengeData = await getChallengeDetail(challengeId, accessToken ?? undefined);
      setChallenge(challengeData);
      console.log("✅ [ChallengeDetailTalent] Challenge loaded:", challengeData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading challenge:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChallengeDetail();
  }, [challengeId, accessToken]);

  if (isLoading) {
    return <CustomLoading />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy thử thách</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        {/* Challenge Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          {/* Title and Status */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${difficultyColor}`}>
                {difficulty}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Mô tả</h2>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Expected Solution */}
          {challenge.expectedSolution && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Giải pháp mong đợi</h2>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {challenge.expectedSolution}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-8">
            <div>
              <p className="text-sm text-slate-500">Hạn chót</p>
              <p className="text-sm font-semibold text-slate-900">{deadline.toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Còn lại</p>
              <p className={`text-sm font-semibold ${daysLeft > 0 ? "text-green-600" : "text-red-600"}`}>
                {daysLeft > 0 ? `${daysLeft} ngày` : "Hết hạn"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tiêu chí</p>
              <p className="text-sm font-semibold text-slate-900">
                {challenge.activeVersion?.criteria?.length || 0} tiêu chí
              </p>
            </div>
            {challenge.activeVersion?.skillWeights && (
              <div>
                <p className="text-sm text-slate-500">Kỹ năng</p>
                <p className="text-sm font-semibold text-slate-900">
                  {Object.keys(challenge.activeVersion.skillWeights).length} kỹ năng
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/talent-challenge/${challengeId}`)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Tham gia thử thách
          </button>
        </div>
      </div>
    </div>
  );
}

