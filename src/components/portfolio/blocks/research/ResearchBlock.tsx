import React from 'react';
import ResearchOne from './researchOne';

interface ResearchBlockProps {
  data: unknown;
  variant: string;
}

const ResearchBlock: React.FC<ResearchBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'RESEARCHONE':
      return <ResearchOne data={data} />;
    default:
      return <ResearchOne data={data} />;
  }
};

export default ResearchBlock;