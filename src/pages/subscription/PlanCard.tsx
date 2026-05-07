import { useUserProfile } from "@/hook/useUserProfile";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";
import { SubscriptionPlan } from "@/types/subscription";
import { Check, Crown, Loader2, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPro = plan.name === "Pro";
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const isCurrentPlan = profile?.planName === plan.name;
  console.log("Current User:", user);

  const handlePayment = async () => {
    // 1. Kiểm tra gói Free
    if (plan.price === 0) {
      notify.info("Gói miễn phí đã được kích hoạt mặc định");
      return;
    }

    // 2. Kiểm tra Đăng nhập
    if (!accessToken) {
      notify.error("Vui lòng đăng nhập để thực hiện thanh toán");
      return;
    }

    // --- CHIẾN THUẬT MỞ TAB CHỜ ---
    const paymentWindow = window.open("", "_blank");
    if (paymentWindow) {
      paymentWindow.document.write(`
      <html>
        <head><title>Đang kết nối...</title></head>
        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
          <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite;"></div>
          <p style="margin-top: 20px; color: #64748b;">Đang chuyển hướng đến cổng thanh toán PayOS...</p>
          <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </body>
      </html>
    `);
    }

    setIsLoading(true);

    try {
      console.log("token", accessToken);
      // BƯỚC 3: Tạo Subscription Pending
      const subscribeRes = await fetch(
        `https://subscription-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/Subscriptions/subscribe`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planId: plan.id, autoRenew: true }),
        },
      );

      if (!subscribeRes.ok) {
        throw new Error("Không thể tạo gói đăng ký");
      }

      const subscription = await subscribeRes.json();

      // BƯỚC 4: Tạo Payment Link
      const paymentRes = await fetch(
        `https://payment-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/payments/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: plan.id,
            subscriptionId: subscription.id,
          }),
        },
      );

      if (!paymentRes.ok) {
        throw new Error("Không thể tạo liên kết thanh toán");
      }

      const paymentData = await paymentRes.json();

      if (paymentData.paymentUrl && paymentWindow) {
        // BƯỚC 5: CẬP NHẬT TAB VÀ ĐIỀU HƯỚNG
        paymentWindow.location.href = paymentData.paymentUrl;

        localStorage.setItem("pending_payment_id", paymentData.paymentId);
        localStorage.setItem("pending_order_code", paymentData.orderCode);

        notify.success("Đang mở trang thanh toán...");

        navigate(
          `/payment/result?paymentId=${paymentData.paymentId}&orderCode=${paymentData.orderCode}`,
        );
      } else {
        paymentWindow?.close();
        throw new Error("Dữ liệu thanh toán không hợp lệ");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      paymentWindow?.close();
      notify.error(error.message || "Đã xảy ra lỗi trong quá trình kết nối");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEnumPlanName = (name: string) => {
    switch (name) {
      case "Free":
        return "Gói Miễn Phí";
      case "Pro":
        return "Gói Pro";
      case "Premium":
        return "Gói Premium";
      default:
        return name;
    }
  };
  return (
    <div
      className={cn(
        "relative p-6 rounded-[2rem] border-2 transition-all duration-500 bg-white flex flex-col h-full justify-between",
        isPro
          ? "border-blue-500 shadow-2xl md:scale-105 z-10" // Chỉ scale mượt trên desktop, tránh lỗi tràn viền mobile
          : "border-slate-100 shadow-sm hover:border-slate-200",
        isLoading && "opacity-70 pointer-events-none",
      )}
    >
      {/* Group trên: Bao bọc Content để chừa Button tự nhảy xuống đáy Card */}
      <div className="flex flex-col flex-1 w-full">
        {/* Badge phổ biến */}
        {isPro && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40 whitespace-nowrap">
            Phổ biến nhất
          </div>
        )}

        {/* Header & Price */}
        <div className="text-center mb-6">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
              plan.name === "Free"
                ? "bg-slate-100 text-slate-400"
                : isPro
                  ? "bg-blue-50 text-blue-600"
                  : "bg-yellow-50 text-yellow-600",
            )}
          >
            {plan.name === "Free" ? (
              <Star size={32} />
            ) : plan.name === "Pro" ? (
              <Zap size={32} />
            ) : (
              <Crown size={32} />
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            {handleEnumPlanName(plan.name)}
          </h3>
          <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest min-h-[32px]">
            {plan.description}
          </p>
        </div>

        {/* Khối hiển thị Giá Tiền (đã format dấu chấm phân tách phần nghìn) */}
        <div className="flex items-baseline justify-center gap-1 mb-8 text-center">
          <span className="text-4xl font-black text-slate-900">
            {plan.price.toLocaleString("vi-VN") + " đ"}
          </span>
          <span className="text-slate-400 font-bold text-xs">/tháng</span>
        </div>

        {/* Features List */}
        <div className="flex-1 space-y-3 mb-8">
          {plan.features.map((feature) => {
            const isNotAvailable = feature.value === "false";
            return (
              <div key={feature.featureKey} className="flex items-start gap-3">
                <div
                  className={cn(
                    "shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                    isNotAvailable
                      ? "bg-slate-50 text-slate-300"
                      : "bg-blue-50 text-blue-500",
                  )}
                >
                  <Check size={12} strokeWidth={4} />
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      isNotAvailable
                        ? "text-slate-300 line-through"
                        : "text-slate-700",
                    )}
                  >
                    {feature.featureName}
                  </span>
                  {!isNotAvailable && (
                    <span className="text-[11px] text-blue-500 font-black uppercase tracking-tighter">
                      {feature.type === "Boolean"
                        ? feature.value === "true"
                          ? "Có"
                          : "Không"
                        : feature.value === "-1"
                          ? "Vô hạn"
                          : feature.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button - Đã được fix căn giữa icon Loader2 */}
      <button
        onClick={handlePayment}
        disabled={isLoading || isCurrentPlan}
        className={cn(
          "w-full py-3.5 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-2",
          isCurrentPlan
            ? "bg-emerald-100 text-emerald-600 cursor-default border-2 border-emerald-200"
            : isPro
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              : "bg-slate-900 hover:bg-black text-white",
          isLoading && "opacity-50 cursor-wait",
        )}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : isCurrentPlan ? (
          "GÓI BẠN ĐANG DÙNG"
        ) : (
          "NÂNG CẤP NGAY"
        )}
      </button>
    </div>
  );
};

export default PlanCard;