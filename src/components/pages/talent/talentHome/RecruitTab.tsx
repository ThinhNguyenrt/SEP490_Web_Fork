import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets & Icons
import TestImage from "@/assets/testImage/testImage.png";
import BookmarkIcon from "@/assets/myWeb/bookmark.png";
import MapIcon from "@/assets/myWeb/map.png";
import MoneyIcon from "@/assets/myWeb/money.png";
import SortIcon from "@/assets/myWeb/sort.png";
import { Search, Briefcase, GraduationCap, Loader2 } from "lucide-react";

import { useAppSelector } from "@/store/hook";
// import {  useAppDispatch } from "@/store/hook";
// import {
//   addSavedPost,
//   removeSavedPost,
// } from "@/store/features/savedPosts/savedPostsSlice";
import { fetchCompanyPosts, saveCompanyPost } from "@/services/company.api";
import { CompanyPostAPI } from "@/types/companyPost";
// import { notify } from "@/lib/toast";

export default function RecruitTab() {
  const navigate = useNavigate();
//   const dispatch = useAppDispatch();

  // Tab chính trong Recruit: Công việc hoặc Học bổng
  const [recruitSubTab, setRecruitSubTab] = useState<"job" | "scholarship">(
    "job",
  );

  // States
  const [filters, setFilters] = useState({ position: "", location: "" });
  const [filteredPosts, setFilteredPosts] = useState<CompanyPostAPI[]>([]);
  const [allPosts, setAllPosts] = useState<CompanyPostAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const savedPostIds = useAppSelector((state) => state.savedPosts.savedPostIds);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetchCompanyPosts(undefined, 20);
        if (response.items) {
          setAllPosts(response.items);
          setFilteredPosts(response.items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApplyFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      const results = allPosts.filter(
        (p) =>
          p.position.toLowerCase().includes(filters.position.toLowerCase()) &&
          p.address.toLowerCase().includes(filters.location.toLowerCase()),
      );
      setFilteredPosts(results);
      setIsLoading(false);
    }, 300);
  };

  if (isInitialLoading)
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <div className="p-4 text-center">Đang tải...</div>;
      </div>
    );

  return (
    <div className="flex w-full min-h-screen bg-slate-50 px-4 py-6 gap-6">
      {/* LEFT SIDEBAR - Chiếm khoảng 320px */}
      <aside className="w-[320px] shrink-0 space-y-4">
        {/* Switch Buttons: Công việc / Học bổng */}
        <div className="space-y-2">
          <button
            onClick={() => setRecruitSubTab("job")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-sm ${
              recruitSubTab === "job"
                ? "bg-white text-blue-600 border-l-4 border-blue-600"
                : "bg-white/50 text-gray-500 hover:bg-white"
            }`}
          >
            <Briefcase size={20} /> Công việc
          </button>
          <button
            onClick={() => setRecruitSubTab("scholarship")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-sm ${
              recruitSubTab === "scholarship"
                ? "bg-white text-blue-600 border-l-4 border-blue-600"
                : "bg-white/50 text-gray-500 hover:bg-white"
            }`}
          >
            <GraduationCap size={20} /> Học bổng
          </button>
        </div>

        {/* Filter Box */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <img src={SortIcon} alt="Sort" className="w-6 h-6" />
            <h2 className="font-bold text-gray-800">
              Bộ lọc {recruitSubTab === "job" ? "việc làm" : "học bổng"}
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Vị trí
              </label>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none"
                value={filters.position}
                onChange={(e) =>
                  setFilters({ ...filters, position: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                placeholder="Thành phố..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Đang lọc..."
              ) : (
                <>
                  <Search size={18} /> Áp dụng
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT - Dạng Grid như trong ảnh */}
      <main className="flex-1">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold mt-4">
              Không tìm thấy kết quả phù hợp
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.postId}
                className="relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Background Image Layer */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${post.mediaUrl || TestImage})`,
                  }}
                >
                  {/* Overlay phủ màu tối để nổi bật text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/50 transition-colors"></div>
                </div>

                {/* Bookmark Button (Top Right) */}
                <button
                  onClick={() =>
                    saveCompanyPost(post.postId, accessToken || undefined)
                  }
                  className="absolute top-5 right-5 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/20 group/bookmark"
                >
                  <img
                    src={BookmarkIcon}
                    className={`w-5 h-5 transition-transform group-hover/bookmark:scale-110 ${
                      savedPostIds.includes(post.postId)
                        ? "invert-[45%] sepia-[98%] saturate-[1726%] hue-rotate-[200deg]"
                        : "invert"
                    }`}
                    alt="save"
                  />
                </button>

                {/* Content Container (Bottom) */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-start gap-4">
                    {/* Company Avatar */}
                    <img
                      src={post.companyAvatar || ""}
                      alt={post.companyName}
                      className="w-14 h-14 rounded-2xl bg-white object-cover border-2 border-white/20 shrink-0 shadow-xl"
                    />

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {post.position}
                        </h2>
                        <p className="text-sm font-medium opacity-80 truncate">
                          {post.companyName}
                        </p>
                      </div>

                      {/* Info Badges */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-xs opacity-90">
                          <div className="p-1 bg-white/10 rounded-md">
                            <img
                              src={MapIcon}
                              className="w-3 h-3 invert"
                              alt=""
                            />
                          </div>
                          <span className="truncate">{post.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                          <div className="p-1 bg-green-400/10 rounded-md">
                            <img
                              src={MoneyIcon}
                              className="w-3 h-3 invert"
                              alt=""
                            />
                          </div>
                          <span>{post.salary}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className="mt-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-blue-600 backdrop-blur-md border border-white/20 py-2.5 px-2 rounded-xl transition-all w-full group/btn cursor-pointer font-bold text-sm"
                        onClick={() => navigate(`/job/${post.postId}`)}
                      >
                        <span>Xem chi tiết</span>
                        <div className="transition-transform group-hover/btn:translate-x-1">
                          →
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
