import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createEmptyEducationTwoDraft,
  type EducationTwoDraft,
} from "@/pages/portfolio/editor/educationTwoDraft";

type EducationTwoEditorProps = {
  initialData: EducationTwoDraft;
  onSave: (nextDraft: EducationTwoDraft) => void;
  onCancel: () => void;
};

export default function EducationTwoEditor({
  initialData,
  onSave,
  onCancel,
}: EducationTwoEditorProps) {
  const [draft, setDraft] = useState<EducationTwoDraft>(initialData);

  useEffect(() => {
    setDraft(initialData);
  }, [initialData]);

  const hasContent = [
    draft.time,
    draft.department,
    draft.schoolName,
    draft.description,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof EducationTwoDraft, value: string) => {
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
      time: draft.time.trim(),
      department: draft.department.trim(),
      schoolName: draft.schoolName.trim(),
      description: draft.description.trim(),
    });
    setDraft(createEmptyEducationTwoDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm quá trình đào tạo</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm quá trình đào tạo để hiển thị trong hồ sơ của bạn
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
            placeholder="Nhập thời gian bắt đầu và kết thúc"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Chuyên ngành</label>
          <input
            value={draft.department}
            onChange={(event) => updateDraftField("department", event.target.value)}
            placeholder="Nhập chuyên ngành bạn đã hoàn thành"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên trường / cơ sở / tổ chức</label>
          <input
            value={draft.schoolName}
            onChange={(event) => updateDraftField("schoolName", event.target.value)}
            placeholder="Nhập tên trường / cơ sở / tổ chức bạn đã học"
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
