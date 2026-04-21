import { ChevronLeft, Trophy, Flame, Star, ArrowUpRight } from "lucide-react";
import top1Avatar from "@/assets/myWeb/top1avatar.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { portfolioService, PortfolioMainBlockItem } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

interface IntroData {
  portfolioId: number;
  avatar?: string;
  name?: string;
  studyField?: string;
  totalScore?: number;
  rankPosition?: number;
}

const extractIntroData = (portfolio: PortfolioMainBlockItem): IntroData => {
  const blocks = Array.isArray(portfolio.blocks)
    ? portfolio.blocks
    : [portfolio.blocks];
  
  let introData: IntroData = {
    portfolioId: portfolio.portfolioId,
    totalScore: portfolio.ranking?.totalScore,
    rankPosition: portfolio.ranking?.rankPosition,
  };

  for (const block of blocks) {
    if (!block || block.type?.toUpperCase() !== "INTRO") continue;
    
    const data = block.data as Record<string, unknown> || {};
    introData = {
      ...introData,
      avatar: (data.avatar as string) || "",
      name: (data.name as string) || portfolio.portfolio?.name || "",
      studyField: (data.studyField as string) || "",
    };
    break;
  }

  return introData;
};

export default function PortfolioRanking() {
  const navigate = useNavigate();
  const [topPortfolios, setTopPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopPortfolios = async () => {
      try {
        setIsLoading(true);
        const response = await portfolioService.fetchAllPortfolios(1, 5, "0");
        if (response && response.items) {
          setTopPortfolios(response.items);
        }
      } catch (error) {
        console.error("❌ Error loading portfolios:", error);
        notify.error("Không thể tải danh sách portfolio.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopPortfolios();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Thanh Header cố định */}
      <header className="fixed top-16 left-0 right-0 backdrop-blur-md z-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Bảng xếp hạng Portfolio
        </h1>
      </header>

      <main className="pt-4">
        {/* 2. SECTION TOP 1 - CHIẾM TRỌN CHIỀU NGANG */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : topPortfolios.length > 0 ? (
          (() => {
            const top1Portfolio = topPortfolios[0];
            const top1Data = extractIntroData(top1Portfolio);
            return (
              <section className={`relative w-full bg-orange-100 py-20 flex justify-center items-center overflow-hidden`}>
                {/* Decor hiệu ứng lan tỏa */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>

                <div className="relative z-10 w-[360px] bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] p-10 border border-white flex flex-col items-center">
                  {/* Huy hiệu Rank 1 */}
                  <div className="absolute -top-5 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-xl">
                    <Flame size={20} fill="currentColor" className="animate-pulse" />
                    <span className="font-black text-sm uppercase tracking-tighter">
                      Nổi bật tuần
                    </span>
                    <span className="bg-black/20 px-2.5 py-0.5 rounded-lg ml-1 font-bold">
                      #1
                    </span>
                  </div>

                  <img
                    src={top1Data.avatar || top1Avatar}
                    className="w-52 h-52 rounded-[2.5rem] object-cover shadow-2xl mb-8 border-4 border-orange-50 transition-transform hover:scale-105 duration-500"
                    alt={top1Data.name}
                  />

                  <div className="text-left">
                    {/* Name & Role */}
                    <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                      {top1Data.name}
                    </h2>
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                      {top1Data.studyField}
                    </p>

                    {/* Score Display */}
                    <div className="flex items-start justify-start gap-1.5 rounded-2xl w-full mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 font-black text-gray-800">
                        {top1Data.totalScore?.toFixed(1) || "0"}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/portfolio/${top1Portfolio.portfolioId}?viewOnly=true`)}
                    className="mt-2 w-full bg-black hover:bg-zinc-800 text-white py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
                    Xem Portfolio <ArrowUpRight size={20} />
                  </button>
                </div>
              </section>
            );
          })()
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Không có dữ liệu portfolio</p>
          </div>
        )}
        {/* 3. SECTION RANK 2 TO 5 - GRID */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPortfolios.slice(1, 5).map((portfolio, index) => {
              const portfolioData = extractIntroData(portfolio);
              return (
                <div
                  key={portfolio.portfolioId}
                  onClick={() => navigate(`/portfolio/${portfolio.portfolioId}?viewOnly=true`)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center hover:-translate-y-3 transition-all duration-500 group cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src={portfolioData.avatar || top1Avatar}
                      className="relative w-28 h-28 rounded-[1.5rem] object-cover shadow-md"
                      alt={portfolioData.name}
                    />
                    <span className="absolute -bottom-2 -right-2 bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-white text-sm">
                      #{index + 2}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {portfolioData.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2 font-medium">
                    {portfolioData.studyField}
                  </p>
                  <div className="mt-4 px-4 py-1.5 bg-yellow-50 rounded-full flex items-center gap-1.5 text-sm font-black text-yellow-600">
                    <Star size={14} fill="currentColor" /> {portfolioData.totalScore?.toFixed(1) || "0"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
