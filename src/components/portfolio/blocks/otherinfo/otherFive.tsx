import React from 'react';
import ResearchPaperIcon from '../../../../assets/myWeb/research-paper 1.png';

interface OtherFiveProps {
  data: unknown;
}

const normalizeTopics = (data: unknown): string[] => {
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
        if (typeof record.name === 'string') {
          return record.name.trim();
        }
      }

      return '';
    })
    .filter((topic) => topic.length > 0);
};

const OtherFive: React.FC<OtherFiveProps> = ({ data }) => {
  const topics = normalizeTopics(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={ResearchPaperIcon} alt="Lĩnh vực nghiên cứu" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Lĩnh vực nghiên cứu</h3>
      </div>

      {topics.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {topics.map((topic, index) => (
            <span
              key={`${topic}-${index}`}
              className="px-4 py-2 rounded-full border border-slate-300 bg-slate-50 text-base font-medium text-gray-900"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Chưa cập nhật lĩnh vực nghiên cứu</p>
      )}
    </div>
  );
};

export default OtherFive;