import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  normalizeSkillTwoDraft,
  type SkillTwoCategory,
  type SkillTwoDraft,
} from "@/components/pages/portfolio/editor/skillTwoDraft";

type SkillTwoEditorProps = {
  initialData: SkillTwoDraft;
  onSave: (nextDraft: SkillTwoDraft) => void;
  onCancel: () => void;
};

type SkillCategoryConfig = {
  key: SkillTwoCategory;
  label: string;
  placeholder: string;
  suggestions: string[];
};

const CATEGORIES: SkillCategoryConfig[] = [
  {
    key: "languages",
    label: "Ngôn ngữ",
    placeholder: "Ví dụ: Python",
    suggestions: ["C#", "Java", "React", "C++", "Ruby"],
  },
  {
    key: "frameworks",
    label: "Framework & Libs",
    placeholder: "Ví dụ: Tailwind CSS",
    suggestions: ["React JS", "Tailwind CSS"],
  },
  {
    key: "tools",
    label: "Công cụ",
    placeholder: "Ví dụ: Github",
    suggestions: ["Github", "Figma", "VS code", "Postman"],
  },
];

const normalizeSkillName = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const hasSkill = (skills: string[], skillName: string): boolean => {
  const target = normalizeSkillName(skillName).toLowerCase();
  return skills.some((skill) => normalizeSkillName(skill).toLowerCase() === target);
};

export default function SkillTwoEditor({ initialData, onSave, onCancel }: SkillTwoEditorProps) {
  const [draft, setDraft] = useState<SkillTwoDraft>(() =>
    normalizeSkillTwoDraft(initialData ?? { languages: [], frameworks: [], tools: [] }),
  );
  const [activeCategory, setActiveCategory] = useState<SkillTwoCategory>("languages");
  const [newSkillName, setNewSkillName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const currentCategory = useMemo(
    () => CATEGORIES.find((item) => item.key === activeCategory) ?? CATEGORIES[0],
    [activeCategory],
  );

  const selectedSkills = draft[activeCategory];
  const canCreateSkill = normalizeSkillName(newSkillName).length > 0;
  const totalSelected = draft.languages.length + draft.frameworks.length + draft.tools.length;

  const updateCategorySkills = (
    category: SkillTwoCategory,
    updater: (currentSkills: string[]) => string[],
  ) => {
    setDraft((prevDraft) => {
      const nextDraft = {
        ...prevDraft,
        [category]: updater(prevDraft[category]),
      };

      return normalizeSkillTwoDraft(nextDraft);
    });
    setIsDirty(true);
  };

  const toggleSkill = (category: SkillTwoCategory, skillName: string) => {
    const normalized = normalizeSkillName(skillName);
    if (!normalized) {
      return;
    }

    updateCategorySkills(category, (currentSkills) => {
      if (hasSkill(currentSkills, normalized)) {
        return currentSkills.filter(
          (skill) => normalizeSkillName(skill).toLowerCase() !== normalized.toLowerCase(),
        );
      }

      return [...currentSkills, normalized];
    });
  };

  const handleCreateSkill = () => {
    const normalized = normalizeSkillName(newSkillName);
    if (!normalized) {
      return;
    }

    updateCategorySkills(activeCategory, (currentSkills) => {
      if (hasSkill(currentSkills, normalized)) {
        return currentSkills;
      }

      return [...currentSkills, normalized];
    });

    setNewSkillName("");
  };

  const handleSave = () => {
    onSave(normalizeSkillTwoDraft(draft));
    setIsDirty(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[25px] font-bold leading-tight text-slate-800">
            Chọn {currentCategory.label.toLowerCase()}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một hoặc nhiều {currentCategory.label.toLowerCase()} để thêm vào hồ sơ của bạn
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

      <div className="border-b border-[#d7dfeb] px-3 py-2.5">
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => {
            const isActive = category.key === activeCategory;
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => {
                  setActiveCategory(category.key);
                  setNewSkillName("");
                }}
                className={cn(
                  "h-9 rounded-xl border px-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-[#4A79E8] bg-[#4A79E8] text-white"
                    : "border-[#d6dbe6] bg-[#f4f6fb] text-slate-600 hover:bg-[#ebeff8]",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 p-3">
        <div>
          <h4 className="text-[25px] font-bold leading-tight text-slate-800">Gợi ý cho bạn</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentCategory.suggestions.map((skillName) => {
              const selected = hasSkill(selectedSkills, skillName);

              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => toggleSkill(activeCategory, skillName)}
                  className={cn(
                    "h-9 rounded-xl border px-3 text-sm font-semibold transition-colors",
                    selected
                      ? "border-[#4A79E8] bg-[#4A79E8] text-white"
                      : "border-[#d6dbe6] bg-[#f4f6fb] text-slate-600 hover:bg-[#ebeff8]",
                  )}
                >
                  {skillName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-[#f1f4f9] p-3">
          <h5 className="text-lg font-bold text-slate-700">
            Không tìm thấy {currentCategory.label.toLowerCase()} của bạn ?
          </h5>
          <label className="mt-2 block text-sm font-semibold text-slate-500">
            Tên {currentCategory.label.toLowerCase()} mới
          </label>
          <input
            value={newSkillName}
            onChange={(event) => setNewSkillName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateSkill();
              }
            }}
            placeholder={currentCategory.placeholder}
            className="mt-1 h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setNewSkillName("")}
              className="h-9 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCreateSkill}
              disabled={!canCreateSkill}
              className="h-9 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-3">
        <p className="text-sm font-semibold text-slate-500">
          {selectedSkills.length} {currentCategory.label.toLowerCase()} đã chọn
        </p>
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
            disabled={totalSelected === 0 || !isDirty}
            className="h-9 min-w-24 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
