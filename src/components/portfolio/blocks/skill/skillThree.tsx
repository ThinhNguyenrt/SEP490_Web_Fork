import React from 'react';
import ThunderIcon from '../../../../assets/myWeb/thunder 1.png';

type ClinicalSkillItem = {
  name?: string;
  description?: string;
};

interface SkillThreeProps {
  data: unknown;
}

const normalizeSkills = (data: unknown): ClinicalSkillItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const record = item as Record<string, unknown>;
    return {
      name: typeof record.name === 'string' ? record.name.trim() : undefined,
      description:
        typeof record.description === 'string' ? record.description.trim() : undefined,
    };
  });
};

const splitLines = (description?: string): string[] => {
  if (!description) {
    return [];
  }

  return description
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const SkillThree: React.FC<SkillThreeProps> = ({ data }) => {
  const skills = normalizeSkills(data);

  return (
    <div className="skill-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={ThunderIcon} alt="Kỹ năng lâm sàng" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Kỹ năng lâm sàng</h3>
      </div>

      {skills.length > 0 ? (
        <div className="space-y-3">
          {skills.map((skill, index) => {
            const details = splitLines(skill.description);

            return (
              <article
                key={`${skill.name || 'skill'}-${index}`}
                className="rounded-2xl border border-slate-400 px-4 py-3"
              >
                {skill.name && (
                  <h4 className="text-lg font-bold text-blue-500">{skill.name}</h4>
                )}

                {details.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {details.map((detail, detailIndex) => (
                      <p key={`${detail}-${detailIndex}`} className="text-base font-semibold text-gray-900">
                        {detail}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật kỹ năng lâm sàng</div>
      )}
    </div>
  );
};

export default SkillThree;