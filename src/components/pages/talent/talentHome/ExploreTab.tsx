import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquare,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
// import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import SortIcon from "@/assets/myWeb/sort.png";
import BookmarkIcon from "@/assets/myWeb/bookmark.png";
import ShareIcon from "@/assets/myWeb/share1.png";
import top1Avatar from "@/assets/myWeb/top1avatar.png";
import {
  portfolioService,
  PortfolioMainBlockItem,
} from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { notify } from "@/lib/toast";
import CommentModal from "../../recruiter/home/CommentModal";
import { useNavigate } from "react-router-dom";

interface PortfolioMetadata {
  portfolioId: number;
  title: string;
  skills: string[];
}

const extractPortfolioMetadata = (
  portfolio: PortfolioMainBlockItem,
): PortfolioMetadata => {
  const blocks = Array.isArray(portfolio.blocks)
    ? portfolio.blocks
    : [portfolio.blocks];
  let title = portfolio.portfolio?.name || "";
  let skills: string[] = [];

  blocks.forEach((block: any) => {
    if (!block) return;
    const data = block.data || {};
    if (
      block.type === "intro" ||
      block.type === "name" ||
      block.type === "header"
    ) {
      title = data.jobTitle || data.position || data.title || title;
    }
    if (block.type === "skills") {
      if (Array.isArray(data.skills)) {
        skills = data.skills.map((s: any) =>
          (s.name || s).toString().toLowerCase(),
        );
      } else if (Array.isArray(data)) {
        skills = data.map((s: any) => (s.name || s).toString().toLowerCase());
      }
    }
  });

  return {
    portfolioId: portfolio.portfolioId,
    title: title.toLowerCase(),
    skills,
  };
};

export default function ExploreTab() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    position: "",
    skills: "",
    location: "",
  });
  const [filteredPortfolios, setFilteredPortfolios] = useState<
    PortfolioMainBlockItem[]
  >([]);
  const [allPortfolios, setAllPortfolios] = useState<PortfolioMainBlockItem[]>(
    [],
  );
  const [portfolioMetadata, setPortfolioMetadata] = useState<
    Map<number, PortfolioMetadata>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const currentPortfolio = filteredPortfolios[currentIndex];

  const loadPortfolios = async () => {
    try {
      setIsLoading(true);
      const response = await portfolioService.fetchAllPortfolios(1, 10000);
      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        return;
      }

      const portfolios = response.items;
      const metadata = new Map<number, PortfolioMetadata>();
      portfolios.forEach((p) =>
        metadata.set(p.portfolioId, extractPortfolioMetadata(p)),
      );

      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setPortfolioMetadata(metadata);
      setCurrentIndex(0);
    } catch (error) {
      notify.error("Không thể tải danh sách portfolio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handleNext = () => {
    if (currentIndex < filteredPortfolios.length - 1)
      setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleApplyFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      let results = allPortfolios;
      if (filters.position.trim()) {
        results = results.filter((p) =>
          portfolioMetadata
            .get(p.portfolioId)
            ?.title.includes(filters.position.toLowerCase()),
        );
      }
      if (skillTags.length > 0) {
        results = results.filter((p) => {
          const m = portfolioMetadata.get(p.portfolioId);
          return skillTags.some((tag) =>
            m?.skills.some((s) => s.includes(tag.toLowerCase())),
          );
        });
      }
      setFilteredPortfolios(results);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilter = () => {
    setFilters({ position: "", skills: "", location: "" });
    setSkillTags([]);
    setFilteredPortfolios(allPortfolios);
    setCurrentIndex(0);
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar Filter - Thay thế fixed bằng sticky để "hài hòa" với Flexbox */}

      {/* Sidebar Filter Container */}
      <div className="hidden xl:block w-[360px] shrink-0 px-4">
        {/* Thêm sticky và top để nó "dính" khi cuộn, h-fit để background vừa khít nội dung */}
        <div className="sticky top-16 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-fit">
          {/* Header của bộ lọc */}
          <div className="flex items-center gap-2 mb-6">
            <img src={SortIcon} alt="Sort" className="w-7 h-7" />
            <h2 className="text-xl font-bold text-gray-900">Bộ lọc ứng viên</h2>
          </div>

          <div className="space-y-5">
            {/* Position Filter */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block ml-1">
                Vị trí công việc
              </label>
              <input
                type="text"
                placeholder="Nhập vị trí..."
                value={filters.position}
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition-all"
                style={{ backgroundColor: "#F8FAFC" }} // Dùng màu Slate nhạt cho hiện đại
              />
            </div>

            {/* Skills Filter */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block ml-1">
                Kỹ năng
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập kỹ năng..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
                  style={{ backgroundColor: "#F8FAFC" }}
                />
                <button
                  onClick={() => {
                    /* Logic handleAddSkillTag */
                  }}
                  className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Render Tags */}
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 rounded-lg text-xs bg-blue-50 text-blue-600 border-none hover:bg-blue-100 cursor-pointer"
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Filter Button */}
            <button
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
              style={{
                backgroundColor: isLoading ? "#1E40AF" : "#3B82F6",
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tìm...</span>
                </div>
              ) : (
                "Áp dụng bộ lọc"
              )}
            </button>

            {/* Reset Button (Optional but recommended) */}
            <button
              onClick={handleResetFilter}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}

      <main className="flex-1 flex flex-col items-center py-8 px-6 overflow-x-hidden">
        {/* Container chính bao bọc Portfolio */}

        <div className="w-full max-w-4xl space-y-6">
          {/* Khung nội dung Portfolio */}

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col min-h-[750px] transition-all">
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar scroll-smooth">
              {filteredPortfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
                  <p className="text-6xl mb-6">🔍</p>

                  <h3 className="text-xl font-bold">Không tìm thấy ứng viên</h3>

                  <p className="mt-2">
                    Thử thay đổi bộ lọc để xem nhiều kết quả hơn
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <PortfolioRenderer
                    blocks={
                      Array.isArray(currentPortfolio?.blocks)
                        ? currentPortfolio.blocks
                        : [currentPortfolio?.blocks]
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Floating Action Bar - Đưa vào trong main để nó nằm giữa phần content */}
        {filteredPortfolios.length === 0 ? (
          <div></div>
        ) : (
          <div className="fixed bottom-4 z-[100] w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
            >
              <ChevronLeft size={32} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-12 border-x border-slate-100 px-12">
              <button
                onClick={() => setIsCommentModalOpen(true)}
                className="text-blue-500 hover:scale-125 transition-all cursor-pointer"
              >
                <MessageSquare
                  size={30}
                  fill="currentColor"
                  fillOpacity={0.1}
                />
              </button>

              <button className="hover:scale-125 transition-all cursor-pointer">
                <img
                  src={BookmarkIcon}
                  className="w-8 h-8"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg)",
                  }}
                />
              </button>

              <button className="hover:scale-125 transition-all cursor-pointer">
                <img
                  src={ShareIcon}
                  className="w-8 h-8"
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </button>
            </div>

            {/* Next */}

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredPortfolios.length - 1}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
            >
              <ChevronRight size={32} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </main>

      {/* Right Sidebar - Chỉ hiện trên màn hình rất lớn */}

      {/* <aside className="hidden 2xl:block w-[320px] shrink-0 p-6">
        <div className="sticky top-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <Badge className="bg-white/20 text-white border-none mb-4">
            Premium
          </Badge>

          <h2 className="text-2xl font-bold mb-4 leading-tight">
            Tuyển dụng nhanh hơn gấp 2 lần!
          </h2>

          <p className="text-blue-100 text-sm mb-8">
            Nâng cấp để sử dụng AI phân tích ứng viên phù hợp nhất với dự án của
            bạn.
          </p>

          <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all">
            Nâng cấp ngay
          </button>
        </div>
      </aside> */}

      <aside className="hidden 2xl:block w-[320px] shrink-0 p-6 h-fit sticky top-20">
        <div
          onClick={() => navigate("/ranking")}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-6 text-white cursor-pointer shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Trophy size={24} className="animate-bounce" />
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase">
              Bảng xếp hạng tuần
            </span>
          </div>
          <h3 className="text-xl font-black mb-2">TOP PORTFOLIO</h3>
          <p className="text-sm text-orange-100 mb-6">
            Khám phá những gương mặt nổi bật nhất cộng đồng SkillSnap!
          </p>

          {/* Preview Top 1 in Sidebar */}
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
            <img
              src={top1Avatar}
              className="w-10 h-10 rounded-xl object-cover"
              alt=""
            />
            <div>
              <p className="text-xs font-bold opacity-70">#1 Hiện tại</p>
              <p className="font-bold text-sm">Lê Minh Hoàng</p>
            </div>
            <ArrowUpRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>
      {/* Modals */}

      {currentPortfolio && isCommentModalOpen && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          portfolioId={currentPortfolio.portfolioId}
          onSuccess={() => notify.success("Đã gửi nhận xét")}
        />
      )}
    </div>
  );
}
