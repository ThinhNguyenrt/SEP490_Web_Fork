import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type ResearchOneDraft } from "./researchOneDraft";

type ResearchOneEditorProps = {
  initialData: ResearchOneDraft;
  initialList?: ResearchOneDraft[];
  onSave: (nextDraft: ResearchOneDraft) => void;
  onSaveList?: (researchList: ResearchOneDraft[]) => void;
  onCancel: () => void;
};

export default function ResearchOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ResearchOneEditorProps) {
  const [draft, setDraft] = useState<ResearchOneDraft>(
    initialData || { title: "", conference: "", date: "", link: "" }
  );
  const [researchList, setResearchList] = useState<ResearchOneDraft[]>(initialList);

  const hasContent = [
    draft?.title,
    draft?.conference,
    draft?.date,
    draft?.link,
  ].some((value) => value && typeof value === "string" && value.trim().length > 0);

  const updateDraftField = (field: keyof ResearchOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!hasContent) {
      return;
    }

    const newResearch: ResearchOneDraft = {
      title: (draft?.title || "").trim(),
      conference: (draft?.conference || "").trim(),
      date: (draft?.date || "").trim(),
      link: (draft?.link || "").trim(),
    };

    const updatedList = [...researchList, newResearch];
    setResearchList(updatedList);
    
    // Reset form
    setDraft({
      title: "",
      conference: "",
      date: "",
      link: "",
    });

    // Call the list save handler if provided
    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      // Fallback to old behavior
      onSave(newResearch);
    }
  };

  const handleRemoveResearch = (index: number) => {
    const updatedList = researchList.filter((_, i) => i !== index);
    setResearchList(updatedList);
    
    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Công bố khoa học</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thông tin công bố khoa học để hiển thị trong hồ sơ của bạn
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
        {/* List of existing research */}
        {researchList.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Danh sách công bố ({researchList.length})</p>
            <div className="space-y-2">
              {researchList.map((item, index) => (
                <div
                  key={`research-${index}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.conference} ({item.date})</p>
                    {item.link && <p className="text-sm text-blue-600 truncate">{item.link}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResearch(index)}
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

        {/* Form to add new research */}
        <div className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Thêm mục mới</p>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Tiêu đề</label>
            <input
              value={draft.title}
              onChange={(event) => updateDraftField("title", event.target.value)}
              placeholder="Nhập tiêu đề công bố khoa học"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Hội thảo/Tạp chí</label>
            <input
              value={draft.conference}
              onChange={(event) => updateDraftField("conference", event.target.value)}
              placeholder="Nhập hội thảo hoặc tạp chí"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Ngày công bố</label>
            <input
              value={draft.date}
              onChange={(event) => updateDraftField("date", event.target.value)}
              placeholder="Nhập ngày công bố"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Liên kết</label>
            <input
              value={draft.link}
              onChange={(event) => updateDraftField("link", event.target.value)}
              placeholder="Nhập liên kết"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasContent}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A79E8] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} /> Thêm công bố
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
