import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type ReferenceOneDraft } from "./referenceOneDraft";

type ReferenceEditorProps = {
  initialData: ReferenceOneDraft;
  initialList?: ReferenceOneDraft[];
  onSave: (nextDraft: ReferenceOneDraft) => void;
  onSaveList?: (referenceList: ReferenceOneDraft[]) => void;
  onCancel: () => void;
};

export default function ReferenceEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ReferenceEditorProps) {
  const [draft, setDraft] = useState<ReferenceOneDraft>(initialData);
  const [referenceList, setReferenceList] = useState<ReferenceOneDraft[]>(initialList);

  const hasContent = [draft.name, draft.position, draft.email, draft.contactInfo].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof ReferenceOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddReference = () => {
    if (!hasContent) {
      return;
    }

    const newReference: ReferenceOneDraft = {
      name: draft.name.trim(),
      position: draft.position.trim(),
      email: draft.email.trim(),
      contactInfo: draft.contactInfo.trim(),
    };

    const updatedList = [...referenceList, newReference];
    setReferenceList(updatedList);

    // Reset form
    setDraft({
      name: "",
      position: "",
      email: "",
      contactInfo: "",
    });

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newReference);
    }
  };

  const handleRemoveReference = (index: number) => {
    const updatedList = referenceList.filter((_, i) => i !== index);
    setReferenceList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[40px] font-bold leading-tight text-slate-800">Thêm người giới thiệu</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm người giới thiệu để hiển thị trong hồ sơ của bạn
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

      {/* List of existing references */}
      {referenceList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách người giới thiệu ({referenceList.length})
          </h4>
          <div className="space-y-2">
            {referenceList.map((reference, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{reference.name}</p>
                  {reference.position && (
                    <p className="text-xs text-slate-600">{reference.position}</p>
                  )}
                  {reference.email && (
                    <p className="text-xs text-slate-500">{reference.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveReference(index)}
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
          <label className="text-sm font-semibold text-slate-600">Tên người giới thiệu</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên người giới thiệu"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Công việc / vị trí</label>
          <input
            value={draft.position}
            onChange={(event) => updateDraftField("position", event.target.value)}
            placeholder="Nhập công việc hoặc vị trí"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Email</label>
          <input
            value={draft.email}
            onChange={(event) => updateDraftField("email", event.target.value)}
            placeholder="Nhập địa chỉ email"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Thêm thông tin liên hệ</label>
          <textarea
            value={draft.contactInfo}
            onChange={(event) => updateDraftField("contactInfo", event.target.value)}
            placeholder="Thêm thông tin liên hệ khác, ví dụ số điện thoại"
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
          onClick={handleAddReference}
          disabled={!hasContent}
          className="flex h-9 min-w-40 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm người giới thiệu
        </button>
      </div>
    </div>
  );
}
