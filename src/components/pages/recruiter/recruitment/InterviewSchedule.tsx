import React, { useState } from "react";
import {
  Search, Filter, Plus, ChevronRight, Calendar,
  Clock, MapPin, User, MessageCircle, FileText,
  XCircle, CheckCircle2, Video, MoreVertical,
  ArrowUpNarrowWide, ArrowDownNarrowWide
} from "lucide-react";

// --- Types ---
interface InterviewEvent {
  id: number;
  candidateName: string;
  role: string;
  team: string;
  time: string;
  period: string;
  type: "TRỰC TUYẾN" | "TRỰC TIẾP";
  status: "Đã hoàn thành" | "Sắp diễn ra" | "Đã hủy";
  location: string;
  date: string;
  avatar: string;
}

// --- Mock Data ---
const SCHEDULE_DATA: Record<string, InterviewEvent[]> = {
  "THỨ SÁU, 24 THÁNG 5, 2024": [
    {
      id: 1,
      candidateName: "Nguyễn Minh Anh",
      role: "Senior Product Designer",
      team: "HR Team",
      time: "09:00",
      period: "AM",
      type: "TRỰC TUYẾN",
      status: "Đã hoàn thành",
      location: "Google Meet",
      date: "24/05/2024",
      avatar: "https://i.pravatar.cc/150?u=1"
    },
    {
      id: 2,
      candidateName: "Trần Hoàng Nam",
      role: "Technical Lead",
      team: "Engineering Dept",
      time: "02:30",
      period: "PM",
      type: "TRỰC TIẾP",
      status: "Sắp diễn ra",
      location: "Phòng họp 302",
      date: "24/05/2024",
      avatar: "https://i.pravatar.cc/150?u=2"
    }
  ],
  "THỨ BẢY, 25 THÁNG 5, 2024": [
    {
      id: 3,
      candidateName: "Phạm Thị Kim Chi",
      role: "UX Researcher",
      team: "Product Team",
      time: "10:00",
      period: "AM",
      type: "TRỰC TUYẾN",
      status: "Đã hủy",
      location: "Zoom",
      date: "25/05/2024",
      avatar: "https://i.pravatar.cc/150?u=3"
    }
  ]
};

const InterviewSchedule = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState(2); // Mặc định chọn Trần Hoàng Nam như ảnh

  return (
    <div className="bg-[#f8fafd] min-h-screen font-['Public_Sans',sans-serif]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-11 gap-6 p-6">
        
        {/* --- CỘT TRÁI: BỘ LỌC (3/11) --- */}
        <aside className="col-span-3 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-6">
            <div className="flex gap-2 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 bg-white">
                <Filter size={14} /> Bộ lọc
              </button>
              <button className="flex-[1.5] flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl text-[12px] font-bold shadow-md shadow-blue-200">
                <Plus size={14} /> Tạo buổi phỏng vấn
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white shadow-sm rounded-lg text-[11px] font-bold text-slate-800">
                <ArrowUpNarrowWide size={14} /> Cũ nhất - Mới nhất
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-slate-400 text-[11px] font-bold">
                <ArrowDownNarrowWide size={14} /> Mới nhất - Cũ nhất
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {["Tất cả", "Sắp tới", "Đã hoàn thành", "Đã hủy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-3 text-left text-[13px] font-bold transition-all rounded-xl ${
                    activeTab === tab ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- CỘT GIỮA: DANH SÁCH LỊCH TRÌNH (5/11) --- */}
        <main className="col-span-5 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lịch trình phỏng vấn</h1>
              <p className="text-[13px] text-slate-500 mt-1 font-medium italic">Theo dõi và quản lý theo trình tự thời gian</p>
            </div>
            <button className="px-4 py-2 text-[11px] font-bold text-slate-500 border border-slate-200 rounded-xl bg-white">
              Đánh dấu nhận tất cả
            </button>
          </div>

          <div className="space-y-10">
            {Object.entries(SCHEDULE_DATA).map(([date, events]) => (
              <section key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={14} className="text-slate-400" />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{date}</h3>
                </div>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedId(event.id)}
                      className={`group flex items-center bg-white border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedId === event.id ? "border-blue-500 ring-4 ring-blue-500/5" : "border-slate-100"
                      }`}
                    >
                      <div className="w-20 text-center border-r border-slate-100 pr-4">
                        <p className="text-[15px] font-black text-slate-800">{event.time}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{event.period}</p>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[14px] font-bold text-slate-800">{event.candidateName}</h4>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {event.role} • {event.team}
                            </p>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            event.type === "TRỰC TUYẾN" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              {event.status === "Đã hoàn thành" ? <CheckCircle2 size={12} className="text-green-500" /> : 
                               event.status === "Đã hủy" ? <XCircle size={12} className="text-red-500" /> :
                               <Clock size={12} className="text-amber-500" />}
                              <span className={event.status === "Sắp diễn ra" ? "text-amber-600" : ""}>{event.status}</span>
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              {event.type === "TRỰC TUYẾN" ? <Video size={12} /> : <MapPin size={12} />}
                              <span>{event.location}</span>
                           </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* --- CỘT PHẢI: CHI TIẾT ỨNG VIÊN (3/11) --- */}
        <aside className="col-span-3">
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm sticky top-6">
            <div className="h-28 bg-[#f0f7ff] relative">
               <div className="absolute -bottom-8 left-6">
                  <img src="https://i.pravatar.cc/150?u=2" className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm object-cover" alt="avatar" />
               </div>
               <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-xl text-slate-600">
                  <MoreVertical size={16} />
               </button>
            </div>
            
            <div className="p-6 pt-12">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 leading-none">Trần Hoàng Nam</h2>
                    <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-tighter">Technical Lead Candidate</p>
                  </div>
                  <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-1 rounded-lg">Vòng 2</span>
               </div>

               <div className="space-y-5 border-t border-slate-50 pt-6">
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Clock size={16} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Thời gian</p>
                        <p className="text-[12px] font-bold text-slate-700 mt-0.5">02:30 PM, 24 Tháng 5, 2024</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin size={16} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Địa điểm</p>
                        <p className="text-[12px] font-bold text-slate-700 mt-0.5 leading-relaxed">Trực tiếp - Phòng họp 302, Tòa nhà A</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <User size={16} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Người phỏng vấn</p>
                        <p className="text-[12px] font-bold text-slate-700 mt-0.5">Lê Văn Nam, Đặng Thu Thảo</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 space-y-3">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[12px] font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <MessageCircle size={16} /> Nhắn tin
                  </button>
                  <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[12px] font-black flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                    <FileText size={16} /> Xem hồ sơ ứng viên
                  </button>
                  <button className="w-full py-3 bg-white text-red-500 border border-slate-100 rounded-xl text-[12px] font-black flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100 transition-all">
                    Hủy lịch phỏng vấn
                  </button>
               </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default InterviewSchedule;