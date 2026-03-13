import {
  ArrowLeft,
  Briefcase,
  Building2,
  CircleDollarSign,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCompanyPosts } from "@/data/mockCompanyPost";
import coverImage from "@/assets/testImage/coverImagee.png";
import testImage from "@/assets/testImage/testImage.png";

const postCoverById: Record<number, string> = {
  1: coverImage,
  2: testImage,
  3: coverImage,
};

export default function RecruitmentDetails() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const selectedPost = useMemo(
    () => mockCompanyPosts.find((post) => post.postId === Number(postId)),
    [postId],
  );

  if (!selectedPost) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-base text-slate-700">Không tìm thấy bài đăng tuyển dụng.</p>
          <button
            onClick={() => navigate("/recruitment-management")}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Quay lại quản tuyển dụng
          </button>
        </div>
      </div>
    );
  }

  const cover = postCoverById[selectedPost.postId] ?? coverImage;
  const mandatoryRequirements = toBulletItems(selectedPost.requirementsMandatory);
  const preferredRequirements = toBulletItems(selectedPost.requirementsPreferred);
  const benefits = toBulletItems(selectedPost.benefits);

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
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${selectedPost.companyId}`}
                alt={selectedPost.companyName}
              />
              <AvatarFallback className="text-white">
                {selectedPost.companyName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="rounded-b-3xl border border-t-0 border-slate-200 bg-white px-4 pb-5 pt-12 shadow-sm">
            <h1 className="text-center text-3xl font-bold text-slate-900">
              {selectedPost.position}
            </h1>

            <div className="mt-1 flex items-center justify-center gap-1 text-sm text-blue-500">
              <Building2 size={14} />
              <span>{selectedPost.companyName}</span>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <InfoRow icon={<MapPin size={14} />} text={selectedPost.address} />
              <div className="grid grid-cols-2 gap-2">
                <InfoRow icon={<CircleDollarSign size={14} />} text={selectedPost.salary} />
                <InfoRow icon={<Briefcase size={14} />} text={selectedPost.employmentType} />
                <InfoRow
                  icon={<Clock3 size={14} />}
                  text={`+ ${selectedPost.experienceYear} Năm kinh nghiệm`}
                />
                <InfoRow
                  icon={<Users size={14} />}
                  text={`${selectedPost.quantity} Ứng viên`}
                />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <DetailSection title="Mô tả công việc">
                <p className="text-sm leading-relaxed text-slate-600">
                  {selectedPost.jobDescription}
                </p>
              </DetailSection>

              <DetailSection title="Yêu cầu chuyên môn">
                <div className="space-y-3">
                  <TagBox tone="required" label="Bắt buộc" items={mandatoryRequirements} />
                  <TagBox tone="preferred" label="Ưu tiên" items={preferredRequirements} />
                </div>
              </DetailSection>

              <DetailSection title="Quyền lợi & đãi ngộ">
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </DetailSection>
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
      <span className="text-xs leading-snug text-slate-600">{text}</span>
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
      <h2 className="mb-2 border-l-4 border-blue-400 pl-2 text-3xl font-bold text-slate-800">
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
}: {
  label: string;
  items: string[];
  tone: "required" | "preferred";
}) {
  const tagClassName =
    tone === "required"
      ? "bg-red-100 text-red-600 border-red-200"
      : "bg-blue-100 text-blue-600 border-blue-200";

  const boxClassName =
    tone === "required" ? "border-red-100 bg-red-50/60" : "border-blue-100 bg-blue-50/60";

  return (
    <div className={`rounded-xl border p-3 ${boxClassName}`}>
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tagClassName}`}>
        {label}
      </span>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function toBulletItems(rawText: string) {
  return rawText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
