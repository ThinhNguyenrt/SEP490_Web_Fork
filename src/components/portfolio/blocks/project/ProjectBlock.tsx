import React from 'react';
import ProjectOne from './projectOne';
import ProjectTwo from './projectTwo';
import ProjectThree from './projectThree';
import { ProjectItem } from '@/services/portfolio.api';

interface ProjectBlockProps {
  data: ProjectItem[];
  variant: string;
}

const ProjectBlock: React.FC<ProjectBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'PROJECTONE':
      return <ProjectOne data={data} />;
    case 'PROJECTTWO':
      return <ProjectTwo data={data} />;
    case 'PROJECTTHREE':
      return <ProjectThree data={data} />;
    default:
      return <ProjectOne data={data} />;
  }
};

export default ProjectBlock;
