import {
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Calendar,
  MessageCircle,
  FileText,
  Plus,
} from "lucide-react";

// --- Types ---
type CandidateStatus =
  | "Mới"
  | "Đang xem xét"
  | "Phỏng vấn"
  | "Từ chối"
  | "Đã nhận";

interface Candidate {
  id: number;
  name: string;
  role: string;
  appliedDate: string;
  status: CandidateStatus;
  interviewTime?: string;
}

// --- Mock Data ---
const CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Phạm An Nhiên",
    role: "Senior UX/UI designer",
    appliedDate: "02/2/2026",
    status: "Mới",
  },
  {
    id: 2,
    name: "Phạm An Nhiên",
    role: "Senior UX/UI designer",
    appliedDate: "02/2/2026",
    status: "Đang xem xét",
  },
  {
    id: 3,
    name: "Phạm An Nhiên",
    role: "Senior UX/UI designer",
    appliedDate: "02/2/2026",
    status: "Đang xem xét",
  },
  {
    id: 4,
    name: "Phạm An Nhiên",
    role: "Senior UX/UI designer",
    appliedDate: "02/2/2026",
    status: "Phỏng vấn",
    interviewTime: "14:30 - 20/3/2026 (Online)",
  },
  {
    id: 5,
    name: "Phạm An Nhiên",
    role: "Senior UX/UI designer",
    appliedDate: "02/2/2026",
    status: "Từ chối",
  },
];

// --- Sub-components ---

const StatusBadge = ({ status }: { status: CandidateStatus }) => {
  const styles: Record<CandidateStatus, string> = {
    Mới: "bg-blue-50 text-blue-500",
    "Đang xem xét": "bg-green-50 text-green-500",
    "Phỏng vấn": "bg-red-50 text-red-500",
    "Từ chối": "bg-slate-100 text-slate-500",
    "Đã nhận": "bg-emerald-50 text-emerald-500",
  };

  return (
    <span
      className={`px-4 py-1 text-[11px] font-bold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 transition-all hover:shadow-sm ">
    <div className="flex gap-4">
      {/* Avatar Placeholder */}
      <div className="w-16 h-16 rounded-xl bg-slate-200  flex items-center justify-center shrink-0">
        <span className="text-2xl font-bold text-slate-400 font-sans">A</span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 ">
              {candidate.name}
            </h3>
            <p className="text-[13px] font-semibold text-slate-900  mt-0.5">
              Ứng tuyển: {candidate.role}
            </p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              {candidate.appliedDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={candidate.status} />
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {candidate.interviewTime && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-[11px] font-bold">
            <Calendar size={14} />
            <span>{candidate.interviewTime}</span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-full text-[12px] font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95">
            <FileText size={14} /> Xem hồ sơ
          </button>
          <button className="flex items-center gap-1.5 px-5 py-2 bg-white border border-blue-200 text-blue-500 rounded-full text-[12px] font-bold hover:bg-blue-50 transition-all active:scale-95">
            <MessageCircle size={14} /> Nhắn tin
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function CandidateManagement() {
  return (
    <div className="bg-[#f8fafd] min-h-screen ">
      <div className="max-w-[1440px] mx-auto grid grid-cols-11 gap-6 p-6">
        <aside className="col-span-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">
              Bộ lọc trạng thái
            </h2>

            <div className="flex flex-wrap gap-2 mb-8">
              {["Tất cả", "Gần đây", "6 tháng qua", "Cũ hơn"].map(
                (tab, idx) => (
                  <button
                    key={tab}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                      idx === 0
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <nav className="space-y-1">
              {[
                { icon: Clock, label: "Mới nhận", active: false },
                { icon: CheckCircle2, label: "Đã nhận", active: false },
                { icon: Clock, label: "Đang xem xét", active: true },
                { icon: Calendar, label: "Phỏng vấn", active: false },
                { icon: XCircle, label: "Từ chối", active: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-bold transition-all ${
                    item.active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENT CHÍNH - Chiếm 5/11 */}
        <main className="col-span-5 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Quản lý yêu cầu ứng tuyển
              </h1>
              <p className="text-[13px] text-slate-500 mt-1 font-medium">
                Theo dõi và quản lý các hồ sơ từ ứng viên
              </p>
            </div>
            <button className="px-4 py-2 text-[11px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 bg-white shadow-sm transition-colors whitespace-nowrap">
              Đánh dấu nhận tất cả
            </button>
          </div>

          <div className="space-y-3">
            {CANDIDATES.map((c) => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        </main>

        {/* SIDEBAR PHẢI - Chiếm 3/11 */}
        <aside className="col-span-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[14px] font-bold text-slate-800">
                Lịch phỏng vấn
              </h2>
              <button className="text-blue-600 text-[11px] font-bold hover:underline">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Hôm nay - 20/12
                </p>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start border-l-2 border-slate-800 pl-4">
                    <span className="text-[12px] font-bold text-slate-800 pt-0.5">
                      14:30
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 leading-none">
                        Phạm An Nhiên
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5 uppercase">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-slate-200 pl-4">
                    <span className="text-[12px] font-bold text-slate-800 pt-0.5">
                      16:00
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 leading-none">
                        Đỗ Tuấn Kiệt
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5 uppercase">
                        Trực tiếp
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Ngày mai - 21/12
                </p>
                <div className="flex gap-4 items-start border-l-2 border-slate-200 pl-4 opacity-50">
                  <span className="text-[12px] font-bold text-slate-800 pt-0.5">
                    09:00
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-none">
                      Nguyễn Anh Thư
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1.5 uppercase">
                      Trực tiếp
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <button className="w-full mt-10 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[12px] font-bold text-slate-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group">
              <Plus
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              Thêm lịch mới
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
