import { X } from "lucide-react";
import { useState } from "react";
import {
  createEmptyOtherInfoTwoDraft,
  type OtherInfoTwoDraft,
} from "./otherInfoTwoDraft";

type OtherInfoTwoEditorProps = {
  initialData: OtherInfoTwoDraft;
  onSave: (nextDraft: OtherInfoTwoDraft) => void;
  onCancel: () => void;
};

export default function OtherInfoTwoEditor({
  initialData,
  onSave,
  onCancel,
}: OtherInfoTwoEditorProps) {
  const [draft, setDraft] = useState<OtherInfoTwoDraft>(initialData || createEmptyOtherInfoTwoDraft());
  const [isDirty, setIsDirty] = useState(false);

  const updateDetail = (value: string) => {
    setDraft({ detail: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave({ detail: (draft?.detail || "").trim() });
    setIsDirty(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[40px] font-bold leading-tight text-slate-800">
            Thêm mục tiêu, tầm nhìn & động lực hoặc giới thiệu chuyên môn
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm mục tiêu, tầm nhìn & động lực hoặc giới thiệu chuyên môn để hiển thị trong hồ sơ của bạn
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
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.detail}
            onChange={(event) => updateDetail(event.target.value)}
            className="min-h-44 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 min-w-20 rounded-xl bg-[#e6eaf1] px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="h-9 min-w-28 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isDirty}
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
