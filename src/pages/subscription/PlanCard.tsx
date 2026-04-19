import { useUserProfile } from "@/hook/useUserProfile";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";
import { SubscriptionPlan } from "@/types/subscription";
import { Check, Crown, Loader2, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPro = plan.name === "Pro";
  const { accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const isCurrentPlan = profile?.planName === plan.name;
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

    setIsLoading(true);

    try {
      // BƯỚC 3: Tạo Subscription Pending
      const subscribeRes = await fetch(`${BASE_URL}/subscriptions/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ planId: plan.id, autoRenew: true }),
      });

      if (!subscribeRes.ok) {
        const errorData = await subscribeRes.json();
        throw new Error(errorData.message || "Không thể tạo gói đăng ký");
      }

      const subscription = await subscribeRes.json();

      // BƯỚC 4: Tạo Payment Link
      const paymentRes = await fetch(`${BASE_URL}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          subscriptionId: subscription.id,
        }),
      });

      if (!paymentRes.ok) {
        throw new Error("Không thể tạo liên kết thanh toán");
      }
      const paymentData = await paymentRes.json();
      if (paymentData.paymentUrl) {
        // Lưu thông tin vào LocalStorage để trang ResultPage có thể đọc được
        localStorage.setItem("pending_payment_id", paymentData.paymentId);
        localStorage.setItem("pending_order_code", paymentData.orderCode);

        notify.success("Đang mở trang thanh toán...");

        // 1. Mở trang thanh toán của PayOS ở TAB MỚI
        window.open(paymentData.paymentUrl, "_blank");

        // 2. Chuyển TAB HIỆN TẠI sang trang kết quả (Polling)
        // Dùng navigate từ hook useNavigate() của react-router-dom
        navigate(
          `/payment/result?paymentId=${paymentData.paymentId}&orderCode=${paymentData.orderCode}`,
        );
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      notify.error(error.message || "Đã xảy ra lỗi trong quá trình kết nối");
    } finally {
      // Tắt trạng thái loading để user có thể tương tác lại nếu quay lại tab cũ
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-[2rem] border-2 transition-all duration-500 bg-white flex flex-col h-full",
        isPro
          ? "border-blue-500 shadow-2xl scale-105 z-10"
          : "border-slate-100 shadow-sm",
        isLoading && "opacity-70 pointer-events-none",
      )}
    >
      {/* Badge phổ biến */}
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40">
          Phổ biến nhất
        </div>
      )}

      {/* Header & Price */}
      <div className="text-center mb-8">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
            plan.name === "Free"
              ? "bg-slate-100 text-slate-400"
              : isPro
                ? "bg-blue-50 text-blue-600"
                : "bg-yellow-50 text-yellow-600",
          )}
        >
          {plan.name === "Free" ? (
            <Star size={32} />
          ) : isPro ? (
            <Zap size={32} />
          ) : (
            <Crown size={32} />
          )}
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
          {plan.name}
        </h3>
        <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest">
          {plan.description}
        </p>
      </div>

      <div className="flex items-baseline justify-center gap-1 mb-10 text-center">
        <span className="text-5xl font-black text-slate-900">
          {plan.price + " đ"}
        </span>
        <span className="text-slate-400 font-bold text-sm">/tháng</span>
      </div>

      {/* Features List */}
      <div className="flex-1 space-y-1 mb-10">
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
                    {feature.value === "-1" ? "Vô hạn" : feature.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || isCurrentPlan} // Không cho bấm nếu là gói hiện tại
        className={cn(
          "w-full py-3 rounded-[1.5rem] font-black text-sm transition-all",
          isCurrentPlan
            ? "bg-emerald-100 text-emerald-600 cursor-default border-2 border-emerald-200" // Style cho gói hiện tại
            : isPro
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-900 hover:bg-black text-white",
          isLoading && "opacity-50 cursor-wait",
        )}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
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
