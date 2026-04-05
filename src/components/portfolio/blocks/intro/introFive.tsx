import React from 'react';
import { resolveImageUrl } from '@/services/portfolio.api';

interface IntroFiveProps {
  data: {
    fullName?: string;
    name?: string;
    avatar?: string;
    studyField?: string;
    title?: string;
    experience?: number | string;
    department?: string;
    school?: string;
  };
}

const IntroFive: React.FC<IntroFiveProps> = ({ data }) => {
  const {
    fullName,
    name,
    avatar,
    studyField,
    title,
    experience,
    department,
    school,
  } = data;

  console.log("📍 [IntroFive component] Received data:", data);
  console.log("📍 [IntroFive component] fullName:", fullName, "name:", name);

  const displayName = fullName || name || 'Your Name';
  const specialization = studyField || title;
  const experienceLabel =
    typeof experience === 'number' || typeof experience === 'string'
      ? `${experience} năm kinh nghiệm`
      : '';
  const workplace = [department, school].filter(Boolean).join(' - ');
  
  console.log("📍 [IntroFive component] displayName:", displayName);

  return (
    <div className="intro-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start gap-4">
        {avatar && (
          <img
            src={resolveImageUrl(avatar)}
            alt={displayName}
            className="w-[6.2rem] h-[7.8rem] rounded-xl object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{displayName}</h1>

          {(specialization || experienceLabel) && (
            <div className="mt-2 flex items-center gap-4 flex-wrap">
              {specialization && (
                <span className="text-md font-bold text-blue-500">{specialization}</span>
              )}
              {experienceLabel && (
                <span className="text-md font-semibold text-gray-900">{experienceLabel}</span>
              )}
            </div>
          )}

          {workplace && (
            <p className="mt-2 text-md font-semibold text-slate-700 leading-snug">{workplace}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroFive;