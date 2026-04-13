import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createEmptyEducationThreeDraft,
  type EducationThreeDraft,
} from "@/pages/portfolio/editor/educationThreeDraft";

type EducationThreeEditorProps = {
  initialData: EducationThreeDraft;
  latestData: EducationThreeDraft;
  onSave: (nextDraft: EducationThreeDraft) => void;
  onCancel: () => void;
};

export default function EducationThreeEditor({
  initialData,
  latestData,
  onSave,
  onCancel,
}: EducationThreeEditorProps) {
  const [draft, setDraft] = useState<EducationThreeDraft>(initialData);

  useEffect(() => {
    setDraft(initialData);
  }, [initialData]);

  const hasContent = [
    draft.time,
    draft.gpa,
    draft.qualified,
    draft.description,
  ].some((value) => typeof value === "string" && value.trim().length > 0);

  const updateDraftField = (field: keyof EducationThreeDraft, value: string) => {
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
      time: String(draft.time).trim(),
      gpa: String(draft.gpa).trim(),
      qualified: String(draft.qualified).trim(),
      description: String(draft.description).trim(),
    });
    setDraft(createEmptyEducationThreeDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm thành tích học tập</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm thành tích học tập để hiển thị trong hồ sơ của bạn
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
          <label className="text-sm font-semibold text-slate-600">Thời gian</label>
          <input
            value={draft.time}
            onChange={(event) => updateDraftField("time", event.target.value)}
            placeholder="Nhập thời gian bắt đầu và kết thúc, ví dụ: 2021 - 2026"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Điểm GPA</label>
          <input
            value={draft.gpa}
            onChange={(event) => updateDraftField("gpa", event.target.value)}
            placeholder="Nhập điểm GPA"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Xếp loại</label>
          <input
            value={draft.qualified}
            onChange={(event) => updateDraftField("qualified", event.target.value)}
            placeholder="Nhập xếp loại"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Giới thiệu</label>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Thêm chút giới thiệu những gì bạn đã đạt được"
            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        {(latestData.time || latestData.gpa || latestData.qualified || latestData.description) && (
          <div className="rounded-xl border border-[#d7dfeb] bg-white px-3 py-2 text-xs text-slate-500">
            Mục gần nhất: {latestData.time || "(chưa có thời gian)"}
          </div>
        )}
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
