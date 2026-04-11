import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Components & Types
import { CommunityPostComment } from "./CommunityPostComment";
import { CommunityPostCard } from "./CommunityPostCard";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { CommunityPost, PostComment } from "@/types/communityPost";

// Hooks & Services
import { useUserProfile } from "@/hook/useUserProfile";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import { realtimeService } from "@/services/realtimeService";

export default function CommunityPostDetail() {
  const { profile } = useUserProfile();
  const { accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Đây là postId từ URL

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [post, setPost] = useState<CommunityPost>();
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [replyTarget, setReplyTarget] = useState<{
    id: number;
    name: string;
    commentId: number;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    commentId: null as number | null,
    isReply: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

  // --- 1. LOGIC REALTIME (SIGNALR) ---
  useEffect(() => {
    if (!id || !accessToken) return;

    // Khởi tạo kết nối SignalR
    realtimeService.initConnection(accessToken);
    realtimeService.start();
    realtimeService.joinPost(id);

    // Lắng nghe Comment mới
    const handleRealtimeComment = (e: any) => {
      const event = e.detail;
      console.log("Received realtime comment event:", event);
      if (String(event.postId) === String(id)) {
        setPostComments((prev) => {
          if (prev.some((c) => c.id === event.commentId)) return prev;

          const newComment: PostComment = {
            id: event.commentId,
            content: event.content,
            createdAt: event.createdAt,
            author: {
              id: Number(event.actorId),
              name: event.author.name, // Lấy trực tiếp từ Server
              avatar: event.author.avatar, // Lấy trực tiếp từ Server
              role: event.author.role,
            },
            replies: [],
          };
          return [newComment, ...prev];
        });
      }
    };

    // Lắng nghe Reply mới
    // Lắng nghe Reply mới
    const handleRealtimeReply = (e: any) => {
      const event = e.detail; // Lấy dữ liệu từ SignalR event
      console.log("Received realtime reply event:", event);
      // Kiểm tra postId (nên ép kiểu string để so sánh an toàn)
      if (String(event.postId) === String(id)) {
        setPostComments((prev) =>
          prev.map((comment) => {
            // Tìm đúng comment cha (parent) để thêm reply vào
            if (Number(comment.id) === Number(event.parentCommentId)) {
              // Chống trùng lặp (Idempotency)
              if (comment.replies.some((r) => r.id === event.commentId)) {
                return comment;
              }

              // Map dữ liệu thực tế từ Backend trả về
              const newReply = {
                id: event.commentId,
                content: event.content,
                createdAt: event.createdAt,
                author: {
                  id: Number(event.actorId), // Dùng actorId từ server
                  name: event.author.name, // Dùng actorName thực tế
                  avatar: event.author.avatar, // Dùng actorAvatar thực tế
                  role: event.author.role, // Dùng actorType thực tế
                },
                // Thông tin người được phản hồi (nếu Backend có hỗ trợ map thêm)
                replyToUser: {
                  id: event.replyToUserId,
                  name: event.replyToUserName || "User",
                  avatar: "",
                  role: "USER",
                },
              };

              // Trả về comment cha với mảng replies mới đã được thêm reply vừa nhận
              return {
                ...comment,
                replies: [...comment.replies, newReply],
              };
            }
            return comment;
          }),
        );
      }
    };

    window.addEventListener("realtime-comment", handleRealtimeComment);
    window.addEventListener("realtime-reply", handleRealtimeReply);

    return () => {
      realtimeService.leavePost(id);
      window.removeEventListener("realtime-comment", handleRealtimeComment);
      window.removeEventListener("realtime-reply", handleRealtimeReply);
    };
  }, [id, accessToken]);

  // --- 2. FETCH DATA ---
  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      // 1. Định nghĩa các yêu cầu fetch riêng biệt
      const postFetch = fetch(`${API_BASE_URL}/community/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm Token cho bài viết
        },
      });

      const commentsFetch = fetch(
        `${API_BASE_URL}/community/posts/${id}/comments`,
      );

      // 2. Chạy song song cả hai
      const [postRes, commentRes] = await Promise.all([
        postFetch,
        commentsFetch,
      ]);

      // 3. Xử lý kết quả trả về
      if (postRes.ok) {
        const postData = await postRes.json();
        setPost(postData);
      }

      if (commentRes.ok) {
        const data = await commentRes.json();
        setPostComments(data.comments || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      notify.error("Lỗi khi tải dữ liệu bài viết");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, [id]);

  // --- 3. ACTIONS (COMMENT/REPLY/DELETE) ---
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    const content = textareaRef.current?.value.trim();
    if (!content || loadingSubmit) return;

    setLoadingSubmit(true);
    try {
      const url = replyTarget
        ? `${API_BASE_URL}/community/comments/${replyTarget.commentId}/replies`
        : `${API_BASE_URL}/community/posts/${id}/comments`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ...(replyTarget && { replyToUserId: replyTarget.id }),
        }),
      });

      if (response.ok) {
        notify.success(
          replyTarget ? "Phản hồi thành công" : "Bình luận thành công",
        );
        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.style.height = "auto";
        }
        setReplyTarget(null);
        fetchData(); // Fetch lại để cập nhật list (SignalR sẽ check trùng qua ID)
      }
    } catch (error) {
      notify.error("Lỗi kết nối máy chủ");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleOpenDeleteModal = (commentId: number, isReply: boolean) => {
    setDeleteModal({ isOpen: true, commentId, isReply });
  };

  const handleConfirmDelete = async () => {
    const { commentId, isReply } = deleteModal;
    if (!commentId) return;

    setIsDeleting(true);
    const url = isReply
      ? `/community/replies/${commentId}`
      : `/community/comments/${commentId}`;
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        notify.success("Xóa thành công");
        setDeleteModal({ isOpen: false, commentId: null, isReply: false });
        fetchData();
      }
    } catch (error) {
      notify.error("Lỗi khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-slate-200 shadow-sm">
      <div className="py-6 px-4 sm:px-6">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Bài viết</h1>
        </header>

        <div className="mb-6">
          {isLoading || !post ? (
            <div className="animate-pulse bg-gray-100 h-64 rounded-xl mb-6" />
          ) : (
            <CommunityPostCard
              key={post.id}
              {...post}
              authorId={post.author.id}
              author={post.author.name}
              avatar={post.author.avatar}
              isVerified={post.author.role === "COMPANY"}
              content={post.description || ""}
              images={post.media || []}
              likes={post.favoriteCount}
              comments={post.commentCount}
              time={post.createdAt}
            />
          )}
        </div>

        <div className="border-t pt-6 mb-24">
          <h3 className="font-bold text-lg mb-6">
            Bình luận ({postComments.length})
          </h3>
          <div className="space-y-6">
            {postComments.map((item) => (
              <CommunityPostComment
                key={item.id}
                comment={item}
                onReplyClick={(authorId, authorName, commentId) => {
                  setReplyTarget({ id: authorId, name: authorName, commentId });
                  textareaRef.current?.focus();
                }}
                onDelete={(cid, isRep) => handleOpenDeleteModal(cid, isRep)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 border-t border-gray-100 px-4 py-3 sm:px-8">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          {replyTarget && (
            <div className="flex items-center justify-between mb-2 px-2 text-xs">
              <span className="text-slate-500">
                Phản hồi <b className="text-blue-500">{replyTarget.name}</b>
              </span>
              <button
                onClick={() => setReplyTarget(null)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <textarea
              ref={textareaRef}
              rows={1}
              onInput={handleInput}
              placeholder={
                replyTarget ? `Viết phản hồi...` : "Viết bình luận..."
              }
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none resize-none py-1"
            />
            <button
              disabled={loadingSubmit}
              onClick={handleSubmit}
              className="text-blue-500 hover:text-blue-600 disabled:opacity-50 cursor-pointer"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        isLoading={isDeleting}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
