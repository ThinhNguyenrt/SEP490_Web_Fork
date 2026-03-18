import React from 'react';
import HumanBrainIcon from '../../../../assets/myWeb/human-brain 1.png';

interface OtherThreeProps {
  data: unknown;
}

const extractDetail = (data: unknown): string => {
  if (typeof data === 'string') {
    return data.trim();
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item && typeof item === 'object' && 'detail' in item) {
        const detail = (item as { detail?: unknown }).detail;
        if (typeof detail === 'string' && detail.trim()) {
          return detail.trim();
        }
      }
    }

    return '';
  }

  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === 'string') {
      return detail.trim();
    }
  }

  return '';
};

const OtherThree: React.FC<OtherThreeProps> = ({ data }) => {
  const detail = extractDetail(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={HumanBrainIcon} alt="Tầm nhìn và động lực" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Tầm nhìn & động lực</h3>
      </div>

      {detail ? (
        <p className="text-base leading-relaxed text-slate-900">{detail}</p>
      ) : (
        <p className="text-sm text-slate-500">Chưa cập nhật tầm nhìn và động lực</p>
      )}
    </div>
  );
};

export default OtherThree;