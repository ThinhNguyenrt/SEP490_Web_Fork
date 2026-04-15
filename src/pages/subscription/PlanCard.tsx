import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/subscription";
import { Check, Crown, Star, Zap } from "lucide-react";

const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const isPro = plan.name === "Pro";

  return (
    <div
      className={cn(
        "relative p-4 rounded-[2rem] border-2 transition-all duration-500 bg-white flex flex-col h-full",
        isPro
          ? "border-blue-500 shadow-2xl scale-105 z-10"
          : "border-slate-100 shadow-sm",
      )}
    >
      {/* Badge cho gói phổ biến */}
      {isPro && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40">
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
        className={cn(
          "w-full py-3 rounded-[1.5rem] font-black text-sm transition-all active:scale-95 cursor-pointer shadow-lg",
          isPro
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
            : "bg-slate-900 hover:bg-black text-white",
        )}
      >
        {plan.price === 0 ? "BẮT ĐẦU NGAY" : "NÂNG CẤP GÓI"}
      </button>
    </div>
  );
};
export default PlanCard;

// ko có border phổ biến nhất
// import { cn } from "@/lib/utils";
// import { SubscriptionPlan } from "@/types/subscription";
// import { Check, Crown, Star, Zap } from "lucide-react";

// const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
//   const isPro = plan.name === "Pro";
//   const isPremium = plan.name === "Premium";

//   return (
//     <div className={cn(
//       "relative p-6 rounded-[2.5rem] border-2 border-slate-100 bg-white flex flex-col h-full transition-all duration-300 hover:border-slate-200 hover:shadow-md",
//       // Chỉ giữ lại hiệu ứng scale nhẹ và z-index nếu là Pro, bỏ phần border-blue-500
//       isPro && "z-10 md:scale-105"
//     )}>
//       {/* Header của gói */}
//       <div className="text-center mb-8">
//         <div className={cn(
//           "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
//           plan.name === "Free" ? "bg-slate-100 text-slate-400" :
//           isPro ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
//         )}>
//           {plan.name === "Free" ? <Star size={32} /> : isPro ? <Zap size={32} /> : <Crown size={32} />}
//         </div>
//         <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{plan.name}</h3>
//         <p className="text-slate-400 text-[10px] font-bold mt-3 uppercase tracking-[0.2em]">{plan.description}</p>
//       </div>

//       {/* Giá tiền */}
//       <div className="flex items-baseline justify-center gap-1 mb-10 text-center">
//         <span className="text-5xl font-black text-slate-900 leading-none">${plan.price}</span>
//         <span className="text-slate-400 font-bold text-sm">/tháng</span>
//       </div>

//       {/* Danh sách tính năng */}
//       <div className="flex-1 space-y-2 mb-10">
//         {plan.features.map((feature) => {
//           const isNotAvailable = feature.value === "false";
//           return (
//             <div key={feature.featureKey} className="flex items-start gap-3">
//               <div className={cn(
//                 "shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
//                 isNotAvailable ? "bg-slate-50 text-slate-200" : "bg-blue-50 text-blue-500"
//               )}>
//                 <Check size={12} strokeWidth={4} />
//               </div>
//               <div className="flex flex-col">
//                 <span className={cn(
//                   "text-[13px] font-bold transition-colors",
//                   isNotAvailable ? "text-slate-300 line-through" : "text-slate-600"
//                 )}>
//                   {feature.featureName}
//                 </span>
//                 {!isNotAvailable && (
//                   <span className="text-[10px] text-blue-500 font-black uppercase tracking-tight">
//                     {feature.value === "-1" ? "Vô hạn" : feature.value}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Nút hành động */}
//       <button className={cn(
//         "w-full py-4 rounded-2xl font-black text-xs transition-all active:scale-95 cursor-pointer shadow-sm uppercase tracking-widest",
//         isPro
//           ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
//           : "bg-slate-900 hover:bg-black text-white"
//       )}>
//         {plan.price === 0 ? "Bắt đầu miễn phí" : "Nâng cấp ngay"}
//       </button>
//     </div>
//   );
// };

// export default PlanCard;
