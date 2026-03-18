import React from 'react';
import FlexibilityIcon from '../../../../assets/myWeb/flexibility 1.png';

interface OtherTwoProps {
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
          return detail;
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

const OtherTwo: React.FC<OtherTwoProps> = ({ data }) => {
  const detail = extractDetail(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={FlexibilityIcon} alt="Mục tiêu nghề nghiệp" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Mục tiêu nghề nghiệp</h3>
      </div>

      {detail ? (
        <div className="rounded-2xl border border-slate-300 px-4 py-5">
          <p className="text-base leading-relaxed text-slate-900">{detail}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-300 px-4 py-5">
          <p className="text-sm text-slate-500">Chưa cập nhật mục tiêu nghề nghiệp</p>
        </div>
      )}
    </div>
  );
};

export default OtherTwo;