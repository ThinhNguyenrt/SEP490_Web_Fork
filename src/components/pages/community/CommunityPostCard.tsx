import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Reply,
  MoreHorizontal,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/FormatTime";

interface PostProps {
  id: string;
  author: string;
  time: string;
  avatar: string;
  isVerified?: boolean;
  content: string;
  images?: string[]; // Đổi từ image thành images mảng
  imageTitle?: string;
  likes: number;
  comments: number;
}

export const CommunityPostCard: React.FC<PostProps> = ({
  id,
  author,
  time,
  avatar,
  isVerified,
  content,
  images = [], // Mặc định là mảng rỗng
  likes,
  comments,
}) => {
  
  // Hàm render layout hình ảnh dựa trên số lượng
  const renderImages = () => {
    const count = images.length;
    if (count === 0) return null;

    if (count === 1) {
      return (
        <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-100">
          <img src={images[0]} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 mt-4 rounded-xl overflow-hidden">
          {images.map((img, i) => (
            <img key={i} src={img} className="w-full aspect-square object-cover" alt="" />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 mt-4 rounded-xl overflow-hidden">
          <img src={images[0]} className="w-full h-full aspect-square object-cover row-span-2" alt="" />
          <img src={images[1]} className="w-full aspect-square object-cover" alt="" />
          <img src={images[2]} className="w-full aspect-square object-cover" alt="" />
        </div>
      );
    }

    // Từ 4 ảnh trở lên
    return (
      <div className="grid grid-cols-2 gap-1 mt-4 rounded-xl overflow-hidden relative">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="relative">
            <img src={img} className="w-full aspect-square object-cover" alt="" />
            {/* Nếu nhiều hơn 4 ảnh, hiển thị lớp phủ mờ ở ảnh cuối cùng */}
            {i === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{count - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="p-4">
        {/* Header: Avatar & Name */}
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <div className="relative">
              <img
                alt={author}
                className="w-12 h-12 object-cover rounded-full"
                src={avatar}
              />
              {isVerified && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-5 h-5 bg-white rounded-full border-2 border-white"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{author}</h3>
              <p className="text-xs text-gray-500">{formatTimeAgo(time)}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Content Link */}
        <Link to={`/community/${id}`} className="block mt-4 group">
          <p
            className="text-gray-800 leading-relaxed transition-colors mb-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {renderImages()}
        </Link>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-12 px-6 py-3 border-t border-gray-100">
        <button className="flex items-center cursor-pointer space-x-1.5 text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={18} />
          <span className="text-xs font-medium">{likes}</span>
        </button>

        <Link
          to={`/community/${id}`}
          className="flex items-center cursor-pointer space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-xs font-medium">{comments}</span>
        </Link>

        <button className="text-gray-500 cursor-pointer hover:text-yellow-500 transition-colors">
          <Bookmark size={18} />
        </button>
        
        <button className="text-gray-500 cursor-pointer hover:text-green-500 transition-colors">
          <Reply size={18} className="rotate-180" />
        </button>
      </div>
    </article>
  );
};