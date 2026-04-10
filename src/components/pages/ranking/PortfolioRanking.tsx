import { ChevronLeft, Trophy, Flame, Star, ArrowUpRight } from "lucide-react";
import top1Avatar from "@/assets/myWeb/top1avatar.png";
import { useNavigate } from "react-router-dom";

// Dữ liệu giả lập
const rankingData = [
  {
    id: 1,
    name: "Lê Minh Hoàng",
    role: "Senior Product Designer",
    rating: 4.9,
    avatar: "https://avatar.iran.liara.run/public/job/designer/24",
    coverColor: "bg-orange-100",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    role: "Frontend Developer",
    rating: 4.8,
    avatar: "https://avatar.iran.liara.run/public/job/operator/20",
    coverColor: "bg-blue-50",
  },
  {
    id: 3,
    name: "Trần Thị B",
    role: "UI/UX Designer",
    rating: 4.7,
    avatar: "https://avatar.iran.liara.run/public/job/designer/10",
    coverColor: "bg-purple-50",
  },
  {
    id: 4,
    name: "Phạm Văn C",
    role: "Fullstack Dev",
    rating: 4.7,
    avatar: "https://avatar.iran.liara.run/public/job/operator/15",
    coverColor: "bg-green-50",
  },
  {
    id: 5,
    name: "Hoàng Thị D",
    role: "Graphic Designer",
    rating: 4.6,
    avatar: "https://avatar.iran.liara.run/public/job/designer/5",
    coverColor: "bg-pink-50",
  },
  {
    id: 6,
    name: "Lý Gia Kiệt",
    role: "Backend Developer",
    rating: 4.5,
    avatar: "https://avatar.iran.liara.run/public/job/operator/5",
    coverColor: "bg-slate-50",
  },
];

export default function PortfolioRanking() {
  const navigate = useNavigate();
  const top1 = rankingData[0];
  const nextTop = rankingData.slice(1, 5);
  const others = rankingData.slice(5);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Thanh Header cố định */}
      <header className="fixed top-16 left-0 right-0 backdrop-blur-md z-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Bảng xếp hạng Portfolio
        </h1>
      </header>

      <main className="pt-4">
        {/* 2. SECTION TOP 1 - CHIẾM TRỌN CHIỀU NGANG */}
        <section
          className={`relative w-full ${top1.coverColor} py-20 flex justify-center items-center overflow-hidden`}
        >
          {/* Decor hiệu ứng lan tỏa */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>

          <div className="relative z-10 w-[360px] bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] p-10 border border-white flex flex-col items-center">
            {/* Huy hiệu Rank 1 */}
            <div className="absolute -top-5 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-xl">
              <Flame size={20} fill="currentColor" className="animate-pulse" />
              <span className="font-black text-sm  uppercase tracking-tighter">
                Nổi bật tuần
              </span>
              <span className="bg-black/20 px-2.5 py-0.5 rounded-lg ml-1 font-bold">
                #1
              </span>
            </div>

            <img
              src={top1Avatar}
              className="w-52 h-52 rounded-[2.5rem] object-cover shadow-2xl mb-8 border-4 border-orange-50 transition-transform hover:scale-105 duration-500"
              alt={top1.name}
            />

            <div className="text-left">
              {/* Name & Role */}
              <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                {top1.name}
              </h2>
              <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                {top1.role}
              </p>

              {/* Rating Stars - Đóng gói lại cho gọn */}
              <div className="flex items-start justify-start gap-1.5 rounded-2xl w-full mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ml-2 font-black text-gray-800">
                  {top1.rating}
                </span>
              </div>

              {/* --- KHỐI AVATAR MỚI THÊM VÀO ĐÂY --- */}
              {/* Container chính cho nhóm avatar */}
              <div className="relative flex justify-start mb-2 w-full">
                {/* Nhóm avatar xếp chồng */}
                <div className="flex -space-x-3 items-start">
                  {/* Avatar 1 */}
                  <img
                    src={top1Avatar}
                    alt="viewer 1"
                    className="relative z-30 inline-block w-10 h-10 rounded-full ring-2 ring-white object-cover"
                  />
                  {/* Avatar 2 */}
                  <img
                    src={top1Avatar}
                    alt="viewer 2"
                    className="relative z-20 inline-block w-10 h-10 rounded-full ring-2 ring-white object-cover"
                  />
                  {/* Avatar 3 */}
                  <img
                    src={top1Avatar} 
                    alt="viewer 3"
                    className="relative z-10 inline-block w-10 h-10 rounded-full ring-2 ring-white object-cover"
                  />

                  {/* Vòng tròn số +9 */}
                  <div className="relative z-0 inline-flex items-center justify-center w-10 h-10 rounded-full ring-2 ring-white bg-orange-100/80">
                    <span className="text-xs font-bold text-orange-700">
                      +9
                    </span>
                  </div>
                </div>

              </div>
              {/* --- HẾT KHỐI AVATAR MỚI --- */}
            </div>

            <button className="mt-2 w-full bg-black hover:bg-zinc-800 text-white py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
              Xem Portfolio <ArrowUpRight size={20} />
            </button>
          </div>
        </section>

        {/* 3. SECTION RANK 2 TO 5 - GRID */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextTop.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center hover:-translate-y-3 transition-all duration-500 group cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <img
                    src={top1Avatar}
                    className="relative w-28 h-28 rounded-[1.5rem] object-cover shadow-md"
                    alt=""
                  />
                  <span className="absolute -bottom-2 -right-2 bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-white text-sm">
                    #{index + 2}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 leading-tight">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-xs mt-2 font-medium">
                  {item.role}
                </p>
                <div className="mt-4 px-4 py-1.5 bg-yellow-50 rounded-full flex items-center gap-1.5 text-sm font-black text-yellow-600">
                  <Star size={14} fill="currentColor" /> {item.rating}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECTION TIỀM NĂNG (RANK > 5) */}
        <section className="max-w-4xl mx-auto px-6 mt-20 mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
              Ứng viên tiềm năng khác
            </h3>
            <div className="h-px flex-1 bg-gray-100 ml-6"></div>
          </div>

          <div className="space-y-3">
            {others.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-5 bg-white p-5 rounded-[1.5rem] hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group cursor-pointer"
              >
                <span className="text-gray-300 font-black text-lg w-8">
                  {index + 6}
                </span>
                <img
                  src={top1Avatar}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                  alt=""
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.role}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm font-black text-gray-700">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />{" "}
                  {item.rating}
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  <ArrowUpRight size={18} className="text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
