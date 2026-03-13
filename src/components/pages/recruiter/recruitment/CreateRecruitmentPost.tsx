import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  CircleDollarSign,
  MapPin,
  Send,
  Upload,
  Users,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type EmploymentType = "fulltime" | "parttime";

type RecruitmentFormData = {
  title: string;
  location: string;
  salary: string;
  experienceYears: string;
  quantity: string;
  employmentType: EmploymentType;
  description: string;
  mandatoryRequirements: string;
  preferredRequirements: string;
  benefits: string;
};

const initialFormData: RecruitmentFormData = {
  title: "",
  location: "",
  salary: "",
  experienceYears: "",
  quantity: "",
  employmentType: "fulltime",
  description: "",
  mandatoryRequirements: "",
  preferredRequirements: "",
  benefits: "",
};

export default function CreateRecruitmentPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RecruitmentFormData>(initialFormData);
  const [bannerFileName, setBannerFileName] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const updateField =
    (field: keyof RecruitmentFormData) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFileName(file.name);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Create recruitment post", {
      ...formData,
      bannerFileName,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Tạo thông tin tuyển dụng</h1>
        </div>

        <div className="space-y-5">
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/40 px-4 py-6 text-center hover:bg-blue-50"
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="mb-2 h-32 w-full rounded-lg object-cover"
              />
            ) : (
              <Upload size={24} className="mb-2 text-blue-500" />
            )}
            <p className="text-base font-semibold text-slate-700">Chạm để tải lên</p>
            <p className="text-xs text-slate-500">Video hoặc ảnh 16/4</p>
            {bannerFileName && (
              <p className="mt-2 truncate text-xs font-medium text-blue-600">
                {bannerFileName}
              </p>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldWrapper icon={<Briefcase size={16} />}>
                <input
                  value={formData.title}
                  onChange={updateField("title")}
                  placeholder="Vị trí tuyển dụng (VD: Senior UX/UI)"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400"
                />
              </FieldWrapper>

              <FieldWrapper icon={<MapPin size={16} />}>
                <input
                  value={formData.location}
                  onChange={updateField("location")}
                  placeholder="Địa điểm làm việc"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400"
                />
              </FieldWrapper>

              <FieldWrapper icon={<CircleDollarSign size={16} />}>
                <input
                  value={formData.salary}
                  onChange={updateField("salary")}
                  placeholder="Mức lương"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400"
                />
              </FieldWrapper>

              <div className="relative">
                <select
                  value={formData.employmentType}
                  onChange={updateField("employmentType")}
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value="fulltime">Fulltime</option>
                  <option value="parttime">Parttime</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <FieldWrapper icon={<Users size={16} />}>
                <input
                  value={formData.experienceYears}
                  onChange={updateField("experienceYears")}
                  placeholder="Số năm KN"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400"
                />
              </FieldWrapper>

              <FieldWrapper icon={<Users size={16} />}>
                <input
                  value={formData.quantity}
                  onChange={updateField("quantity")}
                  placeholder="Số lượng tuyển"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400"
                />
              </FieldWrapper>
            </div>
          </div>

          <SectionTitle title="Mô tả công việc" />
          <textarea
            value={formData.description}
            onChange={updateField("description")}
            placeholder="Mô tả chi tiết công việc, trách nhiệm chính..."
            className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400"
          />

          <SectionTitle title="Yêu cầu chuyên môn" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
              <p className="mb-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                Bắt buộc
              </p>
              <textarea
                value={formData.mandatoryRequirements}
                onChange={updateField("mandatoryRequirements")}
                placeholder="Các kỹ năng bắt buộc"
                className="min-h-28 w-full resize-none rounded-lg border border-red-100 bg-white p-3 text-sm outline-none focus:border-red-300"
              />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
              <p className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                Ưu tiên
              </p>
              <textarea
                value={formData.preferredRequirements}
                onChange={updateField("preferredRequirements")}
                placeholder="Các kỹ năng bổ trợ"
                className="min-h-28 w-full resize-none rounded-lg border border-blue-100 bg-white p-3 text-sm outline-none focus:border-blue-300"
              />
            </div>
          </div>

          <SectionTitle title="Quyền lợi & đãi ngộ" />
          <textarea
            value={formData.benefits}
            onChange={updateField("benefits")}
            placeholder="Chế độ lương thưởng, phúc lợi..."
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400"
          />

          <button
            type="submit"
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Đăng tuyển dụng <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-l-4 border-blue-400 pl-2 text-base font-semibold text-slate-900">
      {title}
    </h2>
  );
}

function FieldWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <div className="pl-7">{children}</div>
    </div>
  );
}