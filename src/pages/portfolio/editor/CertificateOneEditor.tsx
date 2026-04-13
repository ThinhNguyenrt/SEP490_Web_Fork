import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type CertificateOneDraft } from "@/pages/portfolio/editor/certificateOneDraft";

type CertificateOneEditorProps = {
  initialData: CertificateOneDraft;
  initialList?: CertificateOneDraft[];
  onSave: (nextDraft: CertificateOneDraft) => void;
  onSaveList?: (certificateList: CertificateOneDraft[]) => void;
  onCancel: () => void;
};

export default function CertificateOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: CertificateOneEditorProps) {
  const [draft, setDraft] = useState<CertificateOneDraft>(initialData);
  const [certificateList, setCertificateList] = useState<CertificateOneDraft[]>(initialList);

  const hasContent = [draft.name, draft.issuer, draft.year, draft.link].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof CertificateOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddCertificate = () => {
    if (!hasContent) {
      return;
    }

    const newCertificate: CertificateOneDraft = {
      name: draft.name.trim(),
      issuer: draft.issuer.trim(),
      year: draft.year.trim(),
      link: draft.link.trim(),
    };

    const updatedList = [...certificateList, newCertificate];
    setCertificateList(updatedList);

    // Reset form
    setDraft({
      name: "",
      issuer: "",
      year: "",
      link: "",
    });

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newCertificate);
    }
  };

  const handleRemoveCertificate = (index: number) => {
    const updatedList = certificateList.filter((_, i) => i !== index);
    setCertificateList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm chứng chỉ</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm chứng chỉ để hiển thị trong hồ sơ của bạn
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

      {/* List of existing certificates */}
      {certificateList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách chứng chỉ ({certificateList.length})
          </h4>
          <div className="space-y-2">
            {certificateList.map((certificate, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{certificate.name}</p>
                  {certificate.issuer && (
                    <p className="text-xs text-slate-600">{certificate.issuer}</p>
                  )}
                  {certificate.year && (
                    <p className="text-xs text-slate-500">{certificate.year}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCertificate(index)}
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
          <label className="text-sm font-semibold text-slate-600">Tên chứng chỉ</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên chứng chỉ của bạn"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Cấp bởi</label>
          <input
            value={draft.issuer}
            onChange={(event) => updateDraftField("issuer", event.target.value)}
            placeholder="Nhập người/tổ chức đã chứng chỉ cho bạn"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Năm cấp</label>
          <input
            value={draft.year}
            onChange={(event) => updateDraftField("year", event.target.value)}
            placeholder="Nhập năm bạn được cấp chứng chỉ"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Link chứng chỉ</label>
          <input
            value={draft.link}
            onChange={(event) => updateDraftField("link", event.target.value)}
            placeholder="Thêm link chứng chỉ của bạn để thể hiện rõ hơn"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
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
          onClick={handleAddCertificate}
          disabled={!hasContent}
          className="flex h-9 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm chứng chỉ mới
        </button>
      </div>
    </div>
  );
}
