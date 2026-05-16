import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-50">
        <div className="space-y-6">
          <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Giao dịch đã bị hủy</h2>
          <p className="text-slate-500 font-medium">
            Thanh toán không thành công hoặc bạn đã hủy bỏ yêu cầu giao dịch. Vui lòng kiểm tra lại tài khoản hoặc thử lại.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/subscription")} // Đường dẫn tới trang chọn gói của bạn
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all"
            >
              THỬ THANH TOÁN LẠI
            </button>
            <button
              onClick={() => navigate("/talent-home")}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              QUAY VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}