import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { PremiumAndTips } from "@/components/common/Premium";
import { fetchCompanyPostsByCompanyId } from "@/services/company.api";
import { CompanyPostAPI } from "@/types/companyPost";
import CustomLoading from "@/components/Loading/Loading";

type RecruitmentPost = CompanyPostAPI & {
  image: string;
};

function RecruitmentPostCard({
  post,
  onClick,
}: {
  post: RecruitmentPost;
  onClick: () => void;
}) {
  return (
    <article
      className="group relative w-72 aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
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
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get companyId from auth state (for recruiters/company users)
        if (!user?.companyId) {
          setError("Không thể xác định công ty. Vui lòng đăng nhập lại.");
          setIsLoading(false);
          return;
        }

        console.log("📡 Loading posts for company:", user.companyId);

        // Fetch posts from API
        const response = await fetchCompanyPostsByCompanyId(
          user.companyId,
          undefined,
          10,
          accessToken || undefined
        );

        // Transform API response to include image field (using mediaUrl)
        const postsWithImages = response.items.map((post) => ({
          ...post,
          image: post.mediaUrl || "",
        }));

        setRecruitmentPosts(postsWithImages);
        console.log("✅ Loaded", postsWithImages.length, "posts");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi khi tải bài đăng";
        console.error("❌ Error loading posts:", errorMessage);
        setError(errorMessage);
        setRecruitmentPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyPosts();
  }, [user?.companyId, accessToken]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 mt-2">
      <div className="flex min-h-screen flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-8 lg:px-4">
        <main className="flex-1 lg:w-2/3">
          <header className="flex items-center justify-between mb-8">
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CustomLoading />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Lỗi tải bài đăng</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : recruitmentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium">
                Bạn chưa có bài đăng tuyển dụng nào
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-700 font-semibold mb-6 text-lg">
                Bạn đang có <span className="text-blue-600">{recruitmentPosts.length}</span> bài đăng tuyển dụng
              </p>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {recruitmentPosts.map((post) => (
                  <RecruitmentPostCard
                    key={post.postId}
                    post={post}
                    onClick={() =>
                      navigate(`/recruitment-management/${post.postId}`)
                    }
                  />
                ))}
              </section>
            </>
          )}
        </main>

        <aside className="w-full lg:w-1/3 lg:pr-4">
          <PremiumAndTips />
        </aside>
         
       
      </div>
    </div>
  );
}
