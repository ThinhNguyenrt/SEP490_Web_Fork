import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PremiumAndTips } from "@/components/common/Premium";
import { mockCompanyPosts } from "@/data/mockCompanyPost";
import coverImage from "@/assets/testImage/coverImagee.png";
import testImage from "@/assets/testImage/testImage.png";

type RecruitmentPost = {
  id: number;
  position: string;
  image: string;
};

const recruitmentPosts: RecruitmentPost[] = [
  ...mockCompanyPosts.slice(0, 2).map((post, index) => ({
    id: post.postId,
    position: post.position,
    image: index === 0 ? coverImage : testImage,
  })),
];

function RecruitmentPostCard({
  post,
  onClick,
}: {
  post: RecruitmentPost;
  onClick: () => void;
}) {
  return (
    <article
      className="group relative w-90 aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <img
        src={post.image}
        alt={post.position}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-900/15 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="text-white text-2xl font-bold leading-tight">{post.position}</h3>
      </div>
    </article>
  );
}

export default function RecruitmentManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 mt-4">
      <div className="max-w-480 mx-auto flex min-h-screen flex-col lg:flex-row">
        <main className="w-full lg:w-2/3 px-4 md:px-10 lg:pr-8 lg:border-r border-slate-200">
          <header className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                onClick={() => navigate(-1)}
                aria-label="Quay lại"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">Quản tuyển dụng</h1>
            </div>

            <button
              onClick={() => navigate("/recruitment-management/create")}
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus size={20} /> Thêm bài
            </button>
          </header>

          <p className="text-slate-500 font-medium mb-6">
            Bạn đang có {recruitmentPosts.length} bài đăng tuyển dụng
          </p>

          <section className="inline-grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 justify-items-start">
            {recruitmentPosts.map((post) => (
              <RecruitmentPostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/recruitment-management/${post.id}`)}
              />
            ))}
          </section>
        </main>

        <aside className="w-full lg:w-1/3 px-4 md:px-10 lg:px-6 pt-2 pb-8">
          <PremiumAndTips />
        </aside>
      </div>
    </div>
  );
}
