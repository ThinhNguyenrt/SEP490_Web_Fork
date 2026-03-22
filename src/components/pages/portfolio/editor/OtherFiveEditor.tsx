import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { type OtherFiveDraft } from "./otherFiveDraft";

type OtherFiveEditorProps = {
  initialData: OtherFiveDraft;
  onSave: (nextDraft: OtherFiveDraft) => void;
  onCancel: () => void;
};

export default function OtherFiveEditor({
  initialData,
  onSave,
  onCancel,
}: OtherFiveEditorProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialData.topics);
  const [customTopic, setCustomTopic] = useState("");

  useEffect(() => {
    setSelectedTopics(initialData.topics);
  }, [initialData]);

  const suggestions = [
    "Học máy y sinh",
    "Thị giác máy tính",
    "Big Data (Advanced)",
    "Tin sinh học",
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((item) => item !== topic)
        : [...prevTopics, topic],
    );
  };

  const handleSaveCustomTopic = () => {
    const normalizedTopic = customTopic.trim();
    if (!normalizedTopic) {
      return;
    }

    setSelectedTopics((prevTopics) =>
      prevTopics.includes(normalizedTopic) ? prevTopics : [...prevTopics, normalizedTopic],
    );
    setCustomTopic("");
  };

  const handleSave = () => {
    onSave({ topics: selectedTopics });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">
            Chọn lĩnh vực nghiên cứu
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một hoặc nhiều lĩnh vực để thêm vào hồ sơ của bạn
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
        <div>
          <p className="text-sm font-semibold text-slate-700">Gợi ý cho bạn</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((topic) => {
              const isSelected = selectedTopics.includes(topic);

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
                    isSelected
                      ? "border-[#4A79E8] bg-[#e8efff] text-[#2f5fd0]"
                      : "border-[#c9d2e2] bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-[#f5f8ff] p-3">
          <p className="text-[22px] font-bold leading-tight text-slate-800">Không tìm thấy lĩnh vực của bạn ?</p>
          <div className="mt-2 space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Tên lĩnh vực mới</label>
            <input
              value={customTopic}
              onChange={(event) => setCustomTopic(event.target.value)}
              placeholder="Ví dụ: Thị giác máy tính"
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveCustomTopic}
              disabled={customTopic.trim().length === 0}
              className="h-10 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <div className="flex flex-1 items-center text-sm font-semibold text-slate-500">
          {selectedTopics.length} lĩnh vực đã chọn
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 w-30 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={selectedTopics.length === 0}
          className="h-10 w-36 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
