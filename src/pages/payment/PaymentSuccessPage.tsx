import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-50">
        <div className="space-y-6">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
          <h2 className="text-3xl font-black text-slate-900">Thành công!</h2>
          <p className="text-slate-600 font-medium">
            Tuyệt vời! Giao dịch của bạn đã được ghi nhận. Hệ thống đang kích hoạt quyền lợi gói dịch vụ cho tài khoản của bạn.
          </p>
          <button
            onClick={() => navigate("/talent-home")}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            BẮT ĐẦU TRẢI NGHIỆM
          </button>
        </div>
      </div>
    </div>
  );
}