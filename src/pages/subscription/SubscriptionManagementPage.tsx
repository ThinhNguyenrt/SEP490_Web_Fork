import { useEffect, useState } from "react";
import {
  History,
  Crown,
  CheckCircle2,
  Zap,
  Clock,
  CreditCard,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Entitlements, SubscriptionHistoryItem } from "@/types/subscription";

// Base URLs từ Gateway của bạn
const SUB_SERVICE_URL =
  "https://subscription-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io";
const PAY_SERVICE_URL =
  "https://payment-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io";
const PAGE_SIZE = 5;

export default function SubscriptionManagementPage() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  // States dữ liệu
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [transactions, setTransactions] = useState<SubscriptionHistoryItem[]>(
    [],
  );

  // States UI & Paging
  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 1. Fetch Quyền lợi chi tiết (Entitlements)
  useEffect(() => {
    const fetchEntitlements = async () => {
      if (!accessToken) return;
      try {
        setLoadingSub(true);
        const res = await fetch(
          `${SUB_SERVICE_URL}/api/Subscriptions/my-entitlements`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setEntitlements(data);
        } else {
          setEntitlements(null);
        }
      } catch (error) {
        console.error("Error fetching entitlements:", error);
      } finally {
        setLoadingSub(false);
      }
    };
    fetchEntitlements();
  }, [accessToken]);

  // 2. Fetch Lịch sử giao dịch (Paging 5 items)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!accessToken) return;
      try {
        setLoadingTable(true);
        const res = await fetch(
          `${PAY_SERVICE_URL}/api/payments/my-history?page=${page}&pageSize=${PAGE_SIZE}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
          setHasMore(data.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoadingTable(false);
      }
    };
    fetchHistory();
  }, [accessToken, page]);

  // Helper render từng dòng feature
  const renderFeatureItem = (
    key: string,
    value: string | boolean,
    label: string,
  ) => {
    const isBoolean = typeof value === "boolean";
    const isActive = isBoolean ? value : parseInt(value as string) !== 0;

    return (
      <li
        key={key}
        className="flex items-center justify-between p-3 bg-white/10 rounded-2xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-1 rounded-lg",
              isActive ? "text-green-300" : "text-red-300 opacity-50",
            )}
          >
            {isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          </div>
          <span
            className={cn(
              "text-xs font-bold",
              !isActive && "opacity-50 line-through",
            )}
          >
            {label}
          </span>
        </div>
        {!isBoolean && (
          <span className="text-[10px] font-black bg-white text-blue-600 px-2 py-0.5 rounded-md shadow-sm">
            {value === "-1" ? "∞" : value}
          </span>
        )}
      </li>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Gói dịch vụ của tôi
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Quản lý quyền lợi và lịch sử thanh toán của bạn.
          </p>
        </div>
        <button
          onClick={() => navigate("/subscription")}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 cursor-pointer active:scale-95 uppercase"
        >
          <Sparkles size={16} /> Nâng cấp ngay
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CURRENT ENTITLEMENTS */}
        <div className="lg:col-span-1 space-y-6">
          {loadingSub ? (
            <div className="h-[450px] bg-slate-50 rounded-[2.5rem] animate-pulse flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-300" />
            </div>
          ) : entitlements ? (
            <div
              className={cn(
                "rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col h-full transition-all duration-500",
                // Logic đổi màu dựa trên planName
                entitlements.planName === "Premium"
                  ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-yellow-200"
                  : "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-blue-200",
              )}
            >
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Crown size={20} className="text-white" />
                  </div>
                  <span className="font-black tracking-widest text-[10px] uppercase opacity-90">
                    Gói hiện tại
                  </span>
                </div>

                <h2 className="text-4xl font-black mb-2 tracking-tight uppercase drop-shadow-sm">
                  {entitlements.planName}
                </h2>

                <div
                  className={cn(
                    "flex items-center gap-2 text-[11px] font-bold mb-8",
                    entitlements.planName === "Premium"
                      ? "text-amber-950/70"
                      : "text-blue-100",
                  )}
                >
                  <Clock size={14} />
                  <span>
                    Hết hạn:{" "}
                    {format(new Date(entitlements.expiredAt), "dd/MM/yyyy")}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest mb-3 opacity-80",
                      entitlements.planName === "Premium"
                        ? "text-amber-950/60"
                        : "text-white/60",
                    )}
                  >
                    Quyền lợi khả dụng:
                  </p>

                  {/* Render feature items với logic màu sắc bên trong hàm renderFeatureItem nếu cần */}
                  {renderFeatureItem(
                    "MAX_APPLY",
                    entitlements.features.MAX_APPLY,
                    "Lượt ứng tuyển",
                  )}
                  {renderFeatureItem(
                    "MAX_PORTFOLIOS",
                    entitlements.features.MAX_PORTFOLIOS,
                    "Portfolio tối đa",
                  )}
                  {renderFeatureItem(
                    "AI_MATCHING",
                    entitlements.features.AI_MATCHING,
                    "Gợi ý AI Matching",
                  )}
                  {renderFeatureItem(
                    "BOOST_PROFILE",
                    entitlements.features.BOOST_PROFILE,
                    "Đẩy tin hồ sơ",
                  )}
                </div>
              </div>


              <Zap className="absolute -bottom-12 -right-12 w-48 h-48 text-white/10 rotate-12 pointer-events-none" />
            </div>
          ) : (
            /* EMPTY PLAN STATE (Giữ nguyên) */
            <div className="bg-slate-50 rounded-[2.5rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center text-center justify-center min-h-[450px]">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">
                Chưa có gói đăng ký
              </h3>
              <p className="text-slate-500 text-xs font-bold mt-2 mb-8 leading-relaxed">
                Bạn đang dùng bản miễn phí. Nâng cấp ngay để mở khóa các tính
                năng AI Matching.
              </p>
              <button
                onClick={() => navigate("/subscription")}
                className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm cursor-pointer"
              >
                XEM CÁC GÓI ƯU ĐÃI
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: TRANSACTION HISTORY TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-8 border-b border-slate-50 flex items-center gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-900">
                <History size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight  uppercase">
                Lịch sử giao dịch
              </h3>
            </div>

            <div className="flex-1 relative overflow-x-auto">
              {loadingTable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" />
                </div>
              )}

              {transactions.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Order Code
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Amount
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/40 transition-all"
                      >
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm tracking-tight">
                              #{tx.orderCode}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {format(
                                new Date(tx.createdAt),
                                "dd MMM, yyyy · HH:mm",
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-slate-900">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5 shadow-sm",
                              tx.status === "Succeeded"
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100",
                            )}
                          >
                            {tx.status === "Succeeded" ? (
                              <CheckCircle2 size={10} strokeWidth={4} />
                            ) : (
                              <Clock size={10} strokeWidth={4} />
                            )}
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                !loadingTable && (
                  <div className="flex flex-col items-center justify-center py-28 text-center px-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                      <CreditCard size={40} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 uppercase ">
                      Không tìm thấy lịch sử giao dịch
                    </h4>
                    <p className="text-slate-400 text-xs font-bold mt-1">
                      Lịch sử thanh toán sẽ xuất hiện sau khi bạn hoàn tất giao
                      dịch đầu tiên.
                    </p>
                  </div>
                )
              )}
            </div>

            {/* SIMPLE PREV/NEXT PAGINATION */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trang <span className="text-blue-600">{page}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1 || loadingTable}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] disabled:opacity-30 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                  <ChevronLeft size={14} strokeWidth={3} /> Trước
                </button>
                <button
                  disabled={!hasMore || loadingTable}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] disabled:opacity-30 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                  Sau <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
