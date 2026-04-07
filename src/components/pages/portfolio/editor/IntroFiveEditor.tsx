import { Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  createEmptyIntroFiveDraft,
  type IntroFiveDraft,
} from "@/components/pages/portfolio/editor/introFiveDraft";
import { portfolioService } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

type IntroFiveEditorProps = {
  initialData: IntroFiveDraft;
  onSave: (nextDraft: IntroFiveDraft) => void;
  onCancel: () => void;
};

export default function IntroFiveEditor({
  initialData,
  onSave,
  onCancel,
}: IntroFiveEditorProps) {
  const [draft, setDraft] = useState<IntroFiveDraft>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(initialData);
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (avatarBlobUrl) {
        URL.revokeObjectURL(avatarBlobUrl);
      }
    };
  }, [avatarBlobUrl]);

  const avatarPreviewUrl = useMemo(() => {
    if (avatarBlobUrl) {
      return avatarBlobUrl;
    }
    if (draft.avatar && (draft.avatar.startsWith("http://") || draft.avatar.startsWith("https://"))) {
      return draft.avatar;
    }
    return null;
  }, [avatarBlobUrl, draft.avatar]);

  const hasContent = [
    draft.fullName,
    draft.school,
    draft.department,
    draft.experience,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof IntroFiveDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      notify.error("Vui lòng chọn tệp ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error("Ảnh không được quá 5MB.");
      return;
    }

    console.log("📸 Avatar selected:", file.name);
    
    try {
      // Generate reference ID and store file
      const referenceId = await portfolioService.uploadPortfolioImage(file);
      console.log("📸 Avatar file stored with reference:", referenceId);
      
      // Store file and create preview blob URL
      setAvatarFile(file);
      const blobUrl = URL.createObjectURL(file);
      setAvatarBlobUrl(blobUrl);
      
      // Store the reference ID in draft
      updateDraftField("avatar", referenceId);
      
      notify.success("Ảnh đã được chọn! Sẽ tải lên khi lưu hồ sơ.");
    } catch (error) {
      console.error("❌ Avatar upload error:", error);
      notify.error(error instanceof Error ? error.message : "Lỗi khi tải ảnh");
    }
    
    event.target.value = "";
  };

  const handleSave = () => {
    console.log("🔵 [IntroFiveEditor.handleSave] Called - hasContent:", hasContent);
    console.log("🔵 [IntroFiveEditor.handleSave] Current draft:", draft);
    
    if (!hasContent) {
      console.log("🔴 [IntroFiveEditor.handleSave] No content, returning");
      return;
    }

    // Avatar file is already stored in handleAvatarUpload via uploadPortfolioImage
    // No need to store again here

    const dataToSave = {
      fullName: draft.fullName.trim(),
      school: draft.school.trim(),
      department: draft.department.trim(),
      experience: draft.experience.trim(),
      avatar: draft.avatar,
      studyField: draft.studyField.trim(),
      title: draft.title.trim(),
    };
    
    console.log("🟢 [IntroFiveEditor.handleSave] Calling onSave with data:", dataToSave);
    onSave(dataToSave);
    
    console.log("🟢 [IntroFiveEditor.handleSave] Resetting draft form");
    setDraft(createEmptyIntroFiveDraft());
  };

  const hasAvatar = avatarPreviewUrl !== null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Giới thiệu</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thông tin giới thiệu bản thân để hiển thị trong hồ sơ của bạn
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1 text-slate-700 transition-colors hover:bg-slate-200"
          title="Đóng"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-3 p-3">
        <div className="rounded-xl border border-[#d7dfeb] bg-white p-3">
          <div className="mb-3 flex justify-center">
            {hasAvatar && avatarPreviewUrl ? (
              <img
                src={avatarPreviewUrl}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover"
                onError={(e) => {
                  console.warn("❌ Failed to load avatar preview");
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-2xl font-semibold text-slate-600">
                {draft.fullName.trim().charAt(0).toUpperCase() || "A"}
              </div>
            )}
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#edf3ff] text-sm font-semibold text-[#4A79E8] transition-colors hover:bg-[#e2ebff]"
            >
              <Upload size={15} /> Tải ảnh lên
            </button>
            <button
              type="button"
              onClick={() => {
                setAvatarFile(null);
                setAvatarBlobUrl(null);
                updateDraftField("avatar", "");
              }}
              disabled={!hasAvatar}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#eef1f6] text-sm font-semibold text-slate-500 transition-colors hover:bg-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} /> Xóa ảnh
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Họ và tên</label>
          <input
            value={draft.fullName}
            onChange={(event) => updateDraftField("fullName", event.target.value)}
            placeholder="Nhập họ và tên"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Khoa</label>
          <input
            value={draft.department}
            onChange={(event) => updateDraftField("department", event.target.value)}
            placeholder="Nhập khoa"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Năm kinh nghiệm</label>
          <input
            value={draft.experience}
            onChange={(event) => updateDraftField("experience", event.target.value)}
            placeholder="Nhập năm kinh nghiệm"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên trường</label>
          <input
            value={draft.school}
            onChange={(event) => updateDraftField("school", event.target.value)}
            placeholder="Nhập tên trường"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Chuyên ngành</label>
          <input
            value={draft.studyField}
            onChange={(event) => updateDraftField("studyField", event.target.value)}
            placeholder="Nhập chuyên ngành học tập"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Vị trí công việc</label>
          <input
            value={draft.title}
            onChange={(event) => updateDraftField("title", event.target.value)}
            placeholder="Nhập vị trí công việc hoặc chuyên môn"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasContent}
          className="h-10 flex-1 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
