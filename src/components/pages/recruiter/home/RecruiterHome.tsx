import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import SortIcon from "../../../../assets/myWeb/sort.png";
import ConnectIcon from "../../../../assets/myWeb/connect.png";
import BookmarkIcon from "../../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../../assets/myWeb/share1.png";
import { portfolioService, PortfolioMainBlockItem } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { notify } from "@/lib/toast";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const currentPortfolio = filteredPortfolios[currentIndex];

  // Load portfolios with pagination
  const loadPortfolios = async (page: number = 1) => {
    try {
      setIsLoading(true);
      
      console.log("📡 Loading portfolios from page:", page);
      
      const response = await portfolioService.fetchAllPortfolios(page, pageSize);
      console.log("📦 Loaded portfolios response:", response);
      
      if (!response || !response.items || response.items.length === 0) {
        console.warn("⚠️ API returned empty response");
        setFilteredPortfolios([]);
        setCurrentIndex(0);
        setCurrentPage(page);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || 0);
        setIsLoading(false);
        return;
      }
      
      const portfolios = response.items;
      
      console.log("✅ Loaded", portfolios.length, "portfolios from page", response.page);
      console.log("📊 Pagination info - total:", response.total, "totalPages:", response.totalPages);
      
      // Extract metadata from portfolios
      const metadata = new Map<number, PortfolioMetadata>();
      portfolios.forEach(portfolio => {
        const data = extractPortfolioMetadata(portfolio);
        metadata.set(portfolio.portfolioId, data);
        console.log("📋 Portfolio metadata:", data);
      });
      
      // Replace portfolios with current page (not append like infinite scroll)
      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setPortfolioMetadata(metadata);
      setCurrentIndex(0); // Reset to first item when changing pages
      setCurrentPage(response.page);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load portfolios";
      console.error("❌ Error loading portfolios:", errorMsg);
      notify.error("Không thể tải danh sách portfolio. Vui lòng thử lại sau.");
      
      setFilteredPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all portfolios on component mount
  useEffect(() => {
    loadPortfolios(1);
  }, []);

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

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      pages.push(1);
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Load all portfolios for filtering (use large pageSize to get all results)
  const loadAllPortfoliosForFilter = async () => {
    try {
      console.log("📡 Loading all portfolios for filtering...");
      
      // Load with a large pageSize to get all portfolios at once
      const response = await portfolioService.fetchAllPortfolios(1, 1000);
      
      if (!response || !response.items || response.items.length === 0) {
        console.warn("⚠️ No portfolios found for filtering");
        return [];
      }
      
      // Extract metadata from all portfolios
      const metadata = new Map<number, PortfolioMetadata>();
      response.items.forEach(portfolio => {
        const data = extractPortfolioMetadata(portfolio);
        metadata.set(portfolio.portfolioId, data);
      });
      
      setPortfolioMetadata(metadata);
      console.log("✅ Loaded", response.items.length, "portfolios for filtering");
      
      return response.items;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load portfolios";
      console.error("❌ Error loading portfolios for filtering:", errorMsg);
      notify.error("Lỗi khi tải danh sách portfolio để lọc");
      return [];
    }
  };

  const handleApplyFilter = async () => {
    setIsLoading(true);
    
    try {
      // Load all portfolios for filtering if not already loaded or if filtering
      let portfoliosToFilter = allPortfolios;
      
      // If we only have 10 or fewer portfolios, load all for comprehensive search
      if (allPortfolios.length <= pageSize) {
        portfoliosToFilter = await loadAllPortfoliosForFilter();
        if (portfoliosToFilter.length === 0) {
          setFilteredPortfolios([]);
          setCurrentIndex(0);
          setTotalItems(0);
          setCurrentPage(1);
          setTotalPages(1);
          setIsLoading(false);
          return;
        }
      }
      
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

        setFilteredPortfolios(results);
        setCurrentIndex(0);
        setTotalItems(results.length);
        // Reset to page 1 after filter
        setCurrentPage(1);
        setTotalPages(1);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("❌ Error applying filter:", error);
      setIsLoading(false);
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
    setFilteredPortfolios(allPortfolios);
    setCurrentIndex(0);
    setTotalItems(allPortfolios.length);
    setCurrentPage(1);
    setTotalPages(1);
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

  const handleRefresh = () => {
    // Refresh portfolio list
    setFilteredPortfolios([...allPortfolios]);
    setCurrentIndex(0);
  };

  const handleBookmark = () => {
    if (currentPortfolio) {
      console.log("Bookmark portfolio:", currentPortfolio.portfolioId);
      // TODO: Implement bookmark functionality
    }
  };

  const handleShare = () => {
    if (currentPortfolio) {
      console.log("Share portfolio:", currentPortfolio.portfolioId);
      // TODO: Implement share functionality
    }
  };

  if (!currentPortfolio) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="flex gap-0 pt-10 min-h-screen">
        {/* Left Filter Sidebar */}
        <div className="fixed left-3 top-24 z-10 hidden xl:block">
          <div className="w-[20rem] bg-white rounded-lg p-6 shadow-md max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
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
            // Portfolio Card
          <div className="w-full max-w-3xl min-w-0">
            {/* Navigation Counter */}
            <div className="flex justify-center items-center mb-4">
              <span className="text-sm text-gray-600">
                Portfolio {currentIndex + 1} / {filteredPortfolios.length}
              </span>
            </div>

            {/* Portfolio Card with Scroll */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 relative transition-all duration-300 max-h-[calc(100vh-11rem)] overflow-y-auto overflow-x-hidden"
            >
              {/* Portfolio Blocks Content */}
              <div className="mb-6">
                {currentPortfolio?.blocks && Array.isArray(currentPortfolio.blocks) && currentPortfolio.blocks.length > 0 ? (
                  <PortfolioRenderer blocks={currentPortfolio.blocks} />
                ) : currentPortfolio?.blocks && !Array.isArray(currentPortfolio.blocks) ? (
                  <PortfolioRenderer blocks={[currentPortfolio.blocks]} />
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
              <div className="flex justify-center items-center gap-6 sm:gap-8 py-4 sm:py-6 rounded-lg px-2 mb-4" style={{ backgroundColor: '#EFF6FF' }}>
                <button
                  onClick={handlePrev}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Bỏ qua"
                >
                  <X className="text-red-500" size={30} />
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Kết nối"
                >
                  <img src={ConnectIcon} alt="Connect" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg) brightness(98%) contrast(93%)' }} />
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

            {/* Pagination Info */}
            <div className="flex justify-between items-center mt-4 px-2 mb-6">
              <span className="text-xs text-gray-500">
                Trang {currentPage}/{totalPages} • Tổng {totalItems} portfolios
              </span>
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-center items-center gap-2 px-2">
              {/* Previous Page Button */}
              <button
                onClick={() => loadPortfolios(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white transition-colors text-sm"
              >
                ← Trước
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1 flex-wrap justify-center">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (typeof page === 'number') {
                        loadPortfolios(page);
                      }
                    }}
                    disabled={page === '...' || isLoading}
                    className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                      page === currentPage
                        ? 'bg-blue-500 text-white border border-blue-500'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                    } disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Page Button */}
              <button
                onClick={() => loadPortfolios(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white transition-colors text-sm"
              >
                Sau →
              </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
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
        <aside className="hidden 2xl:block w-[20rem] shrink-0 py-6 pr-4">
          <div className="sticky top-24">
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
      </div>
    </div>
  );
}
