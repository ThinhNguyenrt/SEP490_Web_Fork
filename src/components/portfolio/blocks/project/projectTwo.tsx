import React from 'react';
import { FileText } from 'lucide-react';
import FlaskIcon from '../../../../assets/myWeb/flask 1.png';

interface ProjectTwoProps {
  data: unknown;
}

type ResearchProject = {
  name?: string;
  description?: string;
  action?: string;
  publisher?: string;
  projectLinks?: Array<{ link?: string }>;
  links?: Array<{ link?: string }>;
};

const normalizeProjects = (data: unknown): ResearchProject[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const record = item as Record<string, unknown>;
    const toLinks = (value: unknown): Array<{ link?: string }> => {
      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .map((linkItem) => {
          if (!linkItem || typeof linkItem !== 'object') {
            return {};
          }

          const linkRecord = linkItem as Record<string, unknown>;
          return {
            link: typeof linkRecord.link === 'string' ? linkRecord.link : undefined,
          };
        })
        .filter((itemLink) => Boolean(itemLink.link));
    };

    return {
      name: typeof record.name === 'string' ? record.name : undefined,
      description:
        typeof record.description === 'string' ? record.description : undefined,
      action: typeof record.action === 'string' ? record.action : undefined,
      publisher: typeof record.publisher === 'string' ? record.publisher : undefined,
      projectLinks: toLinks(record.projectLinks),
      links: toLinks(record.links),
    };
  });
};

const resolveReportLink = (project: ResearchProject): string | undefined => {
  const firstProjectLink = project.projectLinks?.find((item) => item.link)?.link;
  if (firstProjectLink) {
    return firstProjectLink;
  }

  return project.links?.find((item) => item.link)?.link;
};

const formatPublisher = (publisher?: string): string => {
  if (!publisher) {
    return '';
  }

  const lowered = publisher.toLowerCase();
  if (lowered.includes('hội nghị')) {
    return publisher;
  }

  return `Xuất bản: ${publisher}`;
};

const ProjectTwo: React.FC<ProjectTwoProps> = ({ data }) => {
  const projects = normalizeProjects(data);

  return (
    <div className="project-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={FlaskIcon} alt="Dự án nghiên cứu" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Dự án nghiên cứu</h3>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project, index) => {
            const reportLink = resolveReportLink(project);
            const publisher = formatPublisher(project.publisher);
            const isLeadAuthor = project.action?.toLowerCase().includes('chính');

            return (
              <article
                key={`${project.name || 'project'}-${index}`}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-xl font-bold text-gray-900 leading-snug">
                    {project.name || 'Dự án nghiên cứu'}
                  </h4>

                  {project.action && (
                    <span
                      className={`shrink-0 rounded-md px-3 py-1 text-sm font-semibold ${
                        isLeadAuthor
                          ? 'bg-blue-100 text-blue-500'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {project.action}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="mt-2 text-base font-semibold text-slate-500 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="mt-3 border-t border-slate-300 pt-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">{publisher}</p>

                  {reportLink && (
                    <a
                      href={reportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <FileText size={14} />
                      <span>Xem báo cáo</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật dự án nghiên cứu</div>
      )}
    </div>
  );
};

export default ProjectTwo;
