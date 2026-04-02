import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type ActivityOneDraft } from "@/components/pages/portfolio/editor/activityOneDraft";

type ActivityOneEditorProps = {
  initialData: ActivityOneDraft;
  initialList?: ActivityOneDraft[];
  onSave: (nextDraft: ActivityOneDraft) => void;
  onSaveList?: (activityList: ActivityOneDraft[]) => void;
  onCancel: () => void;
};

export default function ActivityOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ActivityOneEditorProps) {
  const [draft, setDraft] = useState<ActivityOneDraft>(initialData);
  const [activityList, setActivityList] = useState<ActivityOneDraft[]>(initialList);

  const hasContent = [draft.name, draft.date, draft.description].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof ActivityOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddActivity = () => {
    if (!hasContent) {
      return;
    }

    const newActivity: ActivityOneDraft = {
      name: draft.name.trim(),
      date: draft.date.trim(),
      description: draft.description.trim(),
    };

    const updatedList = [...activityList, newActivity];
    setActivityList(updatedList);

    // Reset form
    setDraft({
      name: "",
      date: "",
      description: "",
    });

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newActivity);
    }
  };

  const handleRemoveActivity = (index: number) => {
    const updatedList = activityList.filter((_, i) => i !== index);
    setActivityList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  const handleSave = () => {
    if (!hasContent) {
      return;
    }

    onSave({
      name: draft.name.trim(),
      date: draft.date.trim(),
      description: draft.description.trim(),
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm hoạt động</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm hoạt động để hiển thị trong hồ sơ của bạn
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

      {/* List of existing activities */}
      {activityList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách hoạt động ({activityList.length})
          </h4>
          <div className="space-y-2">
            {activityList.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{activity.name}</p>
                  {activity.date && (
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(index)}
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

      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên hoạt động</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên hoạt động"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Thời gian</label>
          <input
            value={draft.date}
            onChange={(event) => updateDraftField("date", event.target.value)}
            placeholder="Nhập thời gian tổ chức"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Thêm chút mô tả hoạt động của bạn"
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
          onClick={handleAddActivity}
          disabled={!hasContent}
          className="flex h-9 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm hoạt động mới
        </button>
      </div>
    </div>
  );
}
