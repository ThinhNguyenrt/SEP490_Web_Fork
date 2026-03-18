import React from 'react';
import SolutionIcon from '../../../../assets/myWeb/solution 1.png';

interface OtherSixProps {
  data: unknown;
}

const extractSoftSkills = (data: unknown): string[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }

      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        if (typeof record.name === 'string' && record.name.trim()) {
          return record.name.trim();
        }

        if (typeof record.detail === 'string' && record.detail.trim()) {
          return record.detail.trim();
        }
      }

      return '';
    })
    .filter((label) => label.length > 0);
};

const OtherSix: React.FC<OtherSixProps> = ({ data }) => {
  const skills = extractSoftSkills(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={SolutionIcon} alt="Kỹ năng mềm" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Kỹ năng mềm</h3>
      </div>

      {skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="h-14 rounded-2xl border-2 border-blue-400 flex items-center justify-center px-4 text-base font-semibold text-gray-900"
            >
              {skill}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật kỹ năng mềm</div>
      )}
    </div>
  );
};

export default OtherSix;