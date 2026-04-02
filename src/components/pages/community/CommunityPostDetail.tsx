import { useState, useRef, useEffect } from "react"; // Thêm useRef để focus
import { ArrowLeft, Send, X } from "lucide-react"; // Thêm icon X để hủy
import { CommunityPostComment } from "./CommunityPostComment";
import { useNavigate, useParams } from "react-router-dom";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunityPost, PostComment } from "@/types/communityPost";
// import { PostComment } from "@/types/communityPost";
import { useUserProfile } from "@/hook/useUserProfile";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

export default function CommunityPostDetail() {
  const { profile } = useUserProfile();
  const { accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<CommunityPost>(); // Lưu chi tiết bài viết
  const [postComments, setPostComments] = useState<PostComment[]>([]); // Lưu danh sách bình luận
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt mà
    });
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset chiều cao về auto để tính toán chính xác scrollHeight mới
      textarea.style.height = "auto";
      // Gán lại chiều cao bằng độ cao thực tế của nội dung
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
  const fetchDetailCommunityPosts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // API sẽ nhận cursor để biết lấy tiếp từ đâu
      const postDetailResponse = await fetch(
        `${API_BASE_URL}/community/posts/${id}`,
      );
      const postCommentResponse = await fetch(
        `${API_BASE_URL}/community/posts/${id}/comments`,
      );

      console.log("Response: ", postDetailResponse);
      console.log("Response comment: ", postCommentResponse);

      if (postDetailResponse.ok) {
        const postDetailData = await postDetailResponse.json();
        console.log("Data", postDetailData);
        setPost(postDetailData);
      }
      if (postCommentResponse.ok) {
        const commentsData = await postCommentResponse.json();
        console.log("Comments Data", commentsData);
        setPostComments(commentsData.comments);
      }
    } catch (error) {
      console.error("Lỗi khi fetch posts:", error);
      notify.error("Lỗi khi tải bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToTop();
    fetchDetailCommunityPosts();
  }, []);
  const handleSubmitCommunityComment = async () => {
    const content = textareaRef.current?.value.trim();
    if (!content || loading) return;
    setLoading(true);
    try {
      const submitComment = await fetch(
        `${API_BASE_URL}/community/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
          }),
        },
      );
      if (submitComment.ok) {
        notify.success("Bình luận thành công!");

        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.style.height = "auto";
        }

        // tải danh sách bình luận
        fetchDetailCommunityPosts();
      } else {
        const errorData = await submitComment.json();
        notify.error(errorData.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitCommunityReplyComment = async () => {
    const content = textareaRef.current?.value.trim();
    if (!content || !replyTarget || loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/comments/${replyTarget.commentId}/replies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
            replyToUserId: replyTarget.id, // ID của người bạn đang phản hồi
          }),
        },
      );

      if (response.ok) {
        notify.success("Phản hồi thành công!");
        // Reset input và target
        setReplyTarget(null);
        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.style.height = "auto";
        }
        fetchDetailCommunityPosts();
      } else {
        // Cách đọc lỗi an toàn để không bị lỗi JSON input
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : {};
        notify.error(errorData.message || "Không thể gửi phản hồi");
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };
  // --- State cho việc phản hồi ---
  const [replyTarget, setReplyTarget] = useState<{
    id: number;
    name: string;
    commentId: number;
  } | null>(null);

  // Hàm xử lý khi click nút Phản hồi từ component con
  const handleReplyInitiated = (
    authorId: number,
    authorName: string,
    commentId: number,
  ) => {
    setReplyTarget({ id: authorId, name: authorName, commentId: commentId });
    // Tự động focus vào ô nhập liệu
    textareaRef.current?.focus();
  };

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
            id={post?.id.toString() || ""}
            author={post?.author.name || ""}
            time={post?.createdAt || ""}
            avatar={post?.author.avatar || ""}
            isVerified={post?.author.role === "COMPANY"}
            content={post?.description || ""}
            images={post?.media && post?.media.length > 0 ? post?.media : []}
            imageTitle={post?.portfolioPreview?.data?.title || ""}
            likes={post?.favoriteCount || 0}
            comments={post?.commentCount || 0}
          />
        </div>

        <div className="border-t border-gray-100 pt-6 mb-24 px-4">
          <h3 className="font-bold text-lg mb-6">
            Bình luận ({postComments.length || 0})
          </h3>
          <div className="space-y-6">
            {Array.isArray(postComments) &&
              postComments.map((item) => (
                <CommunityPostComment
                  key={item.id}
                  comment={item}
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
            {/* 1. Bọc Avatar vào một div relative để làm mốc cho tick xanh */}
            <div className="relative inline-block">
              <img
                src={profile?.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                alt="My Avatar"
              />

              {/* 2. Hiển thị tick xanh nếu role là COMPANY */}
              {post?.author.role === "COMPANY" && (
                <div className="absolute -bottom-0.5 -right-0.5 transform">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    // w-4 h-4 sẽ cân đối hơn với avatar w-10
                    className="w-4 h-4 bg-white rounded-full border border-white shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Phần Input bên phải */}
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
              <button
                className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
                onClick={() => {
                  if (replyTarget) {
                    handleSubmitCommunityReplyComment();
                  } else {
                    handleSubmitCommunityComment();
                  }
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
