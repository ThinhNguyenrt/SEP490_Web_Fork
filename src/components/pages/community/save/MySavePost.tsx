import React, { useState } from "react";
import { communityPosts } from "@/data/mockComment";
import { CommunityPost } from "@/types/communityPost";
import { CommunityPostCard } from "../CommunityPostCard";
import { CompanyTab } from "./CompanyTab";
import { mockCompanyPosts } from "@/data/mockCompanyPost";

type TabType = "company" | "community";

export default function MySavePost() {
  const [activeTab, setActiveTab] = useState<TabType>("company");

  // Giả sử lọc dữ liệu cho từng tab

  const communityData = communityPosts;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header Section & Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Tab Menu UI */}
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "company"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tuyển dụng
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "community"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cộng đồng
            </button>
          </div>
        </div>
        <div className="pb-0">
          <p className="text-1 text-gray-900 mb-4">
            Bạn có{" "}
            <span className="font-bold">
              {activeTab === "company"
                ? mockCompanyPosts.length
                : communityData.length}
            </span>{" "}
            bài lưu
          </p>
        </div>
        {/* Dynamic Content */}
        {activeTab === "company" ? (
          mockCompanyPosts.length > 0 ? (
            <CompanyTab />
          ) : (
            <EmptyState />
          )
        ) : communityPosts.length > 0 ? (
          <div className="space-y-6">
            {communityPosts.map((post: CommunityPost) => (
              <CommunityPostCard
                key={post.id}
                id={post.id.toString()}
                author={post.author.name}
                time={post.createdAt}
                avatar={post.author.avatar}
                isVerified={post.author.role === "COMPANY"}
                content={post.description || ""}
                image={post.media && post.media.length > 0 ? post.media[0] : ""}
                imageTitle={post.portfolioPreview?.data?.title || ""}
                likes={post.favoriteCount}
                comments={post.commentCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// Component phụ cho trạng thái trống
const EmptyState = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    </div>
    <h3 className="text-gray-900 font-medium">
      Không có bài viết nào trong mục này
    </h3>
  </div>
);
