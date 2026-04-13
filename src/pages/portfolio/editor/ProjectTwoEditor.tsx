import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createEmptyProjectTwoDraft,
  type ProjectTwoDraft,
} from "@/pages/portfolio/editor/projectTwoDraft";

type ProjectTwoEditorProps = {
  initialData: ProjectTwoDraft;
  onSave: (nextDraft: ProjectTwoDraft) => void;
  onCancel: () => void;
};

export default function ProjectTwoEditor({
  initialData,
  onSave,
  onCancel,
}: ProjectTwoEditorProps) {
  const [draft, setDraft] = useState<ProjectTwoDraft>(initialData);

  useEffect(() => {
    setDraft(initialData);
  }, [initialData]);

  const hasContent = [
    draft.name,
    draft.action,
    draft.publisher,
    draft.description,
    draft.link,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof ProjectTwoDraft, value: string) => {
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
      action: draft.action.trim(),
      publisher: draft.publisher.trim(),
      description: draft.description.trim(),
      link: draft.link.trim(),
    });
    setDraft(createEmptyProjectTwoDraft());
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm dự án nghiên cứu</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm dự án nghiên cứu để hiển thị trong hồ sơ của bạn
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
          <label className="text-sm font-semibold text-slate-600">Chủ đề</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên chủ đề"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Hành động</label>
          <input
            value={draft.action}
            onChange={(event) => updateDraftField("action", event.target.value)}
            placeholder="Bạn là tác giả chính hay đồng tác giả"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Xuất bản</label>
          <input
            value={draft.publisher}
            onChange={(event) => updateDraftField("publisher", event.target.value)}
            placeholder="Bạn xuất bản nghiên cứu ở đâu?"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Link dẫn chứng</label>
          <input
            value={draft.link}
            onChange={(event) => updateDraftField("link", event.target.value)}
            placeholder="Thêm link của bạn để thể hiện rõ hơn"
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
