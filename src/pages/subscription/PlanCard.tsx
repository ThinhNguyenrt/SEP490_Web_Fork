import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";
import { SubscriptionPlan } from "@/types/subscription";
import { Check, Crown, Loader2, Star, Zap } from "lucide-react";
import { useState } from "react";

const BASE_URL =
  "https://api-gateway.grayforest-11aba44e.southeastasia.azurecontainerapps.io";

const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPro = plan.name === "Pro";
  const { accessToken } = useAppSelector((state) => state.auth);

  const handlePayment = async () => {
    if (plan.price === 0) return;

    if (!accessToken) {
      notify.error("Vui lòng đăng nhập để thực hiện thanh toán");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tạo Subscription
      const subscribeRes = await fetch(
        `${BASE_URL}/api/subscriptions/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ planId: plan.id, autoRenew: true }),
        },
      );

      if (!subscribeRes.ok) {
        const errorData = await subscribeRes.json();
        throw new Error(errorData.message || "Không thể tạo gói đăng ký");
      }

      const subscription = await subscribeRes.json();

      // 2. Tạo Payment Link
      const paymentRes = await fetch(`${BASE_URL}/api/payments/create`, {
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

      if (!paymentRes.ok) throw new Error("Không thể tạo link thanh toán");

      const paymentData = await paymentRes.json();

      // 3. MỞ POPUP THANH TOÁN (THAY VÌ REDIRECT)
      if (paymentData.paymentUrl) {
        const payosConfig = {
          RETURN_URL: "https://sep-490-web-fork.vercel.app/payment/result",
          ELEMENT_ID: "config-id", // Thường không cần nếu dùng popup mặc định
          CHECKOUT_URL: paymentData.paymentUrl,
          onSuccess: (_event: any) => {
            // Chuyển hướng sang trang kết quả của bạn kèm paymentId để polling
            window.location.href = `/payment/result?paymentId=${paymentData.paymentId}`;
          },
          onExit: (_event: any) => {
            notify.info("Bạn đã đóng cửa sổ thanh toán");
          },
          onCancel: (_event: any) => {
            window.location.href = `/payment/cancel?paymentId=${paymentData.paymentId}`;
          },
        };

        const { open } = PayOSCheckout.usePayOS(payosConfig);
        open(); // Mở popup PayOS
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      notify.error(error.message || "Đã xảy ra lỗi");
    } finally {
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
        isLoading && "opacity-70 pointer-events-none", // Hiệu ứng khi đang xử lý
      )}
    >
      {/* Badge cho gói phổ biến */}
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40">
          Phổ biến nhất
        </div>
      )}

      {/* Header của gói */}
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

      {/* Giá tiền */}
      <div className="flex items-baseline justify-center gap-1 mb-10 text-center">
        <span className="text-5xl font-black text-slate-900">
          ${plan.price}
        </span>
        <span className="text-slate-400 font-bold text-sm">/tháng</span>
      </div>

      {/* Danh sách tính năng */}
      <div className="flex-1 space-y-1 mb-10 ">
        {plan.features.map((feature) => {
          const isNotAvailable = feature.value === "false";
          return (
            <div key={feature.featureKey} className="flex items-start gap-3 ">
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

      {/* Nút hành động */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={cn(
          "w-full py-3 rounded-[1.5rem] font-black text-sm transition-all active:scale-95 cursor-pointer shadow-lg flex items-center justify-center",
          isPro
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
            : "bg-slate-900 hover:bg-black text-white",
          isLoading && "bg-slate-400 shadow-none cursor-wait",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ĐANG XỬ LÝ...
          </>
        ) : plan.price === 0 ? (
          "BẮT ĐẦU NGAY"
        ) : (
          "NÂNG CẤP GÓI"
        )}
      </button>
    </div>
  );
};
export default PlanCard;
