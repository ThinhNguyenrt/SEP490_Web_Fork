import { useState } from "react";
import {
  Users,
  LayoutGrid,
  Mail,
  Phone,
  Edit3,
  ChevronRight,
  FileText,
} from "lucide-react";
import { CommunityPost } from "@/types/communityPost";
import { CommunityPostCard } from "../CommunityPostCard";
import { communityPosts } from "@/data/mockComment";

// --- Sub-Components ---

// 1. Component hiển thị Hồ sơ ứng viên quan tâm
const SavedCandidates = () => {
  const candidates = [
    {
      id: 1,
      name: "Phạm An Nhiên",
      role: "Nhà thiết kế UI/UX & Lập trình viên Frontend",
      desc: "Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tôi tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm",
      email: "annhien@gmail.com",
      phone: "0123456789",
      priority: "Cao",
      color: "red",
      status: "Mới cập nhật",
    },
    {
      id: 2,
      name: "Phạm An Nhiên",
      role: "Nhà thiết kế UI/UX & Lập trình viên Frontend",
      desc: "Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tôi tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm",
      email: "annhien@gmail.com",
      phone: "0123456789",
      priority: "Thấp",
      color: "green",
      status: "",
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Danh sách Card */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {candidates.map((can) => (
          <div
            key={can.id}
            className={`bg-white border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md ${can.priority === "Cao" ? "border-red-100" : "border-green-100"}`}
          >
            <img
              src="https://i.pravatar.cc/150?u=9"
              className="w-20 h-20 rounded-full mb-4 border-2 border-slate-50 shadow-sm"
              alt="avatar"
            />
            <h3 className="text-xl font-bold text-slate-800">{can.name}</h3>
            <p className="text-[12px] font-bold text-blue-500 uppercase mt-1">
              {can.role}
            </p>
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed line-clamp-4">
              {can.desc}
            </p>

            <div className="flex gap-6 mt-5 text-[12px] font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} /> {can.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {can.phone}
              </span>
            </div>

            <div className="w-full border-t border-slate-100 mt-6 pt-4 flex flex-col gap-3">
              {/* Dòng 1: Mức độ ưu tiên */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${can.priority === "Cao" ? "bg-red-500" : "bg-green-500"}`}
                  />
                  <span
                    className={`text-[12px] font-bold ${can.priority === "Cao" ? "text-red-500" : "text-green-500"}`}
                  >
                    Mức độ ưu tiên: {can.priority}
                  </span>
                  <button className="text-slate-300 hover:text-blue-500 transition-colors">
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>

              {/* Dòng 2: Trạng thái cập nhật (Chỉ hiển thị nếu có status) */}
              {can.status && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {can.status}
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium">
                    Hồ sơ này mới cập nhật
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Lọc bên phải */}
      <aside className="w-64 shrink-0">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-6">
          <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-5">
            Lọc theo ưu tiên
          </h2>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-[13px] font-bold transition-all">
              <LayoutGrid size={16} /> Tất cả hồ sơ
            </button>
            {[
              { label: "Mức độ ưu tiên: Cao", color: "bg-red-500" },
              { label: "Mức độ ưu tiên: Trung bình", color: "bg-amber-400" },
              { label: "Mức độ ưu tiên: Thấp", color: "bg-green-500" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-[12px] font-semibold transition-all"
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

// --- Main Page Component ---
const CompanySavePost = () => {
  const [activeTab, setActiveTab] = useState("candidates");

  return (
    <div className="bg-[#f8fafd] min-h-screen ">
      <div className="max-w-[1440px] mx-auto px-8 flex gap-8">
        {/* Sidebar Tabs bên trái (Cố định tỷ lệ như ảnh) */}
        <aside className="w-64 shrink-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm sticky top-16">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("candidates")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "candidates"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    size={20}
                    className={
                      activeTab === "candidates"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[14px]">Hồ sơ ứng viên</span>
                </div>
                {activeTab === "candidates" && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    size={20}
                    className={
                      activeTab === "posts" ? "text-blue-600" : "text-slate-400"
                    }
                  />
                  <span className="text-[14px]">Bài đăng cộng đồng</span>
                </div>
                {activeTab === "posts" && <ChevronRight size={16} />}
              </button>
            </nav>
          </div>
        </aside>

        {/* Nội dung thay đổi dựa trên tab */}
        <main className="flex-1 pb-20 min-h-screen">
          {/* Header Trang */}
          <div className="bg-white border-b border-slate-100 p-8 mb-6">
            <div className="max-w-[1440px] mx-auto">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Mục quan tâm
              </h1>
              <p className="text-[14px] text-slate-400 mt-1 font-medium">
                Quản lý và theo dõi các hồ sơ, bài viết bạn đã quan tâm
              </p>
            </div>
          </div>
          {activeTab === "candidates" ? (
            <SavedCandidates />
          ) : communityPosts.length > 0 ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {communityPosts.map((post: CommunityPost) => (
                <CommunityPostCard
                  key={post.id}
                  id={post.id.toString()}
                  author={post.author.name}
                  time={post.createdAt}
                  avatar={post.author.avatar}
                  isVerified={post.author.role === "COMPANY"}
                  content={post.description || ""}
                  image={
                    post.media && post.media.length > 0 ? post.media[0] : ""
                  }
                  imageTitle={post.portfolioPreview?.data?.title || ""}
                  likes={post.favoriteCount}
                  comments={post.commentCount}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanySavePost;
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
