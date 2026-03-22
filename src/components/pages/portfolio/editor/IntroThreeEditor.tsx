import { Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import { type IntroThreeDraft } from "./introThreeDraft";

type IntroThreeEditorProps = {
  initialData: IntroThreeDraft;
  onSave: (nextDraft: IntroThreeDraft) => void;
  onCancel: () => void;
};

export default function IntroThreeEditor({ initialData, onSave, onCancel }: IntroThreeEditorProps) {
  const [draft, setDraft] = useState<IntroThreeDraft>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const updateDraftField = (field: keyof IntroThreeDraft, value: string) => {
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

    const reader = new FileReader();
    reader.onload = () => {
      const nextAvatar = typeof reader.result === "string" ? reader.result : "";
      updateDraftField("avatar", nextAvatar);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
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
    <div className="overflow-hidden rounded-2xl border border-[#d8e2f0] bg-[#EFF6FF]">
      <div className="flex items-center justify-between border-b border-[#d8e2f0] px-4 py-3">
        <h3 className="text-[34px] font-semibold leading-tight text-slate-800">Giới thiệu bản thân</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1 text-slate-800 transition-colors hover:bg-slate-200"
          title="Đóng"
        >
          <X size={24} strokeWidth={2.75} />
        </button>
      </div>

      <div className="p-3">
        <div className="rounded-xl border border-[#d8e2f0] bg-white px-4 py-4">
          <div className="mb-3 flex justify-center">
            {hasAvatar ? (
              <img
                src={draft.avatar}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e8d1b8] text-2xl font-semibold text-white">
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

          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#eef3fe] text-sm font-semibold text-[#4A79E8] transition-colors hover:bg-[#e3ecff]"
            >
              <Upload size={15} /> Tải ảnh lên
            </button>
            <button
              type="button"
              onClick={() => updateDraftField("avatar", "")}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#f2f4f7] text-sm font-semibold text-slate-500 transition-colors hover:bg-[#e7ecf3] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!hasAvatar}
            >
              <Trash2 size={15} /> Xóa ảnh
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Tên hiển thị</label>
              <input
                value={draft.fullName}
                onChange={(event) => updateDraftField("fullName", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Tên trường</label>
              <input
                value={draft.school}
                onChange={(event) => updateDraftField("school", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Khoa</label>
              <input
                value={draft.department}
                onChange={(event) => updateDraftField("department", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Chuyên ngành</label>
              <input
                value={draft.studyField}
                onChange={(event) => updateDraftField("studyField", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500">Điểm GPA</label>
              <input
                value={draft.gpa}
                onChange={(event) => updateDraftField("gpa", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-400 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d8e2f0] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl border border-slate-300 bg-[#f3f5f9] text-sm font-semibold text-slate-700 transition-colors hover:bg-[#e8edf5]"
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
