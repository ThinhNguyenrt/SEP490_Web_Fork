import { X } from "lucide-react";
import { useState } from "react";
import { type ReferenceOneDraft } from "./referenceOneDraft";

type ReferenceEditorProps = {
  initialData: ReferenceOneDraft;
  onSave: (nextDraft: ReferenceOneDraft) => void;
  onCancel: () => void;
};

export default function ReferenceEditor({
  initialData,
  onSave,
  onCancel,
}: ReferenceEditorProps) {
  const [draft, setDraft] = useState<ReferenceOneDraft>(initialData);

  const hasContent = [draft.name, draft.position, draft.email, draft.contactInfo].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof ReferenceOneDraft, value: string) => {
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
      name: draft.name.trim(),
      position: draft.position.trim(),
      email: draft.email.trim(),
      contactInfo: draft.contactInfo.trim(),
    });
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
          onClick={handleSave}
          disabled={!hasContent}
          className="h-9 min-w-32 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Thêm người giới thiệu
        </button>
      </div>
    </div>
  );
}
