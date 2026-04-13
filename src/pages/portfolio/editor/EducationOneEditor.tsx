import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type EducationOneDraft } from "@/pages/portfolio/editor/educationOneDraft";

type EducationOneEditorProps = {
  initialData: EducationOneDraft;
  initialList?: EducationOneDraft[];
  onSave: (nextDraft: EducationOneDraft) => void;
  onSaveList?: (educationList: EducationOneDraft[]) => void;
  onCancel: () => void;
};

export default function EducationOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: EducationOneEditorProps) {
  const [draft, setDraft] = useState<EducationOneDraft>(initialData);
  const [educationList, setEducationList] = useState<EducationOneDraft[]>(initialList);

  const hasContent = [
    draft.schoolName,
    draft.time,
    draft.department,
    draft.certificate,
    draft.description,
  ].some((value) => value.trim().length > 0);

  const updateDraftField = (field: keyof EducationOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddEducation = () => {
    if (!hasContent) {
      return;
    }

    const newEducation: EducationOneDraft = {
      schoolName: draft.schoolName.trim(),
      time: draft.time.trim(),
      department: draft.department.trim(),
      certificate: draft.certificate.trim(),
      description: draft.description.trim(),
    };

    const updatedList = [...educationList, newEducation];
    setEducationList(updatedList);

    // Reset form
    setDraft({
      schoolName: "",
      time: "",
      department: "",
      certificate: "",
      description: "",
    });

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newEducation);
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm học vấn</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm học vấn để hiển thị trong hồ sơ của bạn
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

      {/* List of existing education */}
      {educationList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách học vấn ({educationList.length})
          </h4>
          <div className="space-y-2">
            {educationList.map((education, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{education.schoolName}</p>
                  {education.time && (
                    <p className="text-xs text-slate-500">{education.time}</p>
                  )}
                  {education.department && (
                    <p className="text-xs text-slate-600">{education.department}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
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
          <label className="text-sm font-semibold text-slate-600">Tên trường / cơ sở / tổ chức</label>
          <input
            value={draft.schoolName}
            onChange={(event) => updateDraftField("schoolName", event.target.value)}
            placeholder="Nhập tên trường / cơ sở / tổ chức bạn đã học"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

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
          <label className="text-sm font-semibold text-slate-600">Chuyên ngành</label>
          <input
            value={draft.department}
            onChange={(event) => updateDraftField("department", event.target.value)}
            placeholder="Nhập chuyên ngành bạn đã hoàn thành"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Chứng chỉ</label>
          <input
            value={draft.certificate}
            onChange={(event) => updateDraftField("certificate", event.target.value)}
            placeholder="Nhập chứng chỉ bạn đạt được"
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
          onClick={handleAddEducation}
          disabled={!hasContent}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm học vấn mới
        </button>
      </div>
    </div>
  );
}
