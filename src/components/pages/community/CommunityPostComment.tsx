import { PostComment } from "@/types/communityPost";
import { formatTimeAgo } from "@/utils/FormatTime";

interface CommentProps {
  comment: PostComment;
  onReplyClick: (id: number, name: string) => void; // Thêm prop callback
}

export const CommunityPostComment: React.FC<CommentProps> = ({ comment, onReplyClick }) => {
  return (
    <div className="relative">
      <CommentItem 
        author={comment.author}
        content={comment.content}
        createdAt={comment.createdAt}
        isReply={false}
        onReplyClick={onReplyClick} 
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2 space-y-3 relative">
          <div className="absolute -left-6 top-0 bottom-6 w-0.5 bg-gray-100" />
          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative">
              <div className="absolute -left-6 top-5 w-4 h-0.5 bg-gray-100" />
              <CommentItem 
                author={reply.author}
                content={reply.content}
                createdAt={reply.createdAt}
                replyToUser={reply.replyToUser}
                isReply={true}
                onReplyClick={onReplyClick} 
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
  author: any;
  content: string;
  createdAt: string;
  isReply: boolean;
  replyToUser?: any;
  onReplyClick: (id: number, name: string) => void; // Thêm vào đây
}

const CommentItem = ({ author, content, createdAt, isReply, replyToUser, onReplyClick }: ItemProps) => {
  return (
    <div className="flex gap-3 mb-2">
      <img 
        src={author.avatar} 
        className={"w-10 h-10 rounded-full z-10 bg-white object-cover shadow-sm"} 
        alt={author.name} 
      />
      
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block max-w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-sm text-gray-900 leading-none">{author.name}</h4>
            {author.role === "COMPANY" && (
              <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Company</span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isReply && replyToUser && <span className="text-blue-500 font-medium mr-1">@{replyToUser.name}</span>}
            {content}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2 text-[11px] font-bold text-gray-500">
          <span>{formatTimeAgo(createdAt)}</span>
          {/* Sửa nút bấm gọi hàm callback */}
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