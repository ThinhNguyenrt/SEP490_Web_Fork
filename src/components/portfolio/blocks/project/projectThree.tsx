import React from 'react';
import StartupIcon from '../../../../assets/myWeb/start-up 2.png';

type TopicProject = {
  name?: string;
  publisher?: string;
  time?: string;
  description?: string;
  action?: string;
};

interface ProjectThreeProps {
  data: unknown;
}

const normalizeProjects = (data: unknown): TopicProject[] => {
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
      publisher:
        typeof record.publisher === 'string' ? record.publisher.trim() : undefined,
      time:
        typeof record.time === 'string' || typeof record.time === 'number'
          ? String(record.time)
          : undefined,
      description:
        typeof record.description === 'string' ? record.description.trim() : undefined,
      action: typeof record.action === 'string' ? record.action.trim() : undefined,
    };
  });
};

const formatSource = (publisher?: string, time?: string): string => {
  if (!publisher && !time) {
    return '';
  }

  if (!publisher) {
    return `Nguồn: ${time}`;
  }

  if (!time) {
    return `Nguồn: ${publisher}`;
  }

  return `Nguồn: ${publisher} . ${time}`;
};

const ProjectThree: React.FC<ProjectThreeProps> = ({ data }) => {
  const projects = normalizeProjects(data);

  return (
    <div className="project-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={StartupIcon} alt="Dự án và đề tài" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Dự án & đề tài</h3>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-5">
          {projects.map((project, index) => {
            const source = formatSource(project.publisher, project.time);

            return (
              <article
                key={`${project.name || 'project'}-${index}`}
                className="border-l-4 border-blue-500 pl-4"
              >
                <h4 className="text-lg font-bold text-gray-900 leading-snug">
                  {project.name || 'Dự án nghiên cứu'}
                </h4>

                {source && (
                  <p className="mt-1 text-sm font-semibold text-slate-600">{source}</p>
                )}

                {project.description && (
                  <p className="mt-2 text-sm font-semibold text-slate-500 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {project.action && (
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Trạng thái: <span className="text-blue-500">{project.action}</span>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">Chưa cập nhật dự án và đề tài</div>
      )}
    </div>
  );
};

export default ProjectThree;