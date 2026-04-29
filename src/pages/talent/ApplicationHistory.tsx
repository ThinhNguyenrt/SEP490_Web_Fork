import { ReactNode, useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionButton from "@/components/common/ConnectionButton";
import { getMyApplications, getApplicationStatusInfo, getApplicationStatusStyles } from "@/services/application.api";
import { useAppSelector } from "@/store/hook";
import { Application, ApplicationStatus } from "@/types/application";
import { notify } from "@/lib/toast";

// Status filter types
type StatusFilterType = "Tất cả" | "Đơn mới, chờ xử lý" | "Đang xem xét" | "Đã chấp nhận" | "Đã từ chối";
type TimeFilter = "Tất cả" | "Gần đây" | "6 tháng qua" | "Cũ hơn (>6 tháng)";

const TIME_FILTERS: TimeFilter[] = [
  "Tất cả",
  "Gần đây",
  "6 tháng qua",
  "Cũ hơn (>6 tháng)",
];

const STATUS_FILTERS: StatusFilterType[] = [
  "Tất cả",
  "Đơn mới, chờ xử lý",
  "Đang xem xét",
  "Đã chấp nhận",
  "Đã từ chối",
];

// Map Vietnamese text back to API status values
const statusTextToApiStatus: Record<string, ApplicationStatus> = {
  "Đơn mới, chờ xử lý": "WAITING",
  "Đang xem xét": "REVIEWING",
  "Đã chấp nhận": "ACCEPTED",
  "Đã từ chối": "REJECTED",
};

const toDate = (dateValue: string) => {
  // Handle "MM/YYYY" format
  if (dateValue.includes('/') && dateValue.split('/').length === 2) {
    const [month, year] = dateValue.split('/');
    return new Date(`${year}-${month}-01T00:00:00`);
  }
  return new Date(`${dateValue}T00:00:00`);
};

const formatDate = (dateValue: string) =>
  toDate(dateValue).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue-500">{icon}</span>
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-[15px] font-semibold leading-6 text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function ApplicationHistory() {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("Tất cả");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Tất cả");
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch applications from API
  useEffect(() => {
    const enrichApplicationsWithRecruiterData = async (apps: Application[], token: string) => {
      // If company already has userId, return as is
      const enrichedApps = await Promise.all(
        apps.map(async (app) => {
          if (app.company?.userId) {
            return app; // Already has userId
          }
          
          if (!app.company?.companyId) {
            return app; // No company ID to fetch
          }

          try {
            // Fetch company details to get userId
            const res = await fetch(
              `https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/Company/${app.company.companyId}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            if (res.ok) {
              const companyData = await res.json();
              return {
                ...app,
                company: {
                  ...app.company,
                  userId: companyData.userId // Add recruiter userId
                }
              };
            }
          } catch (err) {
            console.error(`❌ Error fetching company ${app.company.companyId}:`, err);
          }
          
          return app;
        })
      );
      return enrichedApps;
    };

    const fetchApplications = async () => {
      if (!accessToken) {
        setError("Vui lòng đăng nhập lại");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("📥 Fetching applications for page:", currentPage);

        const response = await getMyApplications(currentPage, pageSize, accessToken);
        console.log("✅ Applications fetched:", response);

        // Enrich applications with recruiter userId if missing
        const enrichedApps = await enrichApplicationsWithRecruiterData(response.items || [], accessToken);
        setApplications(enrichedApps);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tải lịch sử ứng tuyển";
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

  const selectedApplication = useMemo(() => {
    if (filteredApplications.length === 0) {
      return null;
    }

    return (
      filteredApplications.find((item) => item.applicationId === selectedApplicationId) ??
      filteredApplications[0]
    );
  }, [filteredApplications, selectedApplicationId]);

  const activeApplicationId = selectedApplication?.applicationId ?? null;

  // Format company logo with fallback
  const getCompanyLogoUrl = (app: Application) => {
    if (app.company?.logo) {
      return app.company.logo;
    }
    return null;
  };

  // Get company logo first letter
  const getCompanyInitial = (companyName: string) => {
    return companyName?.charAt(0).toUpperCase() || "C";
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
            <h1 className="text-2xl font-bold text-slate-900">Lịch sử ứng tuyển</h1>
            <p className="text-sm font-medium text-slate-500">
              Theo dõi và quản lý các công việc bạn đã ứng tuyển
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
          <section className="xl:col-span-3">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">Bộ lọc trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Thời gian
                  </p>
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
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Trạng thái
                  </p>
                  <div className="space-y-2">
                    {STATUS_FILTERS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`flex w-full items-center rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                          statusFilter === status
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-6">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800">Lịch sử ứng tuyển</CardTitle>
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
                    Chưa có ứng tuyển nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredApplications.map((app) => {
                    const statusInfo = getApplicationStatusInfo(app.status);
                    const statusStyles = getApplicationStatusStyles(app.status);

                    return (
                      <article
                        key={app.applicationId}
                        className={`rounded-2xl border p-4 transition-all ${
                          activeApplicationId === app.applicationId
                            ? "border-blue-300 bg-blue-50/40"
                            : "border-slate-200 bg-white hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicationId(app.applicationId)}
                            className="flex min-w-0 flex-1 items-start gap-4 text-left"
                          >
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-slate-300 to-slate-100">
                              {getCompanyLogoUrl(app) ? (
                                <img
                                  src={getCompanyLogoUrl(app)!}
                                  alt={app.company?.companyName || "Company"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-4xl font-medium text-slate-500">
                                  {getCompanyInitial(app.company?.companyName || "")}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 space-y-1.5">
                              <h3 className="text-base font-bold text-slate-800">
                                {app.post.position && app.post.position.trim() 
                                  ? app.post.position 
                                  : "Vị trí công việc"}
                              </h3>
                              <p className="text-sm font-semibold text-slate-700">
                                {app.company?.companyName || "Company"}
                              </p>
                              <div className="space-y-1.5 text-sm font-semibold text-slate-500">
                                {app.post.salary && (
                                  <div className="flex items-center gap-2">
                                    <Banknote size={16} className="text-slate-400" />
                                    <span>{app.post.salary}</span>
                                  </div>
                                )}
                                {app.post.address && (
                                  <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span>{app.post.address}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-400">
                                {formatDate(app.appliedAt)}
                              </p>
                            </div>
                          </button>

                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles}`}>
                              {statusInfo.text}
                            </span>

                            {/* Message + Connection buttons - show for all applications with company */}
                            {app.company?.userId && (
                              <div className="flex gap-2">
                                <button className="h-8 rounded-xl border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-all">
                                  Nhắn tin
                                </button>
                                <ConnectionButton
                                  targetUserId={app.company.userId}
                                  targetUserRole={2}
                                  compact={true}
                                />
                              </div>
                            )}

                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 rounded-xl border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700"
                            >
                              Chi tiết
                            </Button>
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
                      Sau
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-3">
            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              {selectedApplication ? (
                <>
                  <div className="relative h-28 bg-slate-200/70" />
                  <CardContent className="space-y-5 pb-6 pt-6">
                    <div>
                      <h3 className="text-[20px] font-bold leading-7 text-slate-800">
                        {selectedApplication.post.position && selectedApplication.post.position.trim()
                          ? selectedApplication.post.position
                          : "Vị trí công việc"}
                      </h3>
                      <p className="mt-1 text-[14px] font-medium leading-5 text-slate-500">
                        {selectedApplication.company?.companyName || "Company"}
                      </p>
                    </div>

                    <div className="h-px w-full bg-slate-200" />

                    <div className="space-y-4">
                      <InfoRow
                        icon={<CalendarClock size={16} />}
                        label="Ngày ứng tuyển"
                        value={formatDate(selectedApplication.appliedAt)}
                      />
                      <InfoRow
                        icon={<MapPin size={16} />}
                        label="Địa điểm"
                        value={selectedApplication.post.address || "--"}
                      />
                      <InfoRow
                        icon={<Banknote size={16} />}
                        label="Mức lương"
                        value={selectedApplication.post.salary || "--"}
                      />
                      <div className="pt-2">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Trạng thái
                        </p>
                        <div className={`rounded-lg px-3 py-2 text-sm font-semibold ${getApplicationStatusStyles(selectedApplication.status)}`}>
                          {getApplicationStatusInfo(selectedApplication.status).description}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      {selectedApplication.company?.userId && (
                        <div className="flex gap-3">
                          <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer">
                            Nhắn tin
                          </button>
                          <ConnectionButton
                            targetUserId={selectedApplication.company.userId}
                            targetUserRole={2}
                            compact={false}
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                      >
                        Xem hồ sơ chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex h-48 items-center justify-center text-center">
                  <p className="text-slate-500">Chọn một ứng tuyển để xem chi tiết</p>
                </CardContent>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}