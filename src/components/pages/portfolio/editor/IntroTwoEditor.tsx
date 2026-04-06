import { Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import { type IntroTwoDraft } from "./introTwoDraft";
import { portfolioService } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

type IntroTwoEditorProps = {
  initialData: IntroTwoDraft;
  onSave: (nextDraft: IntroTwoDraft) => void;
  onCancel: () => void;
};

export default function IntroTwoEditor({ initialData, onSave, onCancel }: IntroTwoEditorProps) {
  const [draft, setDraft] = useState<IntroTwoDraft>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Debug: Log when component mounts and initialData changes
  useEffect(() => {
    console.log("🎯 [IntroTwoEditor] Mounted/updated with initialData:", initialData);
    console.log("   fullName:", initialData.fullName);
    console.log("   position:", initialData.position);
    console.log("   avatar:", initialData.avatar);
  }, [initialData]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (avatarBlobUrl) {
        URL.revokeObjectURL(avatarBlobUrl);
      }
    };
  }, [avatarBlobUrl]);

  const avatarPreviewUrl = useMemo(() => {
    // If new file selected, use blob URL
    if (avatarBlobUrl) {
      console.log("📸 Using blob URL for avatar preview");
      return avatarBlobUrl;
    }
    // If avatar is an HTTP/HTTPS URL, use it directly
    if (draft.avatar && (draft.avatar.startsWith("http://") || draft.avatar.startsWith("https://"))) {
      console.log("📸 Using HTTP/HTTPS URL for avatar:", draft.avatar.substring(0, 50));
      return draft.avatar;
    }
    // For reference IDs or other strings, don't try to display them
    // They'll be preserved in the data but won't show a preview
    if (draft.avatar) {
      console.log("📸 Avatar is a reference/string, won't display preview:", draft.avatar);
    }
    return null;
  }, [avatarBlobUrl, draft.avatar]);

  const updateDraftField = (field: keyof IntroTwoDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
    
    // Create preview blob URL
    const blobUrl = URL.createObjectURL(file);
    setAvatarBlobUrl(blobUrl);
    
    // Create a temporary reference for the file name
    const tempReference = `avatar_${Date.now()}`;
    
    // Automatically store the file for portfolio upload when selected
    // This ensures the file is available even if the block isn't explicitly saved
    portfolioService.storePortfolioImageFile(tempReference, file);
    console.log("📸 Avatar file stored immediately with reference:", tempReference);
    
    updateDraftField("avatar", tempReference);
    
    notify.success("Ảnh đã được chọn!");
    event.target.value = "";
  };

  const handleSave = () => {
    // Avatar file is already stored when user uploads it
    // No need to store it again here
    
    onSave({
      fullName: draft.fullName.trim(),
      position: draft.position.trim(),
      yearOfStudy: draft.yearOfStudy.trim(),
      school: draft.school.trim(),
      studyField: draft.studyField.trim(),
      email: draft.email.trim(),
      phoneNumber: draft.phoneNumber.trim(),
      avatar: draft.avatar,
    });
    setIsDirty(false);
  };

  const hasAvatar = avatarPreviewUrl !== null;

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

          <div className="mb-4 grid grid-cols-2 gap-2">
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
                setAvatarBlobUrl(null);
                updateDraftField("avatar", "");
              }}
              disabled={!hasAvatar}
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
              <label className="text-sm font-semibold text-slate-500">Chức danh / Vị trí</label>
              <input
                value={draft.position}
                onChange={(event) => updateDraftField("position", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Sinh viên năm mấy?</label>
              <input
                value={draft.yearOfStudy}
                onChange={(event) => updateDraftField("yearOfStudy", event.target.value)}
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
              <label className="text-sm font-semibold text-slate-500">Chuyên ngành</label>
              <input
                value={draft.studyField}
                onChange={(event) => updateDraftField("studyField", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Địa chỉ email</label>
              <input
                type="email"
                value={draft.email}
                onChange={(event) => updateDraftField("email", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500">Số điện thoại</label>
              <input
                type="tel"
                value={draft.phoneNumber}
                onChange={(event) => updateDraftField("phoneNumber", event.target.value)}
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
