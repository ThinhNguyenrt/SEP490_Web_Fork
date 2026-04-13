import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Banknote,
  Clock,
  ArrowUpRight,
  Loader2,
  Inbox,
} from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { CompanyPost } from "@/types/companyPost";

export const OthersJobPost = ({ companyId }: { companyId: number }) => {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState<CompanyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://company-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/company-posts/company/${companyId}?limit=10`,
        );
        const data = await response.json();
        // Dựa trên Swagger, data thường nằm trong data.items hoặc data trực tiếp
        setJobPosts(data.items || data || []);
      } catch (error) {
        console.error("Lỗi khi lấy bài đăng tuyển dụng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) fetchCompanyJobs();
  }, [companyId, accessToken]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">
          Đang tải bài đăng tuyển dụng...
        </p>
      </div>
    );
  }

  if (jobPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
        <Inbox className="w-12 h-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold">
          Hiện chưa có bài tuyển dụng nào từ công ty này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobPosts.map((post) => (
        <div
          key={post.postId}
          className={`relative overflow-hidden rounded-[2.5rem] aspect-[16/9] min-h-[320px] shadow-lg group transition-all duration-500 "scale-100"
          }`}
        >
          {/* Background Image - Lấy từ mediaUrl hoặc thumbnail của bài đăng */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${post.mediaUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174"})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] group-hover:bg-black/50 transition-colors"></div>
          </div>

          {/* Bookmark Icon */}
          {/* <button
            className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all cursor-pointer border border-white/20 group/bookmark"
          >
            <Bookmark className="w-6 h-6 text-white group-hover/bookmark:fill-white transition-all" />
          </button> */}

          {/* Content Container */}
          <div className="relative h-full p-10 flex flex-col justify-end text-white">
            <div className="flex items-start gap-6">
              {/* Avatar công ty */}
              <img
                src={post.companyAvatar || "/default-company.png"}
                alt={post.companyName}
                className="w-20 h-20 rounded-[1.5rem] bg-white object-cover border-4 border-white/10 shrink-0 shadow-2xl"
              />

              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <h2 className="text-3xl font-black tracking-tight line-clamp-1">
                    {post.position }
                  </h2>
                  <p className="text-lg font-bold text-blue-400">
                    {post.companyName}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="line-clamp-1">
                      {post.address }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Banknote size={16} className="text-emerald-400" />
                    <span className="font-bold">
                      {post.salary || "Thỏa thuận"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock size={16} className="text-orange-400" />
                    <span>{post.employmentType || "Toàn thời gian"}</span>
                  </div>
                </div>

                <button
                  className="mt-6 flex items-center gap-3 bg-white text-slate-900 py-3 px-8 rounded-2xl transition-all w-fit group/btn cursor-pointer shadow-xl active:scale-95"
                  onClick={() => navigate(`/job/${post.postId}`)}
                >
                  <span className="text-sm font-black uppercase tracking-wider">
                    Xem chi tiết
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
