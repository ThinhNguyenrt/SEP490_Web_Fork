import { type ReactNode, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  MapPin,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ApplicationStatus =
  | "Đang chờ"
  | "Đã nhận"
  | "Đang xem xét"
  | "Phỏng vấn"
  | "Từ chối";

type StatusFilter = "Tất cả" | ApplicationStatus;

type TimeFilter = "Tất cả" | "Gần đây" | "6 tháng qua" | "Cũ hơn (>6 tháng)";

type InterviewDetail = {
  candidateName: string;
  candidateAvatarUrl?: string;
  interviewPosition: string;
  currentRound: string;
  interviewTime: string;
  interviewMode: "Online" | "Offline";
  location: string;
  interviewer: string;
};

type ApplicationHistoryItem = {
  id: number;
  jobTitle: string;
  companyName: string;
  salary: string;
  workplace: string;
  appliedAt: string;
  status: ApplicationStatus;
  interviewDetail: InterviewDetail | null;
};

const TIME_FILTERS: TimeFilter[] = [
  "Tất cả",
  "Gần đây",
  "6 tháng qua",
  "Cũ hơn (>6 tháng)",
];

const STATUS_FILTERS: StatusFilter[] = [
  "Tất cả",
  "Đang chờ",
  "Đã nhận",
  "Đang xem xét",
  "Phỏng vấn",
  "Từ chối",
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  "Đang chờ": "bg-amber-100 text-amber-700 border border-amber-200",
  "Đã nhận": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Đang xem xét": "bg-blue-100 text-blue-700 border border-blue-200",
  "Phỏng vấn": "bg-rose-100 text-rose-700 border border-rose-200",
  "Từ chối": "bg-slate-100 text-slate-600 border border-slate-200",
};

const CHAT_SUPPORTED_STATUSES = new Set<ApplicationStatus>([
  "Đang xem xét",
  "Đã nhận",
  "Phỏng vấn",
]);

const APPLICATIONS: ApplicationHistoryItem[] = [
  {
    id: 1,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2026-02-20",
    status: "Đang xem xét",
    interviewDetail: {
      candidateName: "Trần Hoàng Nam",
      candidateAvatarUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=TranHoangNam",
      interviewPosition: "Technical Lead Candidate",
      currentRound: "Vòng 2",
      interviewTime: "20:30 PM, 24 Tháng 5, 2026",
      interviewMode: "Offline",
      location: "Trực tiếp - Phòng họp 302, Tòa nhà A",
      interviewer: "Lê Văn Nam, Đặng Thu Thảo",
    },
  },
  {
    id: 2,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2026-01-15",
    status: "Đã nhận",
    interviewDetail: {
      candidateName: "Nguyễn Minh Anh",
      candidateAvatarUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenMinhAnh",
      interviewPosition: "Product Designer",
      currentRound: "Đã qua phỏng vấn",
      interviewTime: "09:00 AM, 16 Tháng 1, 2026",
      interviewMode: "Online",
      location: "Online - Google Meet",
      interviewer: "Nguyễn Thanh Tùng",
    },
  },
  {
    id: 3,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2026-02-02",
    status: "Phỏng vấn",
    interviewDetail: {
      candidateName: "Lê Gia Hân",
      candidateAvatarUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=LeGiaHan",
      interviewPosition: "UI Designer",
      currentRound: "Vòng 1",
      interviewTime: "14:30 PM, 20 Tháng 3, 2026",
      interviewMode: "Online",
      location: "Online - Zoom",
      interviewer: "Trần Anh Minh",
    },
  },
  {
    id: 4,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2025-12-01",
    status: "Từ chối",
    interviewDetail: null,
  },
  {
    id: 5,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2025-08-14",
    status: "Đang chờ",
    interviewDetail: null,
  },
  {
    id: 6,
    jobTitle: "Senior UX/UI Designer",
    companyName: "FPT Software",
    salary: "1000$ - 1500$",
    workplace: "Công nghệ cao, HCM",
    appliedAt: "2025-02-10",
    status: "Từ chối",
    interviewDetail: null,
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Tất cả");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Tất cả");
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(
    null
  );

  const filteredApplications = useMemo(
    () =>
      APPLICATIONS.filter(
        (item) =>
          (statusFilter === "Tất cả" || item.status === statusFilter) &&
          isMatchTimeFilter(item.appliedAt, timeFilter)
      ),
    [statusFilter, timeFilter]
  );

  const selectedApplication = useMemo(() => {
    if (filteredApplications.length === 0) {
      return null;
    }

    return (
      filteredApplications.find((item) => item.id === selectedApplicationId) ??
      filteredApplications[0]
    );
  }, [filteredApplications, selectedApplicationId]);

  const activeApplicationId = selectedApplication?.id ?? null;

  const interviewDetail = selectedApplication?.interviewDetail ?? null;

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
            <h1 className="text-2xl font-bold text-slate-900">Lịch sử ứng tuyển</h1>
            <p className="text-sm font-medium text-slate-500">
              Theo dõi và quản lý các công việc bạn đã ứng tuyển
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
          <section className="xl:col-span-3">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800">Bộ lọc trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  
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
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-6">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-800">Lịch sử ứng tuyển</CardTitle>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {filteredApplications.length} kết quả
                </span>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                {filteredApplications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500">
                    Chưa có ứng tuyển nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredApplications.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        activeApplicationId === item.id
                          ? "border-blue-300 bg-blue-50/40"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedApplicationId(item.id)}
                          className="flex min-w-0 flex-1 items-start gap-4 text-left"
                        >
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-slate-300 to-slate-100">
                            <span className="text-4xl font-medium text-slate-500">A</span>
                          </div>

                          <div className="min-w-0 space-y-1.5">
                            <h3 className="text-base font-bold text-slate-800">
                              {item.jobTitle}
                            </h3>
                            <p className="text-sm font-semibold text-slate-700">
                              {item.companyName}
                            </p>
                            <div className="space-y-1.5 text-sm font-semibold text-slate-500">
                              <div className="flex items-center gap-2">
                                <Banknote size={16} className="text-slate-400" />
                                <span>{item.salary}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{item.workplace}</span>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-slate-400">
                              {formatDate(item.appliedAt)}
                            </p>
                          </div>
                        </button>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}
                          >
                            {item.status}
                          </span>
                          {item.status === "Phỏng vấn" && item.interviewDetail ? (
                            <div className="flex max-w-55 items-center justify-end gap-1 text-right text-xs font-semibold leading-4 text-[#FF4848]">
                              <CalendarClock size={14} className="shrink-0 text-[#FF4848]" />
                              <span>
                                {item.interviewDetail.interviewTime} ({item.interviewDetail.interviewMode})
                              </span>
                            </div>
                          ) : null}
                          {CHAT_SUPPORTED_STATUSES.has(item.status) ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 rounded-xl border-blue-200 bg-blue-50 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            >
                              <MessageCircle size={14} /> Nhắn tin
                            </Button>
                          ) : null}
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
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-3">
            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="relative h-28 bg-slate-200/70">
                <div className="absolute -bottom-7 left-6 h-14 w-14 overflow-hidden rounded-full border-4 border-white shadow-sm">
                  <img
                    src={
                      interviewDetail?.candidateAvatarUrl ??
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Applicant"
                    }
                    alt={interviewDetail?.candidateName ?? "Ứng viên"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute left-1/2 top-1/2 h-2 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/70" />
              </div>

              <CardContent className="space-y-5 px-6 pb-6 pt-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[20px] font-bold leading-7 text-slate-800">
                      {interviewDetail?.candidateName ?? "Chưa có ứng viên"}
                    </h3>
                    <p className="mt-1 text-[14px] font-medium leading-5 text-slate-500">
                      {interviewDetail?.interviewPosition ?? "Chưa có lịch phỏng vấn"}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1.5 text-sm font-semibold text-[#B45309]">
                    {interviewDetail?.currentRound ?? "Chưa xác định vòng"}
                  </span>
                </div>

                <div className="h-px w-full bg-slate-200" />

                <div className="space-y-4">
                  <InfoRow
                    icon={<CalendarClock size={16} />}
                    label="Thời gian"
                    value={interviewDetail?.interviewTime ?? "--"}
                  />
                  <InfoRow
                    icon={<MapPin size={16} />}
                    label="Địa điểm"
                    value={interviewDetail?.location ?? "--"}
                  />
                  <InfoRow
                    icon={<UserRound size={16} />}
                    label="Người phỏng vấn"
                    value={interviewDetail?.interviewer ?? "--"}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    disabled={!interviewDetail}
                  >
                    Nhắn tin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-300 bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
                    disabled={!interviewDetail}
                  >
                    Hủy lịch phỏng vấn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
