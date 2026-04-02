import { Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import { type IntroTwoDraft } from "./introTwoDraft";
import { portfolioService } from "@/services/portfolio.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

type IntroTwoEditorProps = {
  initialData: IntroTwoDraft;
  onSave: (nextDraft: IntroTwoDraft) => void;
  onCancel: () => void;
};

export default function IntroTwoEditor({ initialData, onSave, onCancel }: IntroTwoEditorProps) {
  const [draft, setDraft] = useState<IntroTwoDraft>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { accessToken } = useAppSelector((state) => state.auth);

  const updateDraftField = (field: keyof IntroTwoDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
    setIsDirty(true);
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

    try {
      setIsUploadingAvatar(true);
      console.log("📸 Uploading avatar:", file.name);

      if (!accessToken) {
        notify.error("Bạn cần đăng nhập để tải ảnh.");
        return;
      }

      // Upload image to server and get URL back
      const imageUrl = await portfolioService.uploadPortfolioImage(file, accessToken);
      console.log("✅ Avatar uploaded successfully:", imageUrl);

      // Store URL instead of base64 data
      updateDraftField("avatar", imageUrl);
      notify.success("Ảnh đã tải lên thành công!");
    } catch (error) {
      console.error("❌ Avatar upload error:", error);
      notify.error(error instanceof Error ? error.message : "Lỗi khi tải ảnh");
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSave = () => {
    onSave({
      fullName: draft.fullName.trim(),
      school: draft.school.trim(),
      department: draft.department.trim(),
      studyField: draft.studyField.trim(),
      gpa: draft.gpa.trim(),
      avatar: draft.avatar,
    });
    setIsDirty(false);
  };

  const hasAvatar = draft.avatar.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-center justify-between border-b border-[#d7dfeb] px-4 py-3">
        <h3 className="text-[44px] font-bold leading-tight text-slate-800">Giới thiệu bản thân</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1 text-slate-700 transition-colors hover:bg-slate-200"
          title="Đóng"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-4 p-3">
        <div className="rounded-xl border border-[#d7dfeb] bg-white p-3">
          <div className="mb-3 flex justify-center">
            {hasAvatar ? (
              <img
                src={draft.avatar}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover"
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
            disabled={isUploadingAvatar}
            className="hidden"
          />

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#edf3ff] text-sm font-semibold text-[#4A79E8] transition-colors hover:bg-[#e2ebff] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload size={15} /> {isUploadingAvatar ? "Đang tải..." : "Tải ảnh lên"}
            </button>
            <button
              type="button"
              onClick={() => updateDraftField("avatar", "")}
              disabled={!hasAvatar || isUploadingAvatar}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#eef1f6] text-sm font-semibold text-slate-500 transition-colors hover:bg-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} /> Xóa ảnh
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Tên hiển thị</label>
              <input
                value={draft.fullName}
                onChange={(event) => updateDraftField("fullName", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Tên trường</label>
              <input
                value={draft.school}
                onChange={(event) => updateDraftField("school", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Khoa</label>
              <input
                value={draft.department}
                onChange={(event) => updateDraftField("department", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Chuyên ngành</label>
              <input
                value={draft.studyField}
                onChange={(event) => updateDraftField("studyField", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Điểm GPA</label>
              <input
                value={draft.gpa}
                onChange={(event) => updateDraftField("gpa", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="h-10 flex-1 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!isDirty}
        >
          Lưu
        </button>
      </div>
    </div>
  );
}
