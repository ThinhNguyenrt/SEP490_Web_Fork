import React from "react";
import { MapPin, Banknote, Clock, ArrowUpRight, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCompanyPosts } from "@/data/mockCompanyPost";
import { companyMockData } from "@/data/mockCompany";

export const CompanyTab = () => {
  const navigate = useNavigate();

  const handleGetCompanyImage = (
    companyId: number,
    type: "coverImage" | "avatar",
  ) => {
    const company = companyMockData.find((c) => c.companyId === companyId);
    return company
      ? company[type]
      : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  };

  return (
    <div className="space-y-6">
      {mockCompanyPosts.map((post) => (
        <div
          key={post.postId}
          className="relative overflow-hidden rounded-2xl aspect-[16/9] min-h-[320px] shadow-lg group"
        >
          {/* Background Image với lớp phủ mờ */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${handleGetCompanyImage(post.companyId, "coverImage")})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </div>

          {/* Bookmark Icon (Góc trên bên phải) */}
          <button className="absolute top-4 right-4 z-10 cursor-pointer">
            <div className="bg-transparent p-1.5 rounded-sm">
              <Bookmark className="w-10 h-10 text-transparent fill-blue-600" />
            </div>
          </button>

          {/* Content Container */}
          <div className="relative h-full p-8 flex flex-col justify-center text-white">
            <div className="flex items-start gap-6">
              {/* Company Logo (Hình tròn bên trái) */}
              {/* Nếu mockdata có trường logo thì dùng, không thì dùng placeholder text hoặc icon */}
              <img
                src={handleGetCompanyImage(post.companyId, "avatar")}
                alt="Company Logo"
                className="w-20 h-20 rounded-full bg-[#1a2e2a] border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner"
              />

              {/* Main Info */}
              <div className="flex flex-col gap-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {post.position}
                  </h2>
                  <p className="text-lg font-medium opacity-90">
                    {post.companyName}
                  </p>
                </div>

                {/* Job Details List */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin size={16} className="shrink-0" />
                    <span className="line-clamp-1">{post.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Banknote size={16} className="shrink-0" />
                    <span className="font-semibold">{post.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Clock size={16} className="shrink-0" />
                    <span>{post.employmentType}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="mt-5 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 py-2.5 px-8 rounded-xl transition-all w-fit group/btn cursor-pointer"
                  onClick={() => navigate(`/job/${post.postId}`)}
                >
                  <span className="text-sm font-bold">Xem chi tiết</span>
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
