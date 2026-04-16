import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Plus, MessageSquare } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import SortIcon from "../../../assets/myWeb/sort.png";
import BookmarkIcon from "../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../assets/myWeb/share1.png";
import { portfolioService, PortfolioMainBlockItem } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import CommentModal from "./CommentModal";
import BookmarkModal from "./BookmarkModal";
import { notify } from "@/lib/toast";
import { RootState } from "@/store";

// Helper to extract searchable data from portfolio
interface PortfolioMetadata {
  portfolioId: number;
  title: string;
  skills: string[];
}

const extractPortfolioMetadata = (portfolio: PortfolioMainBlockItem): PortfolioMetadata => {
  const blocks = Array.isArray(portfolio.blocks) ? portfolio.blocks : [portfolio.blocks];
  
  let title = portfolio.portfolio?.name || "";
  let skills: string[] = [];

  blocks.forEach((block: any) => {
    if (!block) return;
    const data = block.data || {};

    // Extract title from intro/header block
    if (block.type === "intro" || block.type === "name" || block.type === "header") {
      title = data.jobTitle || data.position || data.title || title;
    }

    // Extract skills
    if (block.type === "skills") {
      if (Array.isArray(data.skills)) {
        skills = data.skills.map((s: any) => (s.name || s).toString().toLowerCase());
      } else if (Array.isArray(data)) {
        skills = data.map((s: any) => (s.name || s).toString().toLowerCase());
      }
    }
  });

  return {
    portfolioId: portfolio.portfolioId,
    title: title.toLowerCase(),
    skills
  };
};

export default function RecruiterHome() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    position: '',
    skills: '',
    location: ''
  });
  const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [allPortfolios, setAllPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [portfolioMetadata, setPortfolioMetadata] = useState<Map<number, PortfolioMetadata>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [savedPortfolios, setSavedPortfolios] = useState<Set<number>>(new Set());

  const currentPortfolio = filteredPortfolios[currentIndex];

  // Load saved portfolios to restrict duplicate saves
  const loadSavedPortfolios = useCallback(async (token: string | null) => {
    try {
      if (!token) return;

      console.log("📡 Loading saved portfolios...");
      const savedData = await portfolioService.fetchSavedPortfolios(token);
      const savedIds = new Set(savedData.map((p: any) => p.portfolioId));
      setSavedPortfolios(savedIds);
      console.log("✅ Loaded saved portfolio IDs:", savedIds);
    } catch (error) {
      console.warn("⚠️ Could not load saved portfolios:", error);
      // Don't fail if we can't load saved portfolios, just continue
    }
  }, []);

  // Load all portfolios (no pagination - load all at once)
  const loadPortfolios = useCallback(async () => {
    try {
      setIsLoading(true);
      
      console.log("📡 Loading all portfolios...");
      
      // Load all portfolios with a large pageSize
      const response = await portfolioService.fetchAllPortfolios(1, 10000);
      console.log("📦 Loaded portfolios response:", response);
      
      if (!response || !response.items || response.items.length === 0) {
        console.warn("⚠️ API returned empty response");
        setFilteredPortfolios([]);
        setCurrentIndex(0);
        setIsLoading(false);
        return;
      }
      
      const portfolios = response.items;
      
      console.log("✅ Loaded", portfolios.length, "portfolios in total");
      
      // Backend already sorted by rank with sort=0 (rank_asc)
      
      // Extract metadata from portfolios
      const metadata = new Map<number, PortfolioMetadata>();
      portfolios.forEach(portfolio => {
        const data = extractPortfolioMetadata(portfolio);
        metadata.set(portfolio.portfolioId, data);
        console.log("📋 Portfolio metadata:", data);
      });
      
      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setPortfolioMetadata(metadata);
      setCurrentIndex(0);

      // Load saved portfolios to check which ones are already saved
      await loadSavedPortfolios(accessToken);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load portfolios";
      console.error("❌ Error loading portfolios:", errorMsg);
      notify.error("Không thể tải danh sách portfolio. Vui lòng thử lại sau.");
      
      setFilteredPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadSavedPortfolios]);

  // Load all portfolios on component mount
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const handleNext = () => {
    if (currentIndex < filteredPortfolios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleResetFilter = () => {
    setFilters({
      position: '',
      skills: '',
      location: ''
    });
    setSkillTags([]);
    setSkillInput("");
    
    // Backend already sorted by rank with sort=0 (rank_asc), keep original order
    const sortedPortfolios = [...allPortfolios];
    
    setFilteredPortfolios(sortedPortfolios);
    setCurrentIndex(0);
  };

  const handleApplyFilter = async () => {
    setIsLoading(true);
    
    try {
      // Use all portfolios that are already loaded
      const portfoliosToFilter = allPortfolios;
      
      setTimeout(() => {
        let results = portfoliosToFilter;

        // Filter by position
        if (filters.position.trim()) {
          const positionKeyword = filters.position.toLowerCase();
          results = results.filter(portfolio => {
            const metadata = portfolioMetadata.get(portfolio.portfolioId);
            if (!metadata) return false;
            return metadata.title.includes(positionKeyword);
          });
          console.log("🔍 After position filter:", results.length, "portfolios");
        }

        // Filter by skill tags
        if (skillTags.length > 0) {
          results = results.filter(portfolio => {
            const metadata = portfolioMetadata.get(portfolio.portfolioId);
            if (!metadata) return false;
            
            // Check if portfolio has at least one of the selected skills
            return skillTags.some(tag => {
              const tagLower = tag.toLowerCase();
              return metadata.skills.some(skill => 
                skill.includes(tagLower) || tagLower.includes(skill)
              );
            });
          });
          console.log("🔍 After skills filter:", results.length, "portfolios");
        }

        // Backend already sorted by rank with sort=0 (rank_asc), keep original order

        setFilteredPortfolios(results);
        setCurrentIndex(0);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("❌ Error applying filter:", error);
      setIsLoading(false);
    }
  };

  const handleAddSkillTag = () => {
    if (skillInput.trim() && !skillTags.includes(skillInput.trim())) {
      setSkillTags([...skillTags, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkillTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter(tag => tag !== tagToRemove));
  };

  const handleBookmark = () => {
    if (currentPortfolio) {
      console.log("Opening bookmark modal for portfolio:", currentPortfolio.portfolioId);
      setIsBookmarkModalOpen(true);
    }
  };

  const handleCommentSuccess = () => {
    console.log("✅ Comment submitted/updated successfully");
    // Close the comment modal
    setIsCommentModalOpen(false);
  };

  const handleShare = () => {
    if (currentPortfolio) {
      console.log("Share portfolio:", currentPortfolio.portfolioId);
      // TODO: Implement share functionality
    }
  };

  if (!currentPortfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Không tìm thấy portfolio nào</p>
          <Button onClick={handleResetFilter} className="bg-[#0288D1]">
            Đặt lại bộ lọc
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex gap-0 pt-6 min-h-screen">
        {/* Left Filter Sidebar */}
        <div className="fixed left-3 top-20 z-10 hidden xl:block">
          <div className="w-[20rem] bg-white rounded-lg p-4 shadow-md max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-2 mb-6">
              <img src={SortIcon} alt="Sort" className="w-8 h-8"/>
              <h2 className="text-2xl font-bold text-gray-900">Bộ lọc ứng viên</h2>
            </div>
            
            <div className="space-y-4">
              {/* Position Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Vị trí công việc
                </label>
                <input
                  type="text"
                  placeholder="Nhập vị trí..."
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: '#EFF6FF' }}
                />
              </div>

              {/* Skills Filter with Tags */}
              <div >
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Kỹ năng
                </label>
                <div className="flex gap-2 mb-11">
                  <input
                    type="text"
                    placeholder="Nhập kỹ năng..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkillTag()}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                    style={{ backgroundColor: '#EFF6FF' }}
                  />
                  <button
                    onClick={handleAddSkillTag}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
                {skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-300"
                        onClick={() => handleRemoveSkillTag(tag)}
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
                className="w-full mt-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: isLoading ? '#1E40AF' : '#3B82F6',
                  opacity: isLoading ? 0.8 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <span>Áp dụng bộ lọc</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Candidate Card */}
        <div className="flex-1 min-w-0 flex items-center justify-center gap-4 xl:gap-6 xl:ml-88 mr-2 lg:mr-4">
          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || filteredPortfolios.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft size={32} className="text-slate-600" />
          </button>

          {/* Portfolio Card or Empty State */}
          {filteredPortfolios.length === 0 ? (
            // Màn hình không tìm thấy
            <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">😕</div>
                <h2 className="text-3xl font-bold text-gray-900">Không tìm thấy portfolio</h2>
                <p className="text-gray-600 text-lg">
                  Không có portfolio phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác.
                </p>
                <button
                  onClick={handleResetFilter}
                  className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Quay lại danh sách gốc
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Portfolio Card - No outer frame */}
              <div className="w-full max-w-3xl min-w-0">
                {/* Portfolio Blocks Content */}
                <div className="mb-3 p-4 sm:p-5 md:p-6">
                  {currentPortfolio?.blocks && Array.isArray(currentPortfolio.blocks) && currentPortfolio.blocks.length > 0 ? (
                    <PortfolioRenderer blocks={currentPortfolio.blocks} ranking={currentPortfolio.ranking} />
                  ) : currentPortfolio?.blocks && !Array.isArray(currentPortfolio.blocks) ? (
                    <PortfolioRenderer blocks={[currentPortfolio.blocks]} ranking={currentPortfolio.ranking} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {currentPortfolio?.portfolio?.name || "Portfolio"}
                      </h3>
                      <p className="text-sm text-gray-600">Portfolio này chưa có nội dung để hiển thị.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-6 sm:gap-8 py-3 sm:py-4 rounded-lg px-2 mb-2" style={{ backgroundColor: '#EFF6FF' }}>
                  <button
                    onClick={() => setIsCommentModalOpen(true)}
                    className="flex items-center justify-center gap-2 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                    title="Nhận xét"
                  >
                    <MessageSquare className="text-blue-500" size={30} />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                    title="Lưu"
                  >
                    <img src={BookmarkIcon} alt="Bookmark" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg) brightness(98%) contrast(93%)' }} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                    title="Chia sẻ"
                  >
                    <img src={ShareIcon} alt="Share" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%)' }} />
                  </button>
                </div>
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-center mt-4">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
            </>
          )}

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredPortfolios.length - 1 || filteredPortfolios.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight size={32} className="text-slate-600" />
          </button>
        </div>

        {/* Right Premium Section */}
        <aside className="hidden 2xl:block w-[20rem] shrink-0 py-6 pr-4 h-fit">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              {/* Premium Badge */}
              <div className="mb-6">
                <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Premium
                </span>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tuyển dụng nhanh hơn gấp 2 lần!
              </h2>
              
              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                Nâng cấp để tuyển dụng nhanh hơn với các ứng viên được phân tích từ AI phù hợp với yêu cầu của bạn.
              </p>
              
              {/* CTA Button */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </aside>

        {/* Comment Modal */}
        {currentPortfolio && (
          <CommentModal
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            onSuccess={() => {
              handleCommentSuccess();
            }}
          />
        )}

        {/* Bookmark Modal */}
        {currentPortfolio && (
          <BookmarkModal
            isOpen={isBookmarkModalOpen}
            onClose={() => setIsBookmarkModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            isAlreadySaved={savedPortfolios.has(currentPortfolio.portfolioId)}
            onSuccess={() => {
              // Mark as saved
              setSavedPortfolios(prev => new Set([...prev, currentPortfolio.portfolioId]));
              console.log("Portfolio bookmarked successfully");
            }}
          />
        )}
      </div>
    </div>
  );
}
