import {
  ArrowLeft,
  Briefcase,
  Building2,
  CircleDollarSign,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchCompanyPostDetail } from "@/services/company.api";
import { CompanyPostDetail } from "@/types/companyPost";
import CustomLoading from "@/components/Loading/Loading";

const postCoverById: Record<number, string> = {
  1: "https://res.cloudinary.com/daxvhwsax/image/upload/v1775190918/company/posts/1280w-_egjurUB42A_o5weee.jpg",
  2: "https://res.cloudinary.com/daxvhwsax/image/upload/v1775190918/company/posts/1280w-_egjurUB42A_o5weee.jpg",
  3: "https://res.cloudinary.com/daxvhwsax/image/upload/v1775190918/company/posts/1280w-_egjurUB42A_o5weee.jpg",
};

export default function RecruitmentDetails() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [selectedPost, setSelectedPost] = useState<CompanyPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPostDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!postId) {
          setError("Không tìm thấy ID bài đăng");
          setIsLoading(false);
          return;
        }

        console.log("📡 Loading post detail for postId:", postId);

        // Fetch post detail from API
        const post = await fetchCompanyPostDetail(Number(postId), accessToken || undefined);
        setSelectedPost(post);
        console.log("✅ Post detail loaded:", post);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi khi tải chi tiết bài đăng";
        console.error("❌ Error loading post detail:", errorMessage);
        setError(errorMessage);
        setSelectedPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostDetail();
  }, [postId, accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6 flex justify-center items-center">
        <CustomLoading />
      </div>
    );
  }

  if (error || !selectedPost) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg text-red-600 font-semibold mb-2">Lỗi</p>
          <p className="text-lg text-slate-700">{error || "Không tìm thấy bài đăng tuyển dụng."}</p>
          <button
            onClick={() => navigate("/recruitment-management")}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-700"
          >
            Quay lại quản tuyển dụng
          </button>
        </div>
      </div>
    );
  }

  const cover = 
    (selectedPost.media && selectedPost.media.length > 0 ? selectedPost.media[0].url : null) ||
    selectedPost.coverImageUrl ||
    postCoverById[selectedPost.postId] ||
    postCoverById[1];
  const mandatoryRequirements = toBulletItems(selectedPost.requirementsMandatory || "");
  const preferredRequirements = toBulletItems(selectedPost.requirementsPreferred || "");
  const benefits = toBulletItems(selectedPost.benefits || "");

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6">
      <div className="mx-auto w-full max-w-md md:max-w-2xl">
        <div className="relative">
          <img
            src={cover}
            alt={selectedPost.position}
            className="h-64 w-full rounded-t-3xl object-cover"
          />

          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-3 rounded-full bg-white/95 p-2 text-slate-700 shadow-sm hover:bg-white"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="absolute left-1/2 top-56 -translate-x-1/2">
            <Avatar className="h-20 w-20 border-4 border-white bg-slate-900 shadow-md">
              <AvatarImage
                src={selectedPost.companyAvatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedPost.companyId}`}
                alt={selectedPost.companyName}
              />
              <AvatarFallback className="text-white">
                {selectedPost.companyName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="rounded-b-3xl border border-t-0 border-slate-200 bg-white px-4 pb-5 pt-12 shadow-sm">
            <h1 className="text-center text-5xl font-bold text-slate-900">
              {selectedPost.position}
            </h1>

            <div className="mt-1 flex items-center justify-center gap-1 text-base text-blue-500">
              <Building2 size={14} />
              <span>{selectedPost.companyName}</span>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-base text-slate-600">
              <InfoRow icon={<MapPin size={14} />} text={selectedPost.address} />
              <div className="grid grid-cols-2 gap-2">
                <InfoRow icon={<CircleDollarSign size={14} />} text={selectedPost.salary} />
                <InfoRow icon={<Briefcase size={14} />} text={selectedPost.employmentType} />
                {selectedPost.experienceYear && (
                  <InfoRow
                    icon={<Clock3 size={14} />}
                    text={`+ ${selectedPost.experienceYear} Năm kinh nghiệm`}
                  />
                )}
                {selectedPost.quantity && (
                  <InfoRow
                    icon={<Users size={14} />}
                    text={`${selectedPost.quantity} Ứng viên`}
                  />
                )}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {selectedPost.jobDescription && (
                <DetailSection title="Mô tả công việc">
                  <p className="text-base leading-relaxed text-slate-600">
                    {selectedPost.jobDescription}
                  </p>
                </DetailSection>
              )}

              {(mandatoryRequirements.items.length > 0 || preferredRequirements.items.length > 0) && (
                <DetailSection title="Yêu cầu chuyên môn">
                  <div className="space-y-3">
                    {mandatoryRequirements.items.length > 0 && (
                      <TagBox 
                        tone="required" 
                        label="Bắt buộc" 
                        items={mandatoryRequirements.items}
                        isListFormat={mandatoryRequirements.isListFormat}
                      />
                    )}
                    {preferredRequirements.items.length > 0 && (
                      <TagBox 
                        tone="preferred" 
                        label="Ưu tiên" 
                        items={preferredRequirements.items}
                        isListFormat={preferredRequirements.isListFormat}
                      />
                    )}
                  </div>
                </DetailSection>
              )}

              {benefits.items.length > 0 && (
                <DetailSection title="Quyền lợi & đãi ngộ">
                  {benefits.isListFormat ? (
                    <ul className="list-disc space-y-1 pl-5 text-base text-slate-600">
                      {benefits.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base leading-relaxed text-slate-600">
                      {benefits.items.join(", ")}
                    </p>
                  )}
                </DetailSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="text-sm leading-snug text-slate-600">{text}</span>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 border-l-4 border-blue-400 pl-2 text-4xl font-bold text-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function TagBox({
  label,
  items,
  tone,
  isListFormat = true,
}: {
  label: string;
  items: string[];
  tone: "required" | "preferred";
  isListFormat?: boolean;
}) {
  const tagClassName =
    tone === "required"
      ? "bg-red-100 text-red-600 border-red-200"
      : "bg-blue-100 text-blue-600 border-blue-200";

  const boxClassName =
    tone === "required" ? "border-red-100 bg-red-50/60" : "border-blue-100 bg-blue-50/60";

  return (
    <div className={`rounded-xl border p-3 ${boxClassName}`}>
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-sm font-semibold ${tagClassName}`}>
        {label}
      </span>
      {isListFormat ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          {items.join(", ")}
        </p>
      )}
    </div>
  );
}

function toBulletItems(rawText: string): { items: string[]; isListFormat: boolean } {
  // Nếu có newline (\n), ưu tiên tách theo newline (list format)
  // Nếu không có newline, tách theo dấu phẩy (text format)
  const isListFormat = rawText.includes('\n');
  const separator = isListFormat ? '\n' : ',';
  
  const items = rawText
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
  
  return { items, isListFormat };
}
