"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Hoặc 'next/navigation' nếu dùng Next.js
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentResultPage() {
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();
  const paymentId = searchParams.get("paymentId"); // GUID từ bước 4
  const { accessToken } = useAppSelector((state) => state.auth);

  const [status, setStatus] = useState<"polling" | "success" | "failed" | "timeout">("polling");
  const [message, setMessage] = useState("Đang xác thực giao dịch...");
  
  // Dùng Ref để theo dõi số lần retry mà không bị trigger re-render
  const retryCount = useRef(0);
  const maxRetries = 30; // 30 lần * 3 giây = 90 giây (Theo bước 7.1)

  useEffect(() => {
    if (!paymentId || !accessToken) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin thanh toán.");
      return;
    }

    const pollPaymentStatus = async () => {
      try {
        // 6.1) Kiểm tra trạng thái Payment
        const res = await fetch(`${BASE_URL}/api/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Lỗi kết nối API");

        const data = await res.json();

        if (data.status === "Succeeded") {
          // 6.2) Nếu Payment xong, kiểm tra Subscription đã active chưa
          checkSubscriptionActive();
        } else if (["Failed", "Cancelled", "Expired"].includes(data.status)) {
          setStatus("failed");
          setMessage(`Giao dịch đã bị ${data.status.toLowerCase()}.`);
        } else {
          // Tiếp tục polling nếu vẫn Pending/Processing
          handleRetry();
        }
      } catch (error) {
        console.error("Polling error:", error);
        handleRetry();
      }
    };

    const checkSubscriptionActive = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/subscriptions/current`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 200) {
          setStatus("success");
          setMessage("Thanh toán thành công! Gói dịch vụ đã được kích hoạt.");
          notify.success("Nâng cấp thành công!");
          // Tự động chuyển hướng về dashboard sau 3s
          setTimeout(() => navigate("/profile"), 3000);
        } else {
          // Nếu payment success nhưng sub chưa active (do webhook chậm)
          setMessage("Thanh toán khớp, đang kích hoạt gói...");
          handleRetry();
        }
      } catch (error) {
        handleRetry();
      }
    };

    const handleRetry = () => {
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        setTimeout(pollPaymentStatus, 3000); // Polling mỗi 3 giây
      } else {
        setStatus("timeout");
        setMessage("Hệ thống đang đồng bộ. Vui lòng kiểm tra lại sau ít phút.");
      }
    };

    pollPaymentStatus();
  }, [paymentId, accessToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-md w-full border border-slate-100">
        {status === "polling" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Đang kiểm tra</h2>
            <p className="text-slate-500 font-medium">{message}</p>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
              Vui lòng không đóng trình duyệt
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Thành công!</h2>
            <p className="text-slate-500 font-medium mb-6">{message}</p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
            >
              Về trang chủ
            </button>
          </>
        )}

        {(status === "failed" || status === "timeout") && (
          <>
            {status === "failed" ? (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            )}
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {status === "failed" ? "Thất bại" : "Đang xử lý"}
            </h2>
            <p className="text-slate-500 font-medium mb-6">{message}</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
              >
                Thử kiểm tra lại
              </button>
              <button 
                onClick={() => navigate("/subscription")}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Quay lại gói dịch vụ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}