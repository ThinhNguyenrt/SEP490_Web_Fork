import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import SortIcon from "../../../../assets/myWeb/sort.png";
import ConnectIcon from "../../../../assets/myWeb/connect.png";
import BookmarkIcon from "../../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../../assets/myWeb/share1.png";
import { portfolioService, PortfolioResponse } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";

// Mock data cho ứng viên
interface Candidate {
  id: string;
  portfolioId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  description: string;
  skills: string[];
  education: {
    degree: string;
    school: string;
    major: string;
    gpa: string;
    years: string;
    achievements: string[];
  };
  isPremium: boolean;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    portfolioId: 12,
    name: "Phạm An Nhiên",
    email: "annhien@gmail.com",
    phone: "0123456789",
    avatar: "https://i.pravatar.cc/300?img=5",
    title: "Nhà thiết kế UI/UX & Lập trình viên Frontend",
    description: "Mặt nhìn thể sợ nhưng chuyên nghề lại khá ổn. Tôi xin nhận trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm",
    skills: ["JavaScript", "React", "Figma", "Design", "Tạo mẫu", "Thiết kế UI", ".Net"],
    education: {
      degree: "Đại học Bách khoa (2016 - 2020)",
      school: "Cơ nhân khoa học máy tính",
      major: "Khoa học máy tính",
      gpa: "GPA: 3.6/4.0 (loại nghiệp loại giỏi)",
      years: "2016 - 2020",
      achievements: [
        "GPA: 3.6/4.0 (loại nghiệp loại giỏi)",
        "Thành viên tích cực của các lớp học về tin học sinh viên"
      ]
    },
    isPremium: true
  },
  {
    id: "2",
    portfolioId: 20,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    avatar: "https://i.pravatar.cc/300?img=12",
    title: "Backend Developer",
    description: "Chuyên phát triển hệ thống backend với kinh nghiệm 3 năm làm việc với Node.js, Python và các hệ quản trị cơ sở dữ liệu",
    skills: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    education: {
      degree: "Đại học Công nghệ (2015 - 2019)",
      school: "Đại học Quốc Gia Hà Nội",
      major: "Công nghệ thông tin",
      gpa: "GPA: 3.4/4.0",
      years: "2015 - 2019",
      achievements: [
        "GPA: 3.4/4.0",
        "Giải nhất cuộc thi lập trình sinh viên"
      ]
    },
    isPremium: false
  },
  {
    id: "3",
    portfolioId: 30,
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    avatar: "https://i.pravatar.cc/300?img=9",
    title: "Full Stack Developer",
    description: "Đam mê phát triển web với kinh nghiệm làm việc cả frontend và backend. Yêu thích học hỏi công nghệ mới",
    skills: ["React", "Vue", "Node.js", "Express", "MySQL", "TypeScript"],
    education: {
      degree: "Đại học Bách khoa (2017 - 2021)",
      school: "Đại học Bách khoa Hà Nội",
      major: "Khoa học máy tính",
      gpa: "GPA: 3.8/4.0",
      years: "2017 - 2021",
      achievements: [
        "GPA: 3.8/4.0 (xuất sắc)",
        "Học bổng toàn phần 4 năm"
      ]
    },
    isPremium: true
  }
];

export default function RecruiterHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    position: '',
    skills: '',
    location: ''
  });
  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);
  const [isLoading, setIsLoading] = useState(false);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const currentCandidate = filteredCandidates[currentIndex];
  const activePortfolioId = currentCandidate?.portfolioId;

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPortfolio(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPortfolio(null);
    }
  };

  const handleApplyFilter = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = mockCandidates;

      if (filters.position.trim()) {
        results = results.filter(candidate =>
          candidate.title.toLowerCase().includes(filters.position.toLowerCase())
        );
      }

      // Lọc theo skill tags
      if (skillTags.length > 0) {
        results = results.filter(candidate =>
          skillTags.some(tag =>
            candidate.skills.some(skill =>
              skill.toLowerCase().includes(tag.toLowerCase())
            )
          )
        );
      }

      setFilteredCandidates(results);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilter = () => {
    setFilters({
      position: '',
      skills: '',
      location: ''
    });
    setSkillTags([]);
    setSkillInput("");
    setFilteredCandidates(mockCandidates);
    setCurrentIndex(0);
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

  const handleSkip = () => {
    handleNext();
  };

  useEffect(() => {
    if (!activePortfolioId) {
      setPortfolio(null);
      setLoadingPortfolio(false);
      return;
    }

    let isCancelled = false;

    const loadPortfolio = async () => {
      setLoadingPortfolio(true);
      try {
        const data = await portfolioService.fetchPortfolioById(activePortfolioId);
        if (!isCancelled) {
          setPortfolio(data ?? null);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        if (!isCancelled) {
          setPortfolio(null);
        }
      } finally {
        if (!isCancelled) {
          setLoadingPortfolio(false);
        }
      }
    };

    void loadPortfolio();

    return () => {
      isCancelled = true;
    };
  }, [activePortfolioId]);

  const handleRefresh = () => {
    // Refresh candidate list
    setFilteredCandidates([...mockCandidates]);
    setCurrentIndex(0);
  };

  const handleBookmark = () => {
    console.log("Bookmark candidate:", currentCandidate.id);
    // TODO: Implement bookmark functionality
  };

  const handleShare = () => {
    console.log("Share candidate:", currentCandidate.id);
    // TODO: Implement share functionality
  };

  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Không tìm thấy ứng viên nào</p>
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
            disabled={currentIndex === 0 || filteredCandidates.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft size={32} className="text-slate-600" />
          </button>

          {/* Candidate Card or Empty State */}
          {filteredCandidates.length === 0 ? (
            // Màn hình không tìm thấy
            <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">😕</div>
                <h2 className="text-3xl font-bold text-gray-900">Không tìm thấy ứng viên</h2>
                <p className="text-gray-600 text-lg">
                  Không có ứng viên phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác.
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
            // Candidate Card
          <div className="w-full max-w-3xl min-w-0">
            {/* Navigation Counter */}
            <div className="flex justify-center items-center mb-4">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {filteredCandidates.length}
              </span>
            </div>

            {/* Candidate Card with Scroll */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 relative transition-all duration-300 max-h-[calc(100vh-11rem)] overflow-y-auto overflow-x-hidden"
            >
              {/* Premium Badge */}
              {currentCandidate.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white px-3 py-1">Premium</Badge>
                </div>
              )}

              {/* Portfolio Content */}
              <div className="mb-6">
                {loadingPortfolio ? (
                  <div className="py-16 flex items-center justify-center gap-3 text-gray-600">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải portfolio...</span>
                  </div>
                ) : portfolio?.blocks?.length ? (
                  <PortfolioRenderer blocks={portfolio.blocks} />
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{currentCandidate.name}</h3>
                    <p className="text-sm text-gray-600">Ứng viên này chưa có portfolio để hiển thị.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-6 sm:gap-8 py-4 sm:py-6 rounded-lg px-2" style={{ backgroundColor: '#EFF6FF' }}>
                <button
                  onClick={handleSkip}
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
          </div>
          )}

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredCandidates.length - 1 || filteredCandidates.length === 0}
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
