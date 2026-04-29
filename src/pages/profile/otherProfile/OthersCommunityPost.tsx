import { useEffect, useState } from "react";
import { CommunityPostCard } from "../../community/CommunityPostCard";
import { CommunityPost } from "@/types/communityPost";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hook";

export const OthersCommunityPost = ({ userId }: { userId: string }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://community-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/community/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await res.json();
        // Kiểm tra cấu trúc data trả về, nếu có bọc trong .items thì lấy .items
        setPosts(data.items || data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  if (loading)
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Đang tải...</p>
      </div>
    );

  return (
    <div className="space-y-6 mx-auto">
      {posts.length > 0 ? (
        posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            id={post.id}
            author={post.author.name}
            authorId={post.author.id}
            time={post.createdAt}
            avatar={post.author.avatar}
            isVerified={post.author.role === "COMPANY"}
            content={post.description || ""}
            images={post.media || []}
            imageTitle={post.portfolioPreview?.data?.title || ""}
            likes={post.favoriteCount}
            comments={post.commentCount}
            isFavorited={post.isFavorited}
            isSaved={post.isSaved}
          />
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-[2rem]">
          <p className="text-slate-400 font-bold">
            Người dùng chưa có bài đăng nào.
          </p>
        </div>
      )}
    </div>
  );
};
