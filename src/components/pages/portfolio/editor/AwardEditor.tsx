import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type AwardOneDraft } from "@/components/pages/portfolio/editor/awardOneDraft";

type AwardEditorProps = {
  initialData: AwardOneDraft;
  initialList?: AwardOneDraft[];
  onSave: (nextDraft: AwardOneDraft) => void;
  onSaveList?: (awardList: AwardOneDraft[]) => void;
  onCancel: () => void;
};

export default function AwardEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: AwardEditorProps) {
  const [draft, setDraft] = useState<AwardOneDraft>(initialData);
  const [awardList, setAwardList] = useState<AwardOneDraft[]>(initialList);

  const hasContent = [draft.name, draft.date, draft.organization, draft.description].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof AwardOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddAward = () => {
    if (!hasContent) {
      return;
    }

    const newAward: AwardOneDraft = {
      name: draft.name.trim(),
      date: draft.date.trim(),
      organization: draft.organization.trim(),
      description: draft.description.trim(),
    };

    const updatedList = [...awardList, newAward];
    setAwardList(updatedList);
    
    // Reset form
    setDraft({
      name: "",
      date: "",
      organization: "",
      description: "",
    });

    // Call the list save handler if provided
    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      // Fallback to old behavior
      onSave(newAward);
    }
  };

  const handleRemoveAward = (index: number) => {
    const updatedList = awardList.filter((_, i) => i !== index);
    setAwardList(updatedList);
    
    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">
            Thêm danh hiệu & giải thưởng
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm danh hiệu & giải thưởng để hiển thị trong hồ sơ của bạn
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

      {/* List of existing awards */}
      {awardList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách danh hiệu ({awardList.length})
          </h4>
          <div className="space-y-2">
            {awardList.map((award, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{award.name}</p>
                  {award.date && (
                    <p className="text-xs text-slate-500">{award.date}</p>
                  )}
                  {award.organization && (
                    <p className="text-xs text-slate-600">{award.organization}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAward(index)}
                  className="ml-2 rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form to add new award */}
      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên danh hiệu & giải thưởng</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên danh hiệu & giải thưởng"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Thời gian</label>
          <input
            value={draft.date}
            onChange={(event) => updateDraftField("date", event.target.value)}
            placeholder="Nhập thời gian bạn được nhận"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Người cấp</label>
          <input
            value={draft.organization}
            onChange={(event) => updateDraftField("organization", event.target.value)}
            placeholder="Nhập nơi cấp cho bạn"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Thêm chút mô tả danh hiệu & giải thưởng của bạn"
            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
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
          onClick={handleAddAward}
          disabled={!hasContent}
          className="flex h-9 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm danh hiệu mới
        </button>
      </div>
    </div>
  );
}
