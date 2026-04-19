import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Banknote,
  Clock,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionButton from "@/components/common/ConnectionButton";
import { getCompanyApplications, getApplicationStatusInfo, getApplicationStatusStyles, updateApplicationStatus } from "@/services/application.api";
import { useAppSelector } from "@/store/hook";
import { Application, ApplicationStatus } from "@/types/application";
import { notify } from "@/lib/toast";
import { UpdateStatusModal } from "./UpdateStatusModal";

type StatusFilterType = "Tất cả" | "Đơn mới, chờ xử lý" | "Đang xem xét" | "Đã chấp nhận" | "Đã từ chối";
type TimeFilter = "Tất cả" | "Gần đây" | "6 tháng qua" | "Cũ hơn (>6 tháng)";

const TIME_FILTERS: TimeFilter[] = [
  "Tất cả",
  "Gần đây",
  "6 tháng qua",
  "Cũ hơn (>6 tháng)",
];

const STATUS_FILTERS: StatusFilterType[] = [
  "Đơn mới, chờ xử lý",
  "Đang xem xét",
  "Đã chấp nhận",
  "Đã từ chối",
];

const statusTextToApiStatus: Record<string, ApplicationStatus> = {
  "Đơn mới, chờ xử lý": "WAITING",
  "Đang xem xét": "REVIEWING",
  "Đã chấp nhận": "ACCEPTED",
  "Đã từ chối": "REJECTED",
};

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

const isMatchTimeFilter = (appliedAt: string, timeFilter: TimeFilter) => {
  if (timeFilter === "Tất cả") {
    return true;
  }

  const currentDate = new Date();
  const appliedDate = toDate(appliedAt);
  const dayDiff = Math.floor(
    (currentDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (timeFilter === "Gần đây") {
    return dayDiff <= 30;
  }

  if (timeFilter === "6 tháng qua") {
    return dayDiff > 30 && dayDiff <= 180;
  }

  return dayDiff > 180;
};

export default function ApplicationManagement() {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("Tất cả");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!accessToken) {
        setError("Vui lòng đăng nhập lại");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("📥 Fetching company applications for page:", currentPage);

        const response = await getCompanyApplications(currentPage, pageSize, accessToken);
        console.log("✅ Company applications fetched:", response);

        setApplications(response.items || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tải quản lý ứng tuyển";
        console.error("❌ Error fetching applications:", errorMessage);
        setError(errorMessage);
        notify.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [accessToken, currentPage]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== "Tất cả") {
        const apiStatus = statusTextToApiStatus[statusFilter];
        if (app.status !== apiStatus) {
          return false;
        }
      }

      // Time filter
      if (!isMatchTimeFilter(app.appliedAt, timeFilter)) {
        return false;
      }

      return true;
    });
  }, [applications, statusFilter, timeFilter]);

  // Handle opening modal for status update
  const handleOpenStatusModal = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Handle status update completion
  const handleStatusUpdated = (updatedApplication: Application) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.applicationId === updatedApplication.applicationId ? updatedApplication : app
      )
    );
    handleCloseModal();
  };
  
  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-5">
        <header className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-slate-200 bg-white"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Quản lý yêu cầu ứng tuyển
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Theo dõi và quản lý các yêu cầu ứng tuyển từ ứng viên
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Left: Filter panel */}
          <section className="xl:col-span-3 xl:self-start">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">Bộ lọc trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {TIME_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTimeFilter(filter)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        timeFilter === filter
                          ? "border-blue-300 bg-blue-100 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("Tất cả")}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                      statusFilter === "Tất cả"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-transparent bg-white text-slate-600 hover:border-slate-200"
                    }`}
                  >
                    <span className="text-slate-400">
                      <Banknote size={15} />
                    </span>
                    Tất cả
                  </button>
                  {STATUS_FILTERS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                        statusFilter === status
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-transparent bg-white text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      <span
                        className={
                          statusFilter === status ? "text-blue-500" : "text-slate-400"
                        }
                      >
                        <Clock size={15} />
                      </span>
                      {status}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Middle: Application list */}
          <section className="xl:col-span-6">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-4">
                <div>
                  <CardTitle className="text-lg text-slate-800">
                    Quản lý yêu cầu ứng tuyển
                  </CardTitle>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Theo dõi và quản lý các yêu cầu ứng tuyển từ ứng viên
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {isLoading ? "..." : `${filteredApplications.length} kết quả`}
                </span>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500">
                    Chưa có đơn ứng tuyển nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredApplications.map((app) => {
                    console.log("📋 Rendering application:", {
                      id: app.applicationId,
                      status: app.status,
                      appliedAt: app.appliedAt,
                      position: app?.post?.position,
                      salary: app?.post?.salary,
                      address: app?.post?.address,
                      company: app?.company?.companyName,
                    });

                    const statusInfo = getApplicationStatusInfo(app.status);
                    const statusStyles = getApplicationStatusStyles(app.status);

                    return (
                      <article
                        key={app.applicationId}
                        className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-slate-300 to-slate-100">
                          {app?.candidate?.avatar ? (
                            <img 
                              src={app.candidate.avatar} 
                              alt={app.candidate.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-medium text-slate-500">
                              {app?.candidate?.name?.charAt(0).toUpperCase() || "A"}
                            </span>
                          )}
                        </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            {/* Header: Position, Status, and Menu */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                                  {(app?.post?.position && app.post.position.trim()) ? app.post.position : "Vị trí công việc"}
                                </h3>
                                <p className="text-xs font-medium text-slate-500">
                                  {(app?.candidate?.name && app.candidate.name.trim()) ? app.candidate.name : "Ứng viên"}
                                </p>
                              </div>

                              <div className="flex shrink-0 flex-col items-end gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles}`}
                                  >
                                    {statusInfo.text}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenStatusModal(app)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    aria-label="Thêm tùy chọn"
                                  >
                                    <MoreVertical size={15} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Job Details: Salary, Location, Date */}
                            <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 text-xs">
                              <div>
                                <p className="font-semibold text-slate-600 mb-0.5">Lương</p>
                                <p className="text-slate-700 font-bold">
                                  {app?.post?.salary && app.post.salary.trim() ? `${parseInt(app.post.salary).toLocaleString("vi-VN")} ₫` : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-600 mb-0.5">Địa điểm</p>
                                <p className="text-slate-700 line-clamp-1">{app?.post?.address && app.post.address.trim() ? app.post.address : "N/A"}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-600 mb-0.5">Ngày ứng tuyển</p>
                                <p className="text-slate-700">{app?.appliedAt ? formateDateMonthYear(app.appliedAt) : "N/A"}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                              <Button
                                type="button"
                                size="sm"
                                className="h-7 rounded-lg bg-blue-500 px-3 text-xs font-semibold text-white hover:bg-blue-600"
                                onClick={() => {
                                  if (app?.candidate?.userId) {
                                    navigate(`/profile/${app.candidate.userId}`);
                                  }
                                }}
                              >
                                Xem hồ sơ
                              </Button>
                              {app.candidate?.userId && (
                                <ConnectionButton
                                  targetUserId={app.candidate.userId}
                                  targetUserRole={1}
                                  compact={true}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}

                {/* Pagination */}
                {applications.length > 0 && (
                  <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-4">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-3 py-1 text-sm"
                    >
                      Trước
                    </Button>
                    <span className="text-sm font-semibold text-slate-600">
                      Trang {currentPage}
                    </span>
                    <Button
                      variant="outline"
                      disabled={applications.length < pageSize}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-3 py-1 text-sm"
                    >
                      Tiếp
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Right: Interview schedule */}
          <section className="xl:col-span-3 xl:self-start">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800">Lịch phỏng vấn</CardTitle>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-700"
                >
                  Xem tất cả
                </button>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Chưa có lịch phỏng vấn
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Lịch phỏng vấn sẽ hiển thị ở đây khi bạn tạo
                  </p>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus size={15} />
                  Thêm lịch mới
                </button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Modal for updating status */}
        <UpdateStatusModal
          isOpen={isModalOpen}
          application={selectedApplication}
          onClose={handleCloseModal}
          onStatusUpdated={handleStatusUpdated}
          onUpdateStatus={async (applicationId, statusCode) => {
            return await updateApplicationStatus(applicationId, statusCode, accessToken || undefined);
          }}
        />
      </div>
    </div>
  );
}