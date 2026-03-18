import React from 'react';
import SchoolIcon from '../../../../assets/myWeb/school 1.png';

type EducationAchievement = {
  time?: string;
  gpa?: number | string;
  qualified?: string;
  description?: string;
};

interface EducationThreeProps {
  data: unknown;
}

const normalizeAchievements = (data: unknown): EducationAchievement[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const record = item as Record<string, unknown>;
    return {
      time: typeof record.time === 'string' ? record.time : undefined,
      gpa:
        typeof record.gpa === 'number' || typeof record.gpa === 'string'
          ? record.gpa
          : undefined,
      qualified: typeof record.qualified === 'string' ? record.qualified : undefined,
      description:
        typeof record.description === 'string' ? record.description : undefined,
    };
  });
};

const formatGpa = (gpa: number | string | undefined): string => {
  if (typeof gpa === 'number' && Number.isFinite(gpa)) {
    return `${gpa.toFixed(1)}/4.0`;
  }

  if (typeof gpa === 'string' && gpa.trim()) {
    const value = gpa.trim();
    return value.includes('/') ? value : `${value}/4.0`;
  }

  return '';
};

const EducationThree: React.FC<EducationThreeProps> = ({ data }) => {
  const achievements = normalizeAchievements(data);

  return (
    <div className="education-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={SchoolIcon} alt="Thành tích học tập" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Thành tích học tập</h3>
      </div>

      {achievements.length > 0 ? (
        <div className="relative pl-10">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-300"></div>

          <div className="space-y-10">
            {achievements.map((achievement, index) => {
              const gpaText = formatGpa(achievement.gpa);
              const resultLine = [
                gpaText ? `GPA ${gpaText}` : '',
                achievement.qualified || '',
              ]
                .filter(Boolean)
                .join(' - ');

              return (
                <div key={`${achievement.time || 'achievement'}-${index}`} className="relative">
                  <span className="absolute -left-10 top-1.5 w-4 h-4 bg-blue-500 rounded-full"></span>

                  {achievement.time && (
                    <h4 className="text-md font-bold text-blue-500">{achievement.time}</h4>
                  )}

                  {resultLine && (
                    <p className="text-md font-semibold text-gray-900 mt-1">{resultLine}</p>
                  )}

                  {achievement.description && (
                    <p className="text-base text-gray-900 mt-3 leading-relaxed">
                      {achievement.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật thành tích học tập</div>
      )}
    </div>
  );
};

export default EducationThree;