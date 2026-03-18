import React from 'react';
import EducationOne from './educationOne';
import EducationTwo from './educationTwo';
import EducationThree from './educationThree';

interface EducationBlockProps {
  data: unknown;
  variant: string;
}

const EducationBlock: React.FC<EducationBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'EDUCATIONONE':
      return <EducationOne data={Array.isArray(data) ? data : []} />;
    case 'EDUCATIONTWO':
      return <EducationTwo data={data} />;
    case 'EDUCATIONTHREE':
      return <EducationThree data={data} />;
    default:
      return <EducationOne data={Array.isArray(data) ? data : []} />;
  }
};

export default EducationBlock;
