import { useAppSelector } from "@/store/hook";
import { PostComment } from "@/types/communityPost";
import { formatTimeAgo } from "@/utils/FormatTime";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CommentProps {
  comment: PostComment;
  onReplyClick: (id: number, name: string, commentId: number) => void;
  onDelete: (commentId: number, isReply: boolean) => void;
}

export const CommunityPostComment: React.FC<CommentProps> = ({
  comment,
  onReplyClick,
  onDelete,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const handleDelete = (id: number, isReply: boolean) => {
    if (isReply) {
      onDelete(id, true);
    } else {
      onDelete(id, false);
    }
  };
  return (
    <div className="relative">
      <CommentItem
        commentId={comment.id}
        author={comment.author}
        content={comment.content}
        createdAt={comment.createdAt}
        isReply={false}
        currentUser={user}
        onDelete={handleDelete}
        onReplyClick={() =>
          onReplyClick(comment.author.id, comment.author.name, comment.id)
        }
      />

      {/* Hiển thị danh sách các phản hồi nếu có */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2 space-y-3 relative">
          {/* Đường kẻ dọc nối các reply */}
          <div className="absolute -left-6 top-0 bottom-6 w-0.5 bg-gray-100" />

          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative">
              {/* Đường kẻ ngang cho mỗi reply */}
              <div className="absolute -left-6 top-5 w-4 h-0.5 bg-gray-100" />
              <CommentItem
                commentId={reply.id}
                author={reply.author}
                content={reply.content}
                createdAt={reply.createdAt}
                replyToUser={reply.replyToUser}
                isReply={true}
                currentUser={user}
                onDelete={handleDelete}
                onReplyClick={() =>
                  onReplyClick(reply.author.id, reply.author.name, reply.id)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Cập nhật Sub-component CommentItem ---
interface ItemProps {
  commentId?: number; // Thêm commentId để biết đang reply đến comment nào
  author: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  createdAt: string;
  isReply: boolean;
  currentUser: any;
  replyToUser?: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
  onReplyClick: (id: number, name: string) => void; // Thêm vào đây
  onDelete: (commentId: number, isReply: boolean) => void;
}

const CommentItem = ({
  commentId,
  author,
  content,
  createdAt,
  isReply,
  replyToUser,
  currentUser,
  onReplyClick,
  onDelete,
}: ItemProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Lấy user hiện tại từ Redux
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isMyComment = currentUser?.id === author.id;

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleViewUserProfile = (userId: number, role: string) => {
    if (userId === user?.id && user.role === 1) {
      navigate("/profile");
      return;
    }

    if (userId === user?.id && user.role === 2) {
      navigate("/recruiter-profile");
      return;
    }
    if (role === "USER") {
      navigate(`/profile/${userId}`);
      return;
    }
    if (role === "COMPANY") {
      navigate(`/recruiter-profile/${userId}`);
      return;
    }
  };
  return (
    <div
      className="flex gap-3 mb-2 group"
      onClick={() => handleViewUserProfile(author.id, author.role)}
    >
      <img
        src={author.avatar || "/default-avatar.png"}
        className="w-10 h-10 rounded-full z-10 bg-white object-cover shadow-sm"
        alt={author.name}
      />

      <div className="flex-1">
        <div className="relative flex items-start gap-2">
          <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block max-w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-bold text-sm text-gray-900 leading-none">
                {author.name}
              </h4>
              {author.role === "COMPANY" && (
                <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Company
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {isReply && replyToUser && (
                <span className="text-blue-500 font-medium mr-1">
                  @{replyToUser.name}
                </span>
              )}
              {content}
            </p>
          </div>

          {/* Icon 3 chấm & Dropdown (Chỉ hiện nếu là comment của mình) */}
          {isMyComment && (
            <div className="relative self-center" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal size={16} />
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in duration-100">
                  <button
                    onClick={() => {
                      onDelete(commentId!, isReply);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Xóa bình luận
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1 ml-2 text-[11px] font-bold text-gray-500">
          <span>{formatTimeAgo(createdAt)}</span>
          <button
            onClick={() => onReplyClick(author.id, author.name)}
            className="hover:underline cursor-pointer text-gray-600"
          >
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};
