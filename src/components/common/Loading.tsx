import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-[#f8fafd] font-['Public_Sans',sans-serif] overflow-hidden">
      
      {/* --- BACKGROUND ANIMATION LAYER --- */}
      {/* Các khối cầu gradient mờ chạy nền tạo cảm giác hiện đại */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse delay-700" />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
        
        {/* LOGO BOX ANIMATION */}
        <div className="relative flex items-center justify-center">
          {/* Vòng hào quang lan tỏa (Ripple Effect) */}
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-500/10 duration-[2000ms]" />
          
          {/* Khung Spinner Square Bo Góc đặc trưng của SkillSnap */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Viền xoay chính */}
            <div className="absolute inset-0 animate-spin rounded-[1.5rem] border-[3px] border-slate-100 border-t-blue-600 shadow-xl" />
            
            {/* Logo hoặc Chữ cái đầu tiên ở tâm - Bo góc nhỏ hơn bên trong */}
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
               <span className="text-white font-black text-lg">S</span>
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY SECTION */}
        <div className="text-center space-y-2">
          {/* Tên thương hiệu với tracking cực rộng */}
          <h1 className="font-black text-slate-800 text-xl uppercase tracking-[0.4em] translate-x-[0.2em]">
            SkillSnap
          </h1>
          
          {/* Thanh tiến độ giả (Progress Bar) tạo cảm giác chờ đợi có mục đích */}
          <div className="w-48 h-[3px] bg-slate-100 rounded-full mx-auto mt-4 overflow-hidden">
            <div className="h-full bg-blue-600 w-1/3 rounded-full animate-[loading_2s_ease-in-out_infinite]" />
          </div>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 opacity-80 italic">
            Hệ thống đang khởi tạo dữ liệu...
          </p>
        </div>
      </div>

      {/* Custom Keyframes cho Progress Bar */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%) scaleX(0.5); }
          50% { transform: translateX(100%) scaleX(1); }
          100% { transform: translateX(300%) scaleX(0.5); }
        }
      `}</style>
    </div>
  );
};

export default Loading;