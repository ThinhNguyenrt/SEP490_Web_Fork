import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CalendarClock,
  CheckCircle,
  Clock,
  MessageCircle,
  MoreVertical,
  Plus,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ApplicationStatus =
  | "Mới nhận"
  | "Đã nhận"
  | "Đang xem xét"
  | "Phỏng vấn"
  | "Từ chối";

type StatusFilter = "Tất cả" | ApplicationStatus;

type TimeFilter = "Tất cả" | "Gần đây" | "6 tháng qua" | "Cũ hơn (>6 tháng)";

type ApplicationItem = {
  id: number;
  candidateName: string;
  candidateAvatarUrl?: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatus;
  interviewTime?: string;
  interviewMode?: "Online" | "Trực tiếp";
};

type ScheduledInterview = {
  id: number;
  time: string;
  candidateName: string;
  mode: "Online" | "Trực tiếp";
  dateLabel: string;
  dateKey: string;
};

const TIME_FILTERS: TimeFilter[] = [
  "Tất cả",
  "Gần đây",
  "6 tháng qua",
  "Cũ hơn (>6 tháng)",
];

const STATUS_FILTERS: StatusFilter[] = [
  "Mới nhận",
  "Đã nhận",
  "Đang xem xét",
  "Phỏng vấn",
  "Từ chối",
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  "Mới nhận": "bg-sky-100 text-sky-700 border border-sky-200",
  "Đã nhận": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Đang xem xét": "bg-blue-100 text-blue-700 border border-blue-200",
  "Phỏng vấn": "bg-rose-100 text-rose-700 border border-rose-200",
  "Từ chối": "bg-slate-100 text-slate-600 border border-slate-200",
};

const STATUS_ICONS: Record<ApplicationStatus, React.ReactNode> = {
  "Mới nhận": <Clock size={15} />,
  "Đã nhận": <CheckCircle size={15} />,
  "Đang xem xét": <Clock size={15} />,
  "Phỏng vấn": <Calendar size={15} />,
  "Từ chối": <XCircle size={15} />,
};

const APPLICATIONS: ApplicationItem[] = [
  {
    id: 1,
    candidateName: "Phạm An Nhiên",
    candidateAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamAnNhien1",
    jobTitle: "Senior UX/UI designer",
    appliedAt: "2026-02-02",
    status: "Mới nhận",
  },
  {
    id: 2,
    candidateName: "Phạm An Nhiên",
    candidateAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamAnNhien2",
    jobTitle: "Senior UX/UI designer",
    appliedAt: "2026-02-02",
    status: "Đang xem xét",
  },
  {
    id: 3,
    candidateName: "Phạm An Nhiên",
    candidateAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamAnNhien3",
    jobTitle: "Senior UX/UI designer",
    appliedAt: "2026-02-02",
    status: "Đang xem xét",
  },
  {
    id: 4,
    candidateName: "Phạm An Nhiên",
    candidateAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamAnNhien4",
    jobTitle: "Senior UX/UI designer",
    appliedAt: "2026-02-02",
    status: "Phỏng vấn",
    interviewTime: "14:30 - 20/3/2026",
    interviewMode: "Online",
  },
  {
    id: 5,
    candidateName: "Phạm An Nhiên",
    candidateAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamAnNhien5",
    jobTitle: "Senior UX/UI designer",
    appliedAt: "2026-02-02",
    status: "Từ chối",
  },
];

const SCHEDULED_INTERVIEWS: ScheduledInterview[] = [
  {
    id: 1,
    time: "14:30",
    candidateName: "Phạm An Nhiên",
    mode: "Online",
    dateLabel: "HÔM NAY - 14/3",
    dateKey: "today",
  },
  {
    id: 2,
    time: "16:00",
    candidateName: "Đỗ Tuấn Kiệt",
    mode: "Trực tiếp",
    dateLabel: "HÔM NAY - 14/3",
    dateKey: "today",
  },
  {
    id: 3,
    time: "09:00",
    candidateName: "Nguyễn Anh Thư",
    mode: "Trực tiếp",
    dateLabel: "NGÀY MAI - 15/3",
    dateKey: "tomorrow",
  },
];

const toDate = (dateValue: string) => new Date(`${dateValue}T00:00:00`);

const formatDate = (dateValue: string) =>
  toDate(dateValue).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const isMatchTimeFilter = (appliedAt: string, timeFilter: TimeFilter) => {
  if (timeFilter === "Tất cả") return true;
  const currentDate = new Date();
  const appliedDate = toDate(appliedAt);
  const dayDiff = Math.floor(
    (currentDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (timeFilter === "Gần đây") return dayDiff <= 30;
  if (timeFilter === "6 tháng qua") return dayDiff > 30 && dayDiff <= 180;
  return dayDiff > 180;
};

const groupInterviewsByDate = (interviews: ScheduledInterview[]) => {
  const groups: Record<string, { label: string; items: ScheduledInterview[] }> = {};
  for (const interview of interviews) {
    if (!groups[interview.dateKey]) {
      groups[interview.dateKey] = { label: interview.dateLabel, items: [] };
    }
    groups[interview.dateKey].items.push(interview);
  }
  return Object.values(groups);
};

export default function ApplicationManagement() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter | "Tất cả">("Tất cả");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Tất cả");

  const filteredApplications = useMemo(
    () =>
      APPLICATIONS.filter(
        (item) =>
          (statusFilter === "Tất cả" || item.status === statusFilter) &&
          isMatchTimeFilter(item.appliedAt, timeFilter)
      ),
    [statusFilter, timeFilter]
  );

  const interviewGroups = useMemo(
    () => groupInterviewsByDate(SCHEDULED_INTERVIEWS),
    []
  );
  
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
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
                        {STATUS_ICONS[status as ApplicationStatus]}
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
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 rounded-xl border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Đánh dấu nhận tất cả
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                {filteredApplications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500">
                    Chưa có đơn ứng tuyển nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredApplications.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-slate-300 to-slate-100">
                          <span className="text-2xl font-medium text-slate-500">A</span>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-800">
                                {item.candidateName}
                              </h3>
                              <p className="text-xs font-medium text-slate-500">
                                Ứng tuyển: {item.jobTitle}
                              </p>
                              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                {formatDate(item.appliedAt)}
                              </p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}
                                >
                                  {item.status}
                                </span>
                                <button
                                  type="button"
                                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                  aria-label="Thêm tùy chọn"
                                >
                                  <MoreVertical size={15} />
                                </button>
                              </div>
                              {item.status === "Phỏng vấn" && item.interviewTime ? (
                                <div className="flex items-center gap-1 text-right text-xs font-semibold text-[#FF4848]">
                                  <CalendarClock size={13} className="shrink-0" />
                                  <span>
                                    {item.interviewTime} ({item.interviewMode})
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 rounded-lg bg-blue-500 px-3 text-xs font-semibold text-white hover:bg-blue-600"
                            >
                              Xem hồ sơ
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-lg border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            >
                              <MessageCircle size={12} />
                              Nhắn tin
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
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
                {interviewGroups.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {group.label}
                    </p>
                    <div className="space-y-2 border-l-2 border-blue-400 pl-3">
                      {group.items.map((interview) => (
                        <div key={interview.id} className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">
                            {interview.time}
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {interview.candidateName}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {interview.mode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

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
      </div>
    </div>
  );
}
