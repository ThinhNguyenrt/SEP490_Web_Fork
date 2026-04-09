import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  createEmptyOtherInfoSixDraft,
  normalizeOtherInfoSixDraft,
  type OtherInfoSixDraft,
} from "./otherInfoSixDraft";

type OtherInfoSixEditorProps = {
  initialData: OtherInfoSixDraft;
  onSave: (nextDraft: OtherInfoSixDraft) => void;
  onCancel: () => void;
};

const SUGGESTED_SOFT_SKILLS = [
  "Làm việc nhóm",
  "Giao tiếp",
  "Quản lý thời gian",
  "Tự nghiên cứu",
];

const normalizeSoftSkill = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const hasSoftSkill = (skills: string[], skillName: string): boolean => {
  const target = normalizeSoftSkill(skillName).toLowerCase();
  return skills.some((skill) => normalizeSoftSkill(skill).toLowerCase() === target);
};

export default function OtherInfoSixEditor({
  initialData,
  onSave,
  onCancel,
}: OtherInfoSixEditorProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    normalizeOtherInfoSixDraft(initialData ?? createEmptyOtherInfoSixDraft()).softSkills,
  );
  const [newSkillName, setNewSkillName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const canCreateSkill = normalizeSoftSkill(newSkillName).length > 0;

  const toggleSkill = (skillName: string) => {
    const normalizedSkill = normalizeSoftSkill(skillName);
    if (!normalizedSkill) {
      return;
    }

    setSelectedSkills((prevSkills) => {
      if (hasSoftSkill(prevSkills, normalizedSkill)) {
        return prevSkills.filter(
          (skill) => normalizeSoftSkill(skill).toLowerCase() !== normalizedSkill.toLowerCase(),
        );
      }

      return [...prevSkills, normalizedSkill];
    });
    setIsDirty(true);
  };

  const handleCreateSkill = () => {
    const normalizedSkill = normalizeSoftSkill(newSkillName);
    if (!normalizedSkill) {
      return;
    }

    setSelectedSkills((prevSkills) => {
      if (hasSoftSkill(prevSkills, normalizedSkill)) {
        return prevSkills;
      }

      return [...prevSkills, normalizedSkill];
    });

    setNewSkillName("");
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(normalizeOtherInfoSixDraft({ softSkills: selectedSkills }));
    setIsDirty(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[34px] font-bold leading-tight text-slate-800">Chọn kỹ năng mềm</h3>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một hoặc nhiều kỹ năng mềm để thêm vào hồ sơ của bạn
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
          <h4 className="text-[34px] font-bold leading-tight text-slate-800">Gợi ý cho bạn</h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SUGGESTED_SOFT_SKILLS.map((skillName) => {
              const selected = hasSoftSkill(selectedSkills, skillName);

              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => toggleSkill(skillName)}
                  className={cn(
                    "h-10 rounded-xl border px-3 text-sm font-semibold transition-colors",
                    selected
                      ? "border-[#4A79E8] bg-[#4A79E8] text-white"
                      : "border-[#7ca3f2] bg-white text-slate-600 hover:bg-[#f4f8ff]",
                  )}
                >
                  {skillName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-[#f1f4f9] p-3">
          <h5 className="text-[30px] font-bold leading-tight text-slate-700">
            Không tìm thấy kỹ năng mềm của bạn ?
          </h5>
          <label className="mt-2 block text-sm font-semibold text-slate-500">Tên kỹ năng mềm mới</label>
          <input
            value={newSkillName}
            onChange={(event) => setNewSkillName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateSkill();
              }
            }}
            placeholder="Ví dụ: Làm việc nhóm"
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
        <p className="text-sm font-semibold text-slate-500">{selectedSkills.length} lĩnh vực đã chọn</p>
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
            disabled={selectedSkills.length === 0 || !isDirty}
            className="h-9 min-w-32 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
