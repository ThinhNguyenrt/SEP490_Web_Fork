import React from 'react';
import SkillOne from './skillOne';
import SkillTwo from './skillTwo';
import SkillThree from './skillThree';

interface SkillBlockProps {
  data: unknown;
  variant: string;
}

const SkillBlock: React.FC<SkillBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'SKILLONE':
      return <SkillOne data={Array.isArray(data) ? data : []} />;
    case 'SKILLTWO':
      return <SkillTwo data={data} />;
    case 'SKILLTHREE':
      return <SkillThree data={data} />;
    default:
      return <SkillOne data={Array.isArray(data) ? data : []} />;
  }
};

export default SkillBlock;
