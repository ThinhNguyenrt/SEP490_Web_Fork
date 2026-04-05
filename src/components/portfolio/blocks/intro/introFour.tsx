import React from 'react';
import { resolveImageUrl } from '@/services/portfolio.api';

interface IntroFourProps {
  data: {
    fullName?: string;
    name?: string;
    title?: string;
    avatar?: string;
    school?: string;
    department?: string;
    studyField?: string;
    description?: string;
  };
}

const IntroFour: React.FC<IntroFourProps> = ({ data }) => {
  const { fullName, name, title, studyField, avatar, school, department, description } = data;
  const displayName = fullName || name || 'Your Name';
  const subtitle = title || studyField;

  return (
    <div className="intro-block bg-white px-6 py-10 border-b border-gray-200 last:border-b-0 text-center">
      {avatar && (
        <div className="mb-6 flex justify-center">
          <img
            src={resolveImageUrl(avatar)}
            alt={displayName}
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 mb-2">{displayName}</h1>

      {school ? (
        <div className="mb-4">
          <p className="text-lg font-semibold text-blue-500">{school}</p>
          {(department || subtitle) && (
            <p className="text-lg font-semibold text-slate-500 mt-1">{department || subtitle}</p>
          )}
        </div>
      ) : (
        subtitle && <p className="text-lg font-semibold text-slate-500 mb-4">{subtitle}</p>
      )}

      {description && (
        <p className="text-base leading-relaxed text-slate-700 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default IntroFour;
