import { useState, useRef } from "react";
import { Camera, User, Pencil, ArrowRight } from "lucide-react";

const WelcomePage = () => {
  const [displayName, setDisplayName] = useState("An Nhiên");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      {/* 1. Nền phủ toàn màn hình với Blur mạnh */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />

      {/* 2. Box nội dung - Thu nhỏ lại (max-w-[420px]) */}
      <div className="relative z-10 bg-white  w-full max-w-[420px] rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col no-scrollbar">
        {/* Header - Padding nhỏ lại */}
        <div className="p-8 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Chào mừng người mới
          </h1>
          <p className="text-[13px] text-slate-500 mt-2 leading-relaxed px-2 font-medium">
            Hãy điền đầy đủ thông tin để mọi người có thể nhận ra bạn và kết nối
            dễ dàng hơn
          </p>
        </div>

        {/* Khu vực Ảnh bìa & Avatar - Chiều cao giảm xuống (h-40) */}
        <div className="relative h-40 shrink-0">
          <div
            className="w-full h-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center cursor-pointer relative"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop')`,
            }}
            onClick={() => coverInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input type="file" hidden ref={coverInputRef} accept="image/*" />

          {/* Avatar - Nhỏ lại một chút */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div
              className="w-24 h-24 rounded-[1.8rem] border-[6px] border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 shadow-xl cursor-pointer flex items-center justify-center relative group"
              onClick={() => avatarInputRef.current?.click()}
            >
              <User size={36} className="text-slate-400" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.8rem] flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input type="file" hidden ref={avatarInputRef} accept="image/*" />
          </div>
        </div>

        {/* Form điền thông tin - Tinh giản khoảng cách */}
        <div className="p-8 pt-16 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
              Tên hiển thị <span className="text-red-500">(bắt buộc)</span>
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"
                size={18}
              />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-11 pr-11 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder="Nhập tên..."
              />
              <Pencil
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400"
                size={16}
              />
            </div>
          </div>

          <button className="w-full py-4 bg-[#0288D1] hover:bg-[#0288D1] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer">
            Hoàn thành
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default WelcomePage;
