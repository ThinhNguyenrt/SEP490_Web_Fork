import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  createEmptyTeachingOneDraft,
  type TeachingOneDraft,
} from "./teachingOneDraft";

type TeachingOneEditorProps = {
  initialData: TeachingOneDraft;
  initialList?: TeachingOneDraft[];
  onSave: (nextDraft: TeachingOneDraft) => void;
  onSaveList?: (teachingList: TeachingOneDraft[]) => void;
  onCancel: () => void;
};

export default function TeachingOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: TeachingOneEditorProps) {
  const [draft, setDraft] = useState<TeachingOneDraft>(
    initialData || createEmptyTeachingOneDraft()
  );
  const [teachingList, setTeachingList] = useState<TeachingOneDraft[]>(initialList);

  const hasContent = [
    draft?.subject,
    draft?.teachingplace,
  ].some((value) => value && typeof value === "string" && value.trim().length > 0);

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

    const newTeaching: TeachingOneDraft = {
      subject: (draft?.subject || "").trim(),
      teachingplace: (draft?.teachingplace || "").trim(),
    };

    const updatedList = [...teachingList, newTeaching];
    setTeachingList(updatedList);
    
    // Reset form
    setDraft(createEmptyTeachingOneDraft());

    // Call the list save handler if provided
    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      // Fallback to old behavior
      onSave(newTeaching);
    }
  };

  const handleRemoveTeaching = (index: number) => {
    const updatedList = teachingList.filter((_, i) => i !== index);
    setTeachingList(updatedList);
    
    if (onSaveList) {
      onSaveList(updatedList);
    }
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

      <div className="space-y-4 p-4">
        {/* List of existing teaching items */}
        {teachingList.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Danh sách giảng dạy ({teachingList.length})</p>
            <div className="space-y-2">
              {teachingList.map((item, index) => (
                <div
                  key={`teaching-${index}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{item.subject}</p>
                    <p className="text-sm text-slate-600">{item.teachingplace}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeaching(index)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form to add new teaching */}
        <div className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Thêm mục mới</p>
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

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasContent}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A79E8] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} /> Thêm giảng dạy
          </button>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
