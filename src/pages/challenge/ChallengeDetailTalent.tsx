import { ArrowLeft, Download, Upload, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import {
  getChallengeDetailWithSubmission,
  submitChallengeSolution,
} from "@/services/talentChallenge.api";
import { Challenge, ChallengeSubmission } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

export default function ChallengeDetailTalent() {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submission, setSubmission] = useState<ChallengeSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadChallengeDetail = async () => {
    try {
      setIsLoading(true);

      if (!challengeId || !user?.id) {
        throw new Error("Invalid challenge or user");
      }

      const { challenge: challengeData, submission: submissionData } =
        await getChallengeDetailWithSubmission(
          parseInt(challengeId),
          user.id,
          accessToken ?? undefined
        );

      setChallenge(challengeData);
      setSubmission(submissionData);
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
  }, [challengeId, user?.id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        notify.error("Kích thước file không được vượt quá 50MB");
        return;
      }
      setSelectedFile(file);
      notify.success(`Chọn file: ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !challenge || !user?.id) {
      notify.warning("Vui lòng chọn file để nộp");
      return;
    }

    try {
      setIsSubmitting(true);
      const newSubmission = await submitChallengeSolution(
        challenge.id,
        user.id,
        selectedFile,
        accessToken ?? undefined
      );
      setSubmission(newSubmission);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      notify.success("Nộp bài thành công!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi nộp bài";
      console.error("❌ Error submitting:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSubmission = () => {
    if (submission) {
      // In a real app, this would trigger a download
      window.open(submission.fileUrl, "_blank");
      notify.info("Tải file submission của bạn");
    }
  };

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

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = endDate < now;

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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{challenge.title}</h1>

          {/* Status Badge and Timer */}
          <div className="flex items-center gap-4 mb-6">
            {isExpired ? (
              <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-semibold text-sm">
                Đã hết hạn
              </span>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm flex items-center gap-2">
                <Clock size={16} />
                Còn {daysLeft} ngày
              </span>
            )}

            {submission && (
              <span
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${
                  submission.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : submission.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <CheckCircle2 size={16} />
                {submission.status === "approved"
                  ? "Đã chấp nhận"
                  : submission.status === "rejected"
                  ? "Bị từ chối"
                  : "Chờ xét duyệt"}
              </span>
            )}
          </div>

          {/* Description */}
          {challenge.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Mô tả</h2>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {challenge.description}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-500">Ngày bắt đầu</p>
              <p className="text-sm font-semibold text-slate-900">
                {startDate.toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Ngày kết thúc</p>
              <p className="text-sm font-semibold text-slate-900">
                {endDate.toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Giải thưởng</p>
              <p className="text-sm font-semibold text-green-600">
                {challenge.reward || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Công ty</p>
              <p className="text-sm font-semibold text-slate-900">
                Company #{challenge.companyId}
              </p>
            </div>
          </div>
        </div>

        {/* Submission Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Nộp bài</h2>

          {submission && (
            <div className="mb-6 p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">Bài nộp của bạn</h3>
                  <p className="text-sm text-green-700 mb-3">
                    File: <span className="font-mono">{submission.fileName}</span>
                  </p>
                  <p className="text-sm text-green-700 mb-3">
                    Nộp lúc:{" "}
                    {new Date(submission.submittedAt).toLocaleString("vi-VN")}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.status === "approved"
                          ? "bg-green-200 text-green-900"
                          : submission.status === "rejected"
                          ? "bg-red-200 text-red-900"
                          : "bg-yellow-200 text-yellow-900"
                      }`}
                    >
                      {submission.status === "approved"
                        ? "Đã chấp nhận"
                        : submission.status === "rejected"
                        ? "Bị từ chối"
                        : "Chờ xét duyệt"}
                    </span>
                  </div>

                  {submission.feedback && (
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="text-xs font-semibold text-slate-900 mb-1">
                        Nhận xét từ công ty:
                      </p>
                      <p className="text-sm text-slate-600">{submission.feedback}</p>
                    </div>
                  )}

                  <button
                    onClick={handleDownloadSubmission}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-sm"
                  >
                    <Download size={16} />
                    Tải file của bạn
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isExpired && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Chọn file để nộp <span className="text-red-600">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Chọn file hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ: ZIP, RAR, PDF (Tối đa 50MB)
                  </p>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-blue-600 ml-auto">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".zip,.rar,.pdf,.7z"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </>
          )}

          {isExpired && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">
                Thời gian nộp bài đã hết. Bạn không thể nộp bài cho thử thách này nữa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
