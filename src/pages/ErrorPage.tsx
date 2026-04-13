import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RotateCcw, AlertTriangle, LifeBuoy } from "lucide-react";

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
}

const ErrorPage = ({ 
  code = "404", 
  title = "Trang không tồn tại", 
  message = "Có vẻ như đường dẫn này đã bị hỏng hoặc trang đã bị xóa. Đừng lo lắng, hãy để chúng tôi đưa bạn trở về lộ trình cũ."
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      
      {/* Container chính */}
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Hình ảnh minh họa & Mã lỗi */}
        <div className="relative">
          <h1 className="text-[12rem] md:text-[15rem] font-black text-slate-200/60  leading-none select-none">
            {code}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white  p-6 rounded-[2.5rem] shadow-2xl border border-slate-100  rotate-6 hover:rotate-0 transition-transform duration-500 group">
                <div className="w-24 h-24 bg-red-50  rounded-3xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <AlertTriangle size={48} />
                </div>
            </div>
          </div>
        </div>

        {/* Nội dung thông báo */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800  tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500  max-w-md mx-auto leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 bg-white  border border-slate-200  text-slate-600  rounded-2xl font-bold text-sm hover:bg-slate-50  transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
          
          <button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Home size={18} /> Về trang chủ
          </button>
        </div>

        {/* Footer trợ giúp */}
        <div className="pt-12 flex items-center justify-center gap-8 border-t border-slate-200/60 ">
           <button className="flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest">
              <RotateCcw size={14} /> Thử tải lại trang
           </button>
           <button className="flex items-center gap-2 text-[12px] font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest">
              <LifeBuoy size={14} /> Trung tâm trợ giúp
           </button>
        </div>
      </div>

    </div>
  );
};

export default ErrorPage;