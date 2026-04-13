import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createEmptyOtherSevenDraft,
  type OtherSevenDraft,
} from "@/pages/portfolio/editor/otherSevenDraft";

type OtherInfoSevenEditorProps = {
  initialData: OtherSevenDraft;
  onSave: (nextDraft: OtherSevenDraft) => void;
  onCancel: () => void;
};

export default function OtherInfoSevenEditor({
  initialData,
  onSave,
  onCancel,
}: OtherInfoSevenEditorProps) {
  const [draft, setDraft] = useState<OtherSevenDraft>(initialData || createEmptyOtherSevenDraft());

  useEffect(() => {
    setDraft(initialData || createEmptyOtherSevenDraft());
  }, [initialData]);

  const hasContent = [(draft?.name || ""), (draft?.detail || "")].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof OtherSevenDraft, value: string) => {
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
      name: (draft?.name || "").trim(),
      detail: (draft?.detail || "").trim(),
    });
    setDraft(createEmptyOtherSevenDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm tài liệu bổ sung</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thêm tài liệu bổ sung để hiển thị trong hồ sơ của bạn
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
          <label className="text-sm font-semibold text-slate-600">Tên tài liệu</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên tài liệu"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">File tài liệu</label>
          <input
            value={draft.detail}
            onChange={(event) => updateDraftField("detail", event.target.value)}
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
