import { ArrowLeft, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { getSubmissionDetail } from "@/services/challenge.api";
import { SubmissionDetailResponse } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

export default function SubmissionDetails() {
  const navigate = useNavigate();
  const { submissionId } = useParams<{ submissionId: string }>();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [submission, setSubmission] = useState<SubmissionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissionDetail = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!submissionId || !accessToken) {
        throw new Error("Invalid submission ID or token");
      }

      console.log("📡 [SubmissionDetails] Loading submission:", submissionId);
      console.log("🔐 [SubmissionDetails] Token from Redux:", accessToken?.substring(0, 50) + "...");
      console.log("🔐 [SubmissionDetails] Full Token:", accessToken);
      const submissionData = await getSubmissionDetail(submissionId, accessToken);
      setSubmission(submissionData);
      console.log("✅ [SubmissionDetails] Submission loaded:", submissionData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading submission:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, accessToken]);

  useEffect(() => {
    loadSubmissionDetail();
  }, [loadSubmissionDetail]);

  if (isLoading) {
    return <CustomLoading />;
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Không tìm thấy bài nộp
          </h1>
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

  const createdDate = new Date(submission.createdAt).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const gradedDate = submission.gradedAt
    ? new Date(submission.gradedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Chưa chấm điểm";

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Graded":
        return {
          label: "Đã chấm điểm",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle2,
        };
      case "Pending":
        return {
          label: "Chờ chấm điểm",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "Submitted":
        return {
          label: "Đã nộp",
          color: "bg-blue-100 text-blue-800",
          icon: Zap,
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-800",
          icon: AlertCircle,
        };
    }
  };

  const statusDisplay = getStatusDisplay(submission.status ?? "");
  const StatusIcon = statusDisplay.icon;

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

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Chi tiết bài nộp
                </h1>
                <p className="text-slate-600">ID bài nộp: {submission.id}</p>
              </div>
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusDisplay.color}`}
              >
                <StatusIcon size={16} />
                {statusDisplay.label}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-500 mb-2">Điểm số</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">
                  {submission.overallScore}
                </span>
                <span className="text-slate-600">/10</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">User ID</p>
              <p className="text-lg font-semibold text-slate-900">
                {submission.userId}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Tạo vào</p>
              <p className="text-slate-900">{createdDate}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Chấm điểm vào</p>
              <p className="text-slate-900">{gradedDate}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500 mb-2">Challenge ID</p>
              <p className="text-slate-900 font-mono text-sm">
                {submission.challengeId}
              </p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-yellow-600" />
              Nhận xét của AI
            </h2>
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {submission.aiFeedback}
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
              <p className="font-semibold text-slate-900">
                {statusDisplay.label}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Điểm số</p>
              <p className="font-semibold text-blue-600">
                {submission.overallScore}/10
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Tình trạng</p>
              <p className="font-semibold text-slate-900">
                {submission.gradedAt ? "Đã chấm" : "Chờ chấm"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
