import { ArrowLeft, Plus, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { PremiumAndTips } from "@/components/common/Premium";
import { fetchCompanyPostsByCompanyId, deleteCompanyPost } from "@/services/company.api";
import { CompanyPostAPI } from "@/types/companyPost";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

type RecruitmentPost = CompanyPostAPI & {
  image: string;
};

function RecruitmentPostCard({
  post,
  onClick,
  onEdit,
  onDelete,
}: {
  post: RecruitmentPost;
  onClick: () => void;
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(post.postId);
    setShowMenu(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(post.postId);
    setShowMenu(false);
  };

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
      
      {/* 3 dots menu button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
            title="Tùy chọn"
          >
            <MoreVertical size={20} className="text-slate-700" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-10">
              <button
                onClick={handleEditClick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors text-left"
              >
                <Edit3 size={16} />
                <span className="font-medium">Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-left"
              >
                <Trash2 size={16} />
                <span className="font-medium">Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>

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
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (postId: number) => {
    navigate(`/recruitment-management/edit/${postId}`);
  };

  const handleDelete = (postId: number) => {
    setDeletingPostId(postId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPostId || !accessToken) return;

    try {
      setIsDeleting(true);
      await deleteCompanyPost(deletingPostId, accessToken);
      
      // Remove from local state
      setRecruitmentPosts(recruitmentPosts.filter(post => post.postId !== deletingPostId));
      notify.success("Xóa bài đăng thành công");
      setDeletingPostId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi xóa bài đăng";
      console.error("❌ Error deleting post:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPostId(null);
  };

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
    <div className="min-h-screen text-slate-900 transition-colors duration-200 mt-2">
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

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 w-full ml-5">
                {recruitmentPosts.map((post) => (
                  <RecruitmentPostCard
                    key={post.postId}
                    post={post}
                    onClick={() =>
                      navigate(`/recruitment-management/${post.postId}`)
                    }
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </section>
            </>
          )}
        </main>

        <aside className="w-full lg:w-1/3 px-4 md:px-10 lg:px-6 pt-2 pb-8 shrink-0">
          <PremiumAndTips />
        </aside>
         
       
      </div>

      {/* Delete Confirm Modal */}
      {deletingPostId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in scale-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Xác nhận xóa bài đăng</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
