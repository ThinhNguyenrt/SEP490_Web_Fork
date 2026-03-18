import React from 'react';
import SchoolIcon from '../../../../assets/myWeb/school 1.png';

type TrainingItem = {
  time?: string;
  department?: string;
  schoolName?: string;
  description?: string;
};

interface EducationTwoProps {
  data: unknown;
}

const normalizeTrainings = (data: unknown): TrainingItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const record = item as Record<string, unknown>;
    return {
      time:
        typeof record.time === 'string' || typeof record.time === 'number'
          ? String(record.time)
          : undefined,
      department:
        typeof record.department === 'string' ? record.department.trim() : undefined,
      schoolName:
        typeof record.schoolName === 'string' ? record.schoolName.trim() : undefined,
      description:
        typeof record.description === 'string' ? record.description.trim() : undefined,
    };
  });
};

const EducationTwo: React.FC<EducationTwoProps> = ({ data }) => {
  const trainings = normalizeTrainings(data);

  return (
    <div className="education-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={SchoolIcon} alt="Quá trình đào tạo" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Quá trình đào tạo</h3>
      </div>

      {trainings.length > 0 ? (
        <div className="relative pl-10">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-300"></div>

          <div className="space-y-8">
            {trainings.map((training, index) => (
              <article key={`${training.time || 'training'}-${index}`} className="relative">
                <span className="absolute -left-10 top-1.5 w-4 h-4 rounded-full bg-blue-500"></span>

                {training.time && (
                  <p className="text-xl font-bold text-blue-500">{training.time}</p>
                )}

                {training.department && (
                  <p className="mt-1 text-lg font-bold text-gray-900">{training.department}</p>
                )}

                {training.schoolName && (
                  <p className="mt-1 text-base font-semibold text-slate-700">{training.schoolName}</p>
                )}

                {training.description && (
                  <p className="mt-2 text-base text-slate-700 leading-relaxed">{training.description}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật quá trình đào tạo</div>
      )}
    </div>
  );
};

export default EducationTwo;