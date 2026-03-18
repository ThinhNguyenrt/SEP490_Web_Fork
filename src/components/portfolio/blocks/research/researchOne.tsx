import React from 'react';
import { ArrowRight } from 'lucide-react';
import FlaskIcon from '../../../../assets/myWeb/flask 1.png';

type ResearchPublication = {
  name?: string;
  time?: string;
  description?: string;
  link?: string;
};

interface ResearchOneProps {
  data: unknown;
}

const normalizePublications = (data: unknown): ResearchPublication[] => {
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
      time:
        typeof record.time === 'string' || typeof record.time === 'number'
          ? String(record.time)
          : undefined,
      description:
        typeof record.description === 'string' ? record.description.trim() : undefined,
      link: typeof record.link === 'string' ? record.link.trim() : undefined,
    };
  });
};

const ResearchOne: React.FC<ResearchOneProps> = ({ data }) => {
  const publications = normalizePublications(data);

  return (
    <div className="research-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={FlaskIcon} alt="Công bố khoa học" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 ">
          Công bố khoa học
        </h3>
      </div>

      {publications.length > 0 ? (
        <div className="space-y-3">
          {publications.map((publication, index) => (
            <article
              key={`${publication.name || 'publication'}-${index}`}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              <h4 className="text-md font-bold text-gray-900 leading-snug">
                {publication.name || 'Công bố khoa học'}
              </h4>

              {publication.time && (
                <p className="mt-1 text-md font-bold text-blue-500">{publication.time}</p>
              )}

              {publication.description && (
                <p className="mt-2 text-sm font-semibold text-slate-500 leading-relaxed">
                  {publication.description}
                </p>
              )}

              <div className="mt-3 border-t border-slate-300 pt-3 flex justify-end">
                {publication.link && (
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <span>Xem công bố</span>
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật công bố khoa học</div>
      )}
    </div>
  );
};

export default ResearchOne;