import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import { Application, ApplicationStatus } from "@/types/application";
import { getApplicationStatusInfo } from "@/services/application.api";
import { notify } from "@/lib/toast";

// Map status codes (0, 1, 2, 3) to ApplicationStatus strings
const STATUS_CODE_TO_STRING: Record<number | string, ApplicationStatus> = {
  0: "WAITING",
  1: "REVIEWING",
  2: "ACCEPTED",
  3: "REJECTED",
  "WAITING": "WAITING",
  "REVIEWING": "REVIEWING",
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED",
};

// Helper function to format date
const toDate = (dateValue: string | undefined) => {
  if (!dateValue) return new Date();
  try {
    // Handle ISO datetime format: "2026-04-09T20:55:32.9442473"
    if (dateValue.includes('T')) {
      return new Date(dateValue);
    }
    // Handle MM/YYYY format: "04/2026"
    if (dateValue.includes('/') && dateValue.split('/').length === 2) {
      const [month, year] = dateValue.split('/');
      return new Date(`${year}-${month}-01T00:00:00`);
    }
    // Try parsing as-is
    return new Date(`${dateValue}T00:00:00`);
  } catch (e) {
    console.error("Error parsing date:", dateValue, e);
    return new Date();
  }
};

const formatDate = (dateValue: string | undefined) => {
  if (!dateValue) return "N/A";
  try {
    const date = toDate(dateValue);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", dateValue, e);
    return "N/A";
  }
};

// Format date for month/year format (e.g., "04/2026" -> "Tháng 4, 2026" or ISO datetime -> "Tháng 4, 2026")
const formateDateMonthYear = (dateValue: string | undefined) => {
  if (!dateValue) return "N/A";
  try {
    // Handle MM/YYYY format: "04/2026" -> "Tháng 4, 2026"
    if (dateValue.includes("/") && dateValue.split("/").length === 2) {
      const [month, year] = dateValue.split("/");
      const monthNum = parseInt(month, 10);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return dateValue;
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      return `${monthNames[monthNum - 1]}, ${year}`;
    }
    
    // Handle ISO datetime format: "2026-04-09T20:55:32.9442473"
    if (dateValue.includes('T')) {
      const date = toDate(dateValue);
      if (isNaN(date.getTime())) return dateValue;
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      return `${monthNames[month]}, ${year}`;
    }
    
    return formatDate(dateValue);
  } catch (e) {
    console.error("Error formatting date:", dateValue, e);
    return "N/A";
  }
};

interface UpdateStatusModalProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
  onStatusUpdated: (updatedApplication: Application) => void;
  onUpdateStatus: (applicationId: number, statusCode: number) => Promise<Application>;
}

// Status transition rules
const VALID_TRANSITIONS: Record<ApplicationStatus, number[]> = {
  WAITING: [1, 2, 3], // WAITING → REVIEWING, ACCEPTED, REJECTED
  REVIEWING: [2, 3], // REVIEWING → ACCEPTED, REJECTED
  ACCEPTED: [], // ACCEPTED → no transitions
  REJECTED: [], // REJECTED → no transitions
};

const STATUS_OPTIONS = [
  { code: 1, label: "Đang xem xét", color: "bg-blue-500", icon: Clock },
  { code: 2, label: "Chấp nhận", color: "bg-emerald-500", icon: CheckCircle2 },
  { code: 3, label: "Từ chối", color: "bg-red-500", icon: AlertCircle },
];

export function UpdateStatusModal({
  isOpen,
  application,
  onClose,
  onStatusUpdated,
  onUpdateStatus,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Early return if modal is not open or application is not available
  if (!isOpen || !application) {
    return null;
  }

  // Convert status code/string to ApplicationStatus string format
  const normalizedStatus = STATUS_CODE_TO_STRING[application?.status] as ApplicationStatus;
  const currentStatus = normalizedStatus || "WAITING";
  const validTransitions = VALID_TRANSITIONS[currentStatus] || [];
  const currentStatusInfo = getApplicationStatusInfo(currentStatus);
  const isBlocked = validTransitions.length === 0;

  console.log("🔍 [UpdateStatusModal] Application status:", {
    raw: application?.status,
    normalized: currentStatus,
    validTransitions,
    isBlocked
  });

  const handleStatusChange = async (statusCode: number) => {
    if (!application || !validTransitions.includes(statusCode)) {
      notify.error("Không thể thay đổi trạng thái này");
      return;
    }

    setIsLoading(true);
    try {
      const updatedApp = await onUpdateStatus(application.applicationId, statusCode);
      onStatusUpdated(updatedApp);
      notify.success("Cập nhật trạng thái thành công");
      onClose();
      setSelectedStatus(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Cập nhật thất bại";
      notify.error(errorMessage);
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only render portal if we have valid application data
  if (!application?.applicationId) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Cập nhật trạng thái</h2>
          <p className="mt-1 text-sm text-slate-500">
            Thay đổi trạng thái xem xét đơn ứng tuyển
          </p>
        </div>

        {/* Application info */}
        <div className="mb-6 rounded-xl bg-slate-50 p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                Vị trí ứng tuyển
              </p>
              <h3 className="text-base font-bold text-slate-900">
                {(application?.post?.position && application.post.position.trim()) ? application.post.position : "N/A"}
              </h3>
              <p className="text-sm text-slate-600">{(application?.company?.companyName && application.company.companyName.trim()) ? application.company.companyName : "N/A"}</p>
            </div>

            <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Lương</p>
                <p className="text-sm font-bold text-slate-700">
                  {application?.post?.salary && application.post.salary.trim()
                    ? `${parseInt(application.post.salary).toLocaleString("vi-VN")} ₫` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Địa điểm</p>
                <p className="text-sm text-slate-700">{(application?.post?.address && application.post.address.trim()) ? application.post.address : "N/A"}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Ngày ứng tuyển
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {application?.appliedAt ? formateDateMonthYear(application.appliedAt) : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Trạng thái hiện tại
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold inline-block ${
                    currentStatus === "WAITING"
                      ? "bg-amber-100 text-amber-700"
                      : currentStatus === "REVIEWING"
                        ? "bg-blue-100 text-blue-700"
                        : currentStatus === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {currentStatusInfo.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blocked state message */}
        {isBlocked && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Trạng thái hiện tại không thể thay đổi. Chỉ có thể thay đổi từ trạng thái
              "Đơn mới, chờ xử lý" hoặc "Đang xem xét".
            </p>
          </div>
        )}

        {/* Status options */}
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
            Chọn trạng thái mới
          </p>
          <div className="grid gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isValid = validTransitions.includes(option.code);
              const IconComponent = option.icon;

              return (
                <button
                  key={option.code}
                  onClick={() => {
                    if (isValid && !isLoading) {
                      setSelectedStatus(option.code);
                      handleStatusChange(option.code);
                    }
                  }}
                  disabled={!isValid || isLoading}
                  className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                    isValid && !isLoading
                      ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer"
                      : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                  } ${
                    selectedStatus === option.code && isLoading
                      ? "border-blue-300 bg-blue-50"
                      : ""
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${option.color}`}>
                    {selectedStatus === option.code && isLoading ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <IconComponent size={16} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                    {!isValid && (
                      <p className="text-xs text-slate-500">Không thể chuyển sang trạng thái này</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  // Render using Portal to avoid z-index issues
  return createPortal(modalContent, document.body);
}
