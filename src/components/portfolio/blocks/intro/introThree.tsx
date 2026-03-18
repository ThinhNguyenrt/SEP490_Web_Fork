import React from 'react';
import StarInsideCircleIcon from '../../../../assets/myWeb/star-inside-circle 1.png';

interface IntroThreeProps {
  data: {
    fullName?: string;
    avatar?: string;
    school?: string;
    department?: string;
    gpa?: number | string;
  };
}

const formatGpa = (gpa: number | string | undefined): string | null => {
  if (typeof gpa === 'number' && Number.isFinite(gpa)) {
    return `${gpa.toFixed(1)}/4.0`;
  }

  if (typeof gpa === 'string' && gpa.trim()) {
    return `${gpa.trim()}/4.0`;
  }

  return null;
};

const IntroThree: React.FC<IntroThreeProps> = ({ data }) => {
  const { fullName, avatar, school, department, gpa } = data;
  const educationLine = [school, department].filter(Boolean).join(' - ');
  const gpaLabel = formatGpa(gpa);

  return (
    <div className="intro-block bg-white px-6 py-10 border-b border-gray-200 last:border-b-0 text-center">
      {avatar && (
        <div className="mb-6 flex justify-center">
          <img
            src={avatar}
            alt={fullName || 'Avatar'}
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 mb-2">{fullName || 'Your Name'}</h1>

      {educationLine && (
        <p className="text-lg font-semibold text-slate-500 mb-6">{educationLine}</p>
      )}

      {gpaLabel && (
        <div className="max-w-md mx-auto h-14 rounded-2xl bg-blue-500 flex items-center justify-center px-4 gap-3">
          <img src={StarInsideCircleIcon} alt="GPA" className="w-8 h-8" />
          <span className="text-xl font-bold text-white">GPA {gpaLabel}</span>
        </div>
      )}
    </div>
  );
};

export default IntroThree;