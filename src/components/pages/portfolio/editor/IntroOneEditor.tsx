import { Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import { type IntroOneDraft } from "@/components/pages/portfolio/editor/introOneDraft";
import { portfolioService } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

type IntroOneEditorProps = {
  initialData: IntroOneDraft;
  onSave: (nextDraft: IntroOneDraft) => void;
  onCancel: () => void;
};

export default function IntroOneEditor({ initialData, onSave, onCancel }: IntroOneEditorProps) {
  const [draft, setDraft] = useState<IntroOneDraft>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (avatarBlobUrl) {
        URL.revokeObjectURL(avatarBlobUrl);
      }
    };
  }, [avatarBlobUrl]);

  // Create blob URL for preview
  const avatarPreviewUrl = useMemo(() => {
    // If new file selected, use blob URL
    if (avatarBlobUrl) {
      return avatarBlobUrl;
    }
    // Check if avatar is a valid image URL (from saved state)
    if (draft.avatar && (draft.avatar.startsWith("http://") || draft.avatar.startsWith("https://"))) {
      return draft.avatar;
    }
    return null;
  }, [avatarBlobUrl, draft.avatar]);

  const updateDraftField = (field: keyof IntroOneDraft, value: string) => {
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
    
    // Store file and create preview blob URL
    setAvatarFile(file);
    const blobUrl = URL.createObjectURL(file);
    setAvatarBlobUrl(blobUrl);
    
    // Create a temporary reference for the file name
    const tempReference = `avatar_${Date.now()}`;
    updateDraftField("avatar", tempReference);
    
    notify.success("Ảnh đã được chọn! Sẽ tải lên khi lưu hồ sơ.");
    event.target.value = "";
  };

  const handleSave = () => {
    // If there's a new file selected, store it for portfolio upload
    if (avatarFile && draft.avatar) {
      portfolioService.storePortfolioImageFile(draft.avatar, avatarFile);
      console.log("📸 Avatar file stored for portfolio creation with reference:", draft.avatar);
    }
    
    onSave(draft);
    setIsDirty(false);
  };

  const hasAvatar = avatarPreviewUrl !== null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-center justify-between border-b border-[#d7dfeb] px-4 py-3">
        <h3 className="text-xl font-bold leading-tight text-slate-800">Giới thiệu bản thân</h3>
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
                className="h-16 w-16 rounded-full object-cover"
                onError={(e) => {
                  console.warn("❌ Failed to load avatar preview");
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-600">
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

          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Tên hiển thị</label>
              <input
                value={draft.fullName}
                onChange={(event) => updateDraftField("fullName", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Chức danh / Vị trí</label>
              <input
                value={draft.title}
                onChange={(event) => updateDraftField("title", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Địa chỉ email</label>
              <input
                value={draft.email}
                onChange={(event) => updateDraftField("email", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Số điện thoại</label>
              <input
                value={draft.phone}
                onChange={(event) => updateDraftField("phone", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-white p-3">
          <h4 className="mb-2 text-xl font-bold leading-tight text-slate-800">Giới thiệu bản thân</h4>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Giới thiệu chút về bản thân, mục tiêu nghề nghiệp"
            className="h-36 w-full resize-none rounded-xl border border-[#d1d5db] bg-[#f8f9fb] p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
          <p className="mt-2 text-sm font-medium text-slate-500">Gợi ý: 150 - 200 ký tự</p>
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
