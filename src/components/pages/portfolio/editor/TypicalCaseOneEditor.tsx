import { X } from "lucide-react";
import { useState } from "react";
import {
  createEmptyTypicalCaseOneDraft,
  type TypicalCaseOneDraft,
} from "./typicalCaseOneDraft";

type TypicalCaseOneEditorProps = {
  initialData: TypicalCaseOneDraft;
  onSave: (nextDraft: TypicalCaseOneDraft) => void;
  onCancel: () => void;
};

export default function TypicalCaseOneEditor({
  initialData,
  onSave,
  onCancel,
}: TypicalCaseOneEditorProps) {
  const [draft, setDraft] = useState<TypicalCaseOneDraft>(initialData);

  const hasContent = [
    draft.patient,
    draft.age,
    draft.caseName,
    draft.stage,
    draft.regiment,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof TypicalCaseOneDraft, value: string) => {
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
      patient: draft.patient.trim(),
      age: draft.age.trim(),
      caseName: draft.caseName.trim(),
      stage: draft.stage.trim(),
      regiment: draft.regiment.trim(),
    });
    setDraft(createEmptyTypicalCaseOneDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm trường hợp điển hình</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm trường hợp điển hình để hiển thị trong hồ sơ của bạn
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
          <label className="text-sm font-semibold text-slate-600">Tên bệnh nhân</label>
          <input
            value={draft.patient}
            onChange={(event) => updateDraftField("patient", event.target.value)}
            placeholder="Giới thiệu bệnh nhân"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tuổi bệnh nhân</label>
          <input
            value={draft.age}
            onChange={(event) => updateDraftField("age", event.target.value)}
            placeholder="Tuổi bệnh nhân"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên bệnh</label>
          <input
            value={draft.caseName}
            onChange={(event) => updateDraftField("caseName", event.target.value)}
            placeholder="Nhập tên của bệnh"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tình trạng bệnh</label>
          <input
            value={draft.stage}
            onChange={(event) => updateDraftField("stage", event.target.value)}
            placeholder=""
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Phác đồ</label>
          <input
            value={draft.regiment}
            onChange={(event) => updateDraftField("regiment", event.target.value)}
            placeholder=""
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
