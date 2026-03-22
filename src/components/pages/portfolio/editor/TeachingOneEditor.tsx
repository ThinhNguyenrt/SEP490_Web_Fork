import { X } from "lucide-react";
import { useState } from "react";
import {
  createEmptyTeachingOneDraft,
  type TeachingOneDraft,
} from "./teachingOneDraft";

type TeachingOneEditorProps = {
  initialData: TeachingOneDraft;
  onSave: (nextDraft: TeachingOneDraft) => void;
  onCancel: () => void;
};

export default function TeachingOneEditor({
  initialData,
  onSave,
  onCancel,
}: TeachingOneEditorProps) {
  const [draft, setDraft] = useState<TeachingOneDraft>(initialData);

  const hasContent = [
    draft.subject,
    draft.teachingplace,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof TeachingOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!hasContent) {
      return;
    }

    onSave({
      subject: draft.subject.trim(),
      teachingplace: draft.teachingplace.trim(),
    });
    setDraft(createEmptyTeachingOneDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm giảng dạy</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm giảng dạy để hiển thị trong hồ sơ của bạn
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
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Chủ đề giảng dạy</label>
          <input
            value={draft.subject}
            onChange={(event) => updateDraftField("subject", event.target.value)}
            placeholder="Nhập tên chủ đề"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Địa điểm</label>
          <input
            value={draft.teachingplace}
            onChange={(event) => updateDraftField("teachingplace", event.target.value)}
            placeholder="Nhập địa điểm"
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
