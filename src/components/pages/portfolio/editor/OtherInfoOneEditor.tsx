import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { type OtherInfoOneDraft } from "./otherInfoOneDraft";

type OtherInfoOneEditorProps = {
  initialData: OtherInfoOneDraft;
  onSave: (nextDraft: OtherInfoOneDraft) => void;
  onCancel: () => void;
};

const SUGGESTED_INTERESTS = ["bóng đá", "Bơi lội", "Nghe nhạc", "Nhiếp ảnh", "Tạo mẫu"];

const normalizeInterest = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const deduplicateInterests = (interests: string[]): string[] => {
  const used = new Set<string>();
  const nextInterests: string[] = [];

  interests.forEach((interestName) => {
    const normalized = normalizeInterest(interestName);
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (used.has(key)) {
      return;
    }

    used.add(key);
    nextInterests.push(normalized);
  });

  return nextInterests;
};

const hasInterest = (interests: string[], interestName: string): boolean => {
  const target = normalizeInterest(interestName).toLowerCase();
  return interests.some((interest) => normalizeInterest(interest).toLowerCase() === target);
};

export default function OtherInfoOneEditor({
  initialData,
  onSave,
  onCancel,
}: OtherInfoOneEditorProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() =>
    deduplicateInterests(initialData.interests),
  );
  const [newInterestName, setNewInterestName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const canCreateInterest = normalizeInterest(newInterestName).length > 0;

  const toggleInterest = (interestName: string) => {
    const normalizedInterest = normalizeInterest(interestName);
    if (!normalizedInterest) {
      return;
    }

    setSelectedInterests((prevInterests) => {
      if (hasInterest(prevInterests, normalizedInterest)) {
        return prevInterests.filter(
          (interest) => normalizeInterest(interest).toLowerCase() !== normalizedInterest.toLowerCase(),
        );
      }

      return [...prevInterests, normalizedInterest];
    });
    setIsDirty(true);
  };

  const handleCreateInterest = () => {
    const normalizedInterest = normalizeInterest(newInterestName);
    if (!normalizedInterest) {
      return;
    }

    setSelectedInterests((prevInterests) => {
      if (hasInterest(prevInterests, normalizedInterest)) {
        return prevInterests;
      }

      return [...prevInterests, normalizedInterest];
    });

    setNewInterestName("");
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave({ interests: deduplicateInterests(selectedInterests) });
    setIsDirty(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[26px] font-bold leading-tight text-slate-800">Chọn sở thích cá nhân của bạn</h3>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một hoặc nhiều sở thích để thêm vào hồ sơ của bạn
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

      <div className="space-y-4 p-3">
        <div>
          <h4 className="text-[26px] font-bold leading-tight text-slate-800">Gợi ý cho bạn</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.map((interestName) => {
              const selected = hasInterest(selectedInterests, interestName);

              return (
                <button
                  key={interestName}
                  type="button"
                  onClick={() => toggleInterest(interestName)}
                  className={cn(
                    "h-9 rounded-xl border px-4 text-sm font-semibold transition-colors",
                    selected
                      ? "border-[#4A79E8] bg-[#4A79E8] text-white"
                      : "border-[#d6dbe6] bg-[#f4f6fb] text-slate-600 hover:bg-[#ebeff8]",
                  )}
                >
                  {interestName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-[#f1f4f9] p-3">
          <h5 className="text-[26px] font-bold leading-tight text-slate-700">Không tìm thấy sở thích của bạn ?</h5>
          <label className="mt-2 block text-sm font-semibold text-slate-500">Sở thích mới</label>
          <input
            value={newInterestName}
            onChange={(event) => setNewInterestName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateInterest();
              }
            }}
            placeholder="Ví dụ: bóng đá"
            className="mt-1 h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setNewInterestName("")}
              className="h-9 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCreateInterest}
              disabled={!canCreateInterest}
              className="h-9 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-3">
        <p className="text-sm font-semibold text-slate-500">{selectedInterests.length} sở thích đã chọn</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 min-w-24 rounded-xl bg-[#e6eaf1] px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedInterests.length === 0 || !isDirty}
            className="h-9 min-w-32 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Thêm sở thích
          </button>
        </div>
      </div>
    </div>
  );
}
