import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestImage from "../../../assets/testImage/testImage.png";
import BookmarkIcon from "../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../assets/myWeb/share1.png";
import MapIcon from "../../../assets/myWeb/map.png";
import MoneyIcon from "../../../assets/myWeb/money.png";
import ClockIcon from "../../../assets/myWeb/clock.png";
import ArrowIcon from "../../../assets/myWeb/upper-right-arrow.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockCompanyPosts } from "../../../data/mockCompanyPost";
import SortIcon from "../../../assets/myWeb/sort.png";
import { useAppSelector } from "@/store/hook";
export default function TalentHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    position: '',
    experience: '',
    location: ''
  });
  const [filteredPosts, setFilteredPosts] = useState(mockCompanyPosts);
  const [isLoading, setIsLoading] = useState(false);
  const currentPost = filteredPosts[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleViewDetails = () => {
    navigate(`/job/${currentPost.postId}`);
  };

  const handleApplyFilter = () => {
    setIsLoading(true);
    
    // Simulate loading effect
    setTimeout(() => {
      let results = mockCompanyPosts;

      // Lọc theo vị trí công việc
      if (filters.position.trim()) {
        results = results.filter(post =>
          post.position.toLowerCase().includes(filters.position.toLowerCase())
        );
      }

      // Lọc theo kinh nghiệm yêu cầu
      if (filters.experience.trim()) {
        const expValue = parseInt(filters.experience);
        if (!isNaN(expValue)) {
          results = results.filter(post => post.experienceYear <= expValue);
        }
      }

      // Lọc theo địa điểm làm việc
      if (filters.location.trim()) {
        results = results.filter(post =>
          post.address.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      setFilteredPosts(results);
      setCurrentIndex(0); // Reset về công việc đầu tiên trong danh sách lọc
      setIsLoading(false);
      console.log('Applied filters:', filters, 'Results:', results.length);
    }, 300);
  };

  const handleResetFilter = () => {
    setFilters({
      position: '',
      experience: '',
      location: ''
    });
    setFilteredPosts(mockCompanyPosts);
    setCurrentIndex(0);
  };

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("Current User:", user, "Is Authenticated:", isAuthenticated);
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content with Filter on Left */}
      <div className="flex gap-0 pt-8 min-h-screen ">
        {/* Left Filter Sidebar - Attached to left edge */}
        <div className ="fixed left-3 h-screen  ">
          <div className="w-82 bg-white rounded-lg p-6 shadow-md h-fit items-start ml-2 ">
            <div className="flex items-center gap-2 mb-6">
              <img src={SortIcon} alt="Sort" className="w-8 h-8"/>
              <h2 className="text-2xl font-bold text-gray-900">Bộ lọc tìm việc</h2>
            </div>
            <div className="space-y-4">
              {/* Position Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Vị trí công việc</label>
                <input
                  type="text"
                  placeholder="Nhập vị trí..."
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: '#EFF6FF' }}
                />
              </div>

              {/* Experience Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Kinh nghiệm yêu cầu</label>
                <input
                  type="text"
                  placeholder="Nhập kinh nghiệm..."
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: '#EFF6FF' }}
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Địa điểm làm việc</label>
                <input
                  type="text"
                  placeholder="Địa điểm làm việc..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: '#EFF6FF' }}
                />
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

        {/* Center Content - Centered in remaining space */}
        <div className="flex-1 flex items-center justify-center gap-8">
          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || filteredPosts.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={32} className="text-slate-600" />
          </button>

          {/* Card Container */}
          {filteredPosts.length === 0 ? (
            // Màn hình không tìm thấy
            <div className="relative w-125 h-205 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">😕</div>
                <h2 className="text-3xl font-bold text-gray-900">Không tìm thấy công việc</h2>
                <p className="text-gray-600 text-lg">
                  Không có công việc phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác.
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
            // Thẻ công việc bình thường
          <div className="relative w-110 h-162 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
          {/* Background Image */}
          <img 
            src={TestImage} 
            alt="Job Background" 
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>

          {/* Center Content - Job Title & Company Info with Logo */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-row items-start gap-4 w-full px-6">
            {/* Company Logo Circle */}
            <div className="w-15 h-15 rounded-full bg-teal-800 flex-shrink-0"></div>
            
            {/* Company Name, Position & Details */}
            <div className="flex flex-col gap-4">
              {/* Company Name & Position */}
              <div>
                <h2 className="text-xl font-bold text-white">{currentPost.position}</h2>
                <p className="text-sm text-white opacity-90">{currentPost.companyName}</p>
              </div>

              {/* Location and Details */}
              <div className="space-y-3">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <img src={MapIcon} alt="Location" className="w-5 h-5 invert brightness-0" />
                  <span className="text-sm text-white">{currentPost.address}</span>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2">
                  <img src={MoneyIcon} alt="Salary" className="w-5 h-5 invert brightness-0" />
                  <span className="text-sm text-white">{currentPost.salary}</span>
                </div>

                {/* Employment Type */}
                <div className="flex items-center gap-2">
                  <img src={ClockIcon} alt="Type" className="w-5 h-5 invert brightness-0" />
                  <span className="text-sm text-white">{currentPost.employmentType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Icons (Bottom Right) */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-20">
            
            {/* Bookmark Icon */}
            <button className="hover:scale-110 transition-transform">
              <img 
                src={BookmarkIcon} 
                alt="Bookmark" 
                className="w-10 h-10"
              />
            </button>
            
            {/* Share Icon */}
            <button className="hover:scale-110 transition-transform">
              <img 
                src={ShareIcon} 
                alt="Share" 
                className="w-10 h-10"
              />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-0.5">
            {/* View Details Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleViewDetails}
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 transition-colors px-8 py-3 rounded-lg border-2 text-white font-medium w-56"
              >
                <span>Xem chi tiết</span>
                <img src={ArrowIcon} alt="Arrow" className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
          )}

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredPosts.length - 1 || filteredPosts.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={32} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}