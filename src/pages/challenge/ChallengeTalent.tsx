import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchActiveChallenges, fetchCompletedChallenges } from "@/services/talentChallenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

type Tab = "active" | "completed";

function ChallengeCard({
  challenge,
  onClick,
  tab,
}: {
  challenge: Challenge;
  onClick: () => void;
  tab: Tab;
}) {
  const startDate = new Date(challenge.startDate).toLocaleDateString("vi-VN");
  const endDate = new Date(challenge.endDate).toLocaleDateString("vi-VN");
  const now = new Date();
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg border border-slate-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {challenge.title}
          </h3>
          {tab === "active" && daysLeft > 0 && (
            <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
              <Clock size={16} />
              Còn {daysLeft} ngày
            </div>
          )}
        </div>
        {tab === "completed" && (
          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
        )}
      </div>

      {challenge.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {challenge.description}
        </p>
      )}

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-slate-500">Từ:</span>
          <span className="text-slate-900 font-medium">{startDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Đến:</span>
          <span className="text-slate-900 font-medium">{endDate}</span>
        </div>
        {challenge.reward && (
          <div className="flex justify-between">
            <span className="text-slate-500">Giải thưởng:</span>
            <span className="text-slate-900 font-medium text-green-600">
              {challenge.reward}
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
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [active, completed] = await Promise.all([
        fetchActiveChallenges(accessToken ?? undefined),
        user?.id ? fetchCompletedChallenges(user.id, accessToken ?? undefined) : Promise.resolve([]),
      ]);

      setActiveChallenges(active);
      setCompletedChallenges(completed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading challenges:", errorMessage);
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [user?.id]);

  const handleChallengeClick = (challengeId: number) => {
    navigate(`/talent-challenge/${challengeId}`);
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  const currentChallenges = activeTab === "active" ? activeChallenges : completedChallenges;

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
            <h1 className="text-3xl font-bold text-slate-900">Thử thách</h1>
            <p className="text-slate-500 mt-1">Tham gia các thử thách và chinh phục bản thân</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === "active"
                ? "text-blue-600 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} />
              Đang diễn ra ({activeChallenges.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === "completed"
                ? "text-blue-600 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              Đã làm ({completedChallenges.length})
            </div>
          </button>
        </div>

        {/* Content */}
        {currentChallenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            {activeTab === "active" ? (
              <>
                <Clock size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Chưa có thử thách nào
                </h3>
                <p className="text-slate-500">Quay lại sau để xem các thử thách mới</p>
              </>
            ) : (
              <>
                <CheckCircle2 size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Chưa nộp bài nào
                </h3>
                <p className="text-slate-500">Hãy bắt đầu với một thử thách từ danh sách</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge.id)}
                tab={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
