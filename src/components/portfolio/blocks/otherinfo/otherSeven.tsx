import React from 'react';
import { Eye } from 'lucide-react';
import OpenFolderIcon from '../../../../assets/myWeb/open-folder 1.png';

type DocumentItem = {
  name?: string;
  detail?: string;
};

interface OtherSevenProps {
  data: unknown;
}

const normalizeDocuments = (data: unknown): DocumentItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return {};
      }

      const record = item as Record<string, unknown>;
      return {
        name: typeof record.name === 'string' ? record.name.trim() : undefined,
        detail:
          typeof record.detail === 'string' ? record.detail.trim() : undefined,
      };
    })
    .filter((item) => Boolean(item.name));
};

const OtherSeven: React.FC<OtherSevenProps> = ({ data }) => {
  const documents = normalizeDocuments(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={OpenFolderIcon} alt="Tài liệu bổ sung" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Tài liệu bổ sung</h3>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((document, index) => {
            const label = document.name || 'Tài liệu';

            if (document.detail) {
              return (
                <a
                  key={`${label}-${index}`}
                  href={document.detail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 px-5 rounded-2xl border-2 border-blue-500 flex items-center justify-between text-gray-900 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-lg font-bold leading-none truncate pr-4">{label}</span>
                  <Eye size={28} className="text-blue-500 shrink-0" />
                </a>
              );
            }

            return (
              <div
                key={`${label}-${index}`}
                className="h-14 px-5 rounded-2xl border-2 border-blue-500 flex items-center justify-between text-gray-900"
              >
                <span className="text-lg font-bold leading-none truncate pr-4">{label}</span>
                <Eye size={28} className="text-blue-500 shrink-0" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật tài liệu bổ sung</div>
      )}
    </div>
  );
};

export default OtherSeven;