import { ArrowLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchPublicChallenges } from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: Challenge;
  onClick: () => void;
}) {
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const difficulty =
    challenge.activeVersion?.difficultyLabel ||
    challenge.difficultyLabel ||
    "Unknown";
  // 1. Định nghĩa object chứa cả Màu cấu hình và Tên hiển thị tiếng Việt
  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: { label: "Dễ", color: "bg-green-100 text-green-800" },
    Medium: { label: "Vừa", color: "bg-yellow-100 text-yellow-800" },
    Hard: { label: "Khó", color: "bg-red-100 text-red-800" },
  };

  // 2. Lấy ra config dựa vào biến `difficulty` (nếu không khớp key nào thì dùng fallback mặc định)
  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty || "Không xác định", // Giữ lại chữ cũ hoặc hiển thị mặc định
    color: "bg-slate-100 text-slate-800",
  };

  // 3. Giờ bạn có 2 biến sạch sẽ để dùng trong JSX:
  // - currentDifficulty.color (Dùng để cho vào className)
  // - currentDifficulty.label (Dùng để hiển thị ra màn hình)

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
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${currentDifficulty.color}`}
            >
              {currentDifficulty.label}
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

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublicChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📡 [ChallengeTalent] Loading public challenges...");
      const response = await fetchPublicChallenges(0, 50);
      setPublicChallenges(response.items || []);
      console.log(
        "✅ [ChallengeTalent] Loaded:",
        response.items?.length,
        "challenges",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
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
    navigate(`/talent-challenge/${challenge.id}`);
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
            <h1 className="text-3xl font-bold text-slate-900">
              Thử thách đang diễn ra
            </h1>
            <p className="text-slate-500 mt-1">
              Khám phá và tham gia các thử thách thú vị
            </p>
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
            <p className="text-slate-500">
              Vui lòng quay lại sau để xem các thử thách mới
            </p>
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
    </div>
  );
}
