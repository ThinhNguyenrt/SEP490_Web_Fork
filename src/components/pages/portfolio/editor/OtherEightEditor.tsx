import { Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import { type OtherEightDraft } from "./otherEightDraft";

type OtherEightEditorProps = {
  initialData: OtherEightDraft;
  onSave: (nextDraft: OtherEightDraft) => void;
  onCancel: () => void;
};

export default function OtherEightEditor({
  initialData,
  onSave,
  onCancel,
}: OtherEightEditorProps) {
  const [draft, setDraft] = useState<OtherEightDraft>(initialData);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateDetail = (value: string) => {
    setDraft({ detail: value });
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadedFileName(file.name);
    // Persist only file name in draft because actual file bytes are not uploaded here.
    updateDetail(file.name);
    event.target.value = "";
  };

  const handleSave = () => {
    onSave({ detail: draft.detail.trim() });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">
            Thêm giấy phép
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thêm giấy phép để hiển thị trong hồ sơ của bạn
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
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#c9d4ea] bg-white px-3 text-sm font-semibold text-[#4A79E8] transition-colors hover:bg-[#eef3ff]"
        >
          <Upload size={16} /> Tải file lên
        </button>

        {uploadedFileName && (
          <p className="text-xs font-medium text-slate-500">
            File đã chọn: {uploadedFileName}
          </p>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Link / file</label>
          <input
            value={draft.detail}
            onChange={(event) => updateDetail(event.target.value)}
            placeholder=""
            className="h-12 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
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
          disabled={draft.detail.trim().length === 0}
          className="h-10 flex-1 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
