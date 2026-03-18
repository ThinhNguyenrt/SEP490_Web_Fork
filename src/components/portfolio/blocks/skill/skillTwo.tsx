import React from 'react';
import ThunderIcon from '../../../../assets/myWeb/thunder 1.png';

type SkillGroupData = {
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
};

interface SkillTwoProps {
  data: unknown;
}

const toStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0,
  );
};

const renderSkillTag = (label: string, index: number) => (
  <span
    key={`${label}-${index}`}
    className="px-4 py-2 bg-slate-50 text-slate-800 rounded-full text-base font-medium border border-slate-200"
  >
    {label}
  </span>
);

const SkillTwo: React.FC<SkillTwoProps> = ({ data }) => {
  const groupData: SkillGroupData =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as SkillGroupData)
      : {};

  const languages = toStringList(groupData.languages);
  const frameworks = toStringList(groupData.frameworks);
  const tools = toStringList(groupData.tools);
  const hasSkills = languages.length > 0 || frameworks.length > 0 || tools.length > 0;

  return (
    <div className="skill-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={ThunderIcon} alt="Kỹ năng" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Kỹ năng nền tảng</h3>
      </div>

      {hasSkills ? (
        <div className="space-y-6">
          <section>
            <h4 className="text-lg font-semibold text-slate-500 mb-3">Ngôn ngữ</h4>
            <div className="flex flex-wrap gap-3">
              {languages.length > 0 ? (
                languages.map((skill, index) => renderSkillTag(skill, index))
              ) : (
                <span className="text-slate-400 text-sm">Chưa cập nhật</span>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-500 mb-3">Framework & Libs</h4>
            <div className="flex flex-wrap gap-3">
              {frameworks.length > 0 ? (
                frameworks.map((skill, index) => renderSkillTag(skill, index))
              ) : (
                <span className="text-slate-400 text-sm">Chưa cập nhật</span>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-500 mb-3">Công cụ</h4>
            <div className="flex flex-wrap gap-3">
              {tools.length > 0 ? (
                tools.map((skill, index) => renderSkillTag(skill, index))
              ) : (
                <span className="text-slate-400 text-sm">Chưa cập nhật</span>
              )}
            </div>
          </section>
        </div>
      ) : (
        <p className="text-gray-500">No skills added yet</p>
      )}
    </div>
  );
};

export default SkillTwo;