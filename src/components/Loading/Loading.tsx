
import "./Loading.css";

const CustomLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-[#f8fafd] font-['Public_Sans',sans-serif] overflow-hidden">
      
      {/* Background Decor Layer */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="flex flex-col items-center">
        {/* Logo Section */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Ripple Effect */}
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-500/10 duration-[2000ms]" />
          
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Spinner border bo góc 2xl đặc trưng của SkillSnap */}
            <div className="absolute inset-0 animate-spin rounded-[1.5rem] border-[3px] border-slate-100 border-t-blue-600 shadow-xl" />
            
            {/* SVG Icon: Snap/Connection Icon thay cho icon quyển sách */}
            <svg
              className="relative w-10 h-10 text-blue-600 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Name Section */}
        <div className="text-center">
          <h1 className="logo-name-skillsnap">
            Skill<span className="text-blue-600">Snap</span>
          </h1>
          
          {/* Fake Progress Bar */}
          <div className="progress-container-skillsnap">
            <div className="progress-bar-skillsnap" />
          </div>

          <p className="sub-logo-skillsnap">
            Nâng tầm kỹ năng, Chạm tới tương lai
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomLoading;