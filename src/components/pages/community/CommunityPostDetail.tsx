import { useState, useRef } from "react"; // Thêm useRef để focus
import { ArrowLeft, Send, X } from "lucide-react"; // Thêm icon X để hủy
import { CommunityPostComment } from "./CommunityPostComment";
import { useNavigate, useParams } from "react-router-dom";
import { communityPosts, POST_COMMENTS_MOCK } from "@/data/mockComment";
import { CommunityPostCard } from "./CommunityPostCard";

export default function CommunityPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset chiều cao về auto để tính toán chính xác scrollHeight mới
      textarea.style.height = "auto";
      // Gán lại chiều cao bằng độ cao thực tế của nội dung
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // --- State cho việc phản hồi ---
  const [replyTarget, setReplyTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const post = communityPosts.find((p) => p.id === postId);
  const postCommentsData = POST_COMMENTS_MOCK.find(
    (item) => item.postId === postId,
  );

  // Hàm xử lý khi click nút Phản hồi từ component con
  const handleReplyInitiated = (authorId: number, authorName: string) => {
    setReplyTarget({ id: authorId, name: authorName });
    // Tự động focus vào ô nhập liệu
    textareaRef.current?.focus();
  };

  if (!post) return <div>...</div>;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-slate-200 shadow-sm">
      <div className="py-6">
        {/* Header điều hướng */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 0 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Bài viết</h1>
        </header>

        {/* Hiển thị lại PostCard gốc */}
        <div className="mb-6">
          <CommunityPostCard
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
        </div>

        <div className="border-t border-gray-100 pt-6 mb-24 px-4">
          <h3 className="font-bold text-lg mb-6">
            Bình luận ({postCommentsData?.comments.length || 0})
          </h3>
          <div className="space-y-6">
            {postCommentsData?.comments.map((comment) => (
              <CommunityPostComment
                key={comment.id}
                comment={comment}
                onReplyClick={handleReplyInitiated}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- Ô Input Bình luận cố định --- */}
      <div className="z-50 fixed bottom-0 left-0 right-0 bg-slate-50 border-gray-100 px-8 ">
        <div className="max-w-2xl mx-auto border-r border-l border-r-slate-200 border-l-slate-200 border-t border-t-slate-200 p-4 shadow-sm bg-white ">
          {/* Hiển thị dòng "Bạn đang phản hồi..." nếu có replyTarget */}
          {replyTarget && (
            <div className="flex items-center justify-between mb-2 px-2 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-xs text-slate-500">
                Bạn đang phản hồi{" "}
                <span className="font-bold text-blue-500">
                  {replyTarget.name}
                </span>
              </p>
              <button
                onClick={() => setReplyTarget(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              className="w-10 h-10 rounded-full border border-black"
              alt="My Avatar"
            />
            <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 flex items-center">
              <textarea
                ref={textareaRef}
                rows={1}
                onInput={handleInput}
                placeholder={
                  replyTarget
                    ? `Phản hồi ${replyTarget.name}...`
                    : "Viết bình luận..."
                }
                className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none resize-none overflow-hidden py-1 block"
                style={{ minHeight: "20px" }}
              />
              <button className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
