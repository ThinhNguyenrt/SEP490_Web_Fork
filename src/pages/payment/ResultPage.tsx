import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  // Lấy ID từ nhiều nguồn (URL params hoặc LocalStorage)
  const paymentId = searchParams.get("paymentId") || localStorage.getItem("pending_payment_id");
  const orderCode = searchParams.get("orderCode") || localStorage.getItem("pending_order_code");

  const [status, setStatus] = useState<"polling" | "success" | "failed" | "timeout">("polling");
  const [message, setMessage] = useState("Đang xác thực giao dịch từ hệ thống...");
  
  const retryCount = useRef(0);
  const maxRetries = 30; 

  useEffect(() => {
    // Nếu không có cả 2 thì mới báo lỗi
    if ((!paymentId && !orderCode) || !accessToken) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin giao dịch để đối soát.");
      return;
    }

    const checkStatus = async () => {
      try {
        let endpoint = `${BASE_URL}/payments/${paymentId}`;
        
        // 6.1 Fallback: Nếu không có paymentId nhưng có orderCode
        if (!paymentId && orderCode) {
          endpoint = `${BASE_URL}/payments/by-order/${orderCode}`;
        }

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Cổng thanh toán chưa phản hồi");

        const data = await res.json();

        if (data.status === "Succeeded") {
          // Xóa vết sau khi thành công
          localStorage.removeItem("pending_payment_id");
          localStorage.removeItem("pending_order_code");
          checkSubscriptionActive();
        } else if (["Failed", "Cancelled", "Expired"].includes(data.status)) {
          setStatus("failed");
          setMessage(`Giao dịch không thành công (Trạng thái: ${data.status})`);
        } else {
          handleRetry();
        }
      } catch (error) {
        handleRetry();
      }
    };

    const checkSubscriptionActive = async () => {
      try {
        // 6.2) Poll gói hiện tại để chắc chắn Backend đã xử lý xong Webhook
        const res = await fetch(`${BASE_URL}/subscriptions/current`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 200) {
          setStatus("success");
          setMessage("Tuyệt vời! Gói dịch vụ của bạn đã được kích hoạt.");
          notify.success("Nâng cấp thành công!");
        } else {
          setMessage("Thanh toán xong, đang đợi hệ thống kích hoạt quyền lợi...");
          handleRetry();
        }
      } catch (error) {
        handleRetry();
      }
    };

    const handleRetry = () => {
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        setTimeout(checkStatus, 3000);
      } else {
        setStatus("timeout");
        setMessage("Thanh toán có thể đã thành công nhưng hệ thống cần thêm thời gian để đồng bộ.");
      }
    };

    checkStatus();
  }, [paymentId, orderCode, accessToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-50">
        {status === "polling" && (
          <div className="space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-blue-200" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Đang kiểm tra...</h2>
            <p className="text-slate-500 leading-relaxed">{message}</p>
            <div className="pt-4 border-t border-dashed border-slate-200">
               <p className="text-[11px] text-slate-400 uppercase font-black tracking-tighter">
                 Đừng đóng trang này cho đến khi có kết quả
               </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
            <h2 className="text-3xl font-black text-slate-900">Thành công!</h2>
            <p className="text-slate-600 font-medium">{message}</p>
            <button 
              onClick={() => navigate("/talent-home")}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              BẮT ĐẦU TRẢI NGHIỆM
            </button>
          </div>
        )}

        {(status === "failed" || status === "timeout") && (
          <div className="space-y-6">
            {status === "failed" ? (
              <XCircle className="h-20 w-20 text-red-500 mx-auto" />
            ) : (
              <Clock className="h-20 w-20 text-yellow-500 mx-auto" />
            )}
            <h2 className="text-2xl font-black text-slate-900">
              {status === "failed" ? "Giao dịch thất bại" : "Đang xử lý chậm"}
            </h2>
            <p className="text-slate-500 font-medium">{message}</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all"
              >
                KIỂM TRA LẠI NGAY
              </button>
              {/* <button 
                onClick={() => navigate("/support")}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                LIÊN HỆ HỖ TRỢ
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}