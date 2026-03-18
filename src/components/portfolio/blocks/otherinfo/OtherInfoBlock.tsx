import React from 'react';
import OtherInfoOne from './otherInfoOne';
import OtherTwo from './otherTwo';
import OtherThree from './otherThree';
import OtherFour from './otherFour';
import OtherFive from './otherFive';
import OtherSix from './otherSix';
import OtherSeven from './otherSeven';
import OtherEight from './otherEight';

interface OtherInfoBlockProps {
  data: unknown;
  variant: string;
}

const OtherInfoBlock: React.FC<OtherInfoBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'OTHERONE':
      return <OtherInfoOne data={Array.isArray(data) ? data : []} />;
    case 'OTHERTWO':
      return <OtherTwo data={data} />;
    case 'OTHERTHREE':
      return <OtherThree data={data} />;
    case 'OTHERFOUR':
      return <OtherFour data={data} />;
    case 'OTHERFIVE':
      return <OtherFive data={data} />;
    case 'OTHERSIX':
      return <OtherSix data={data} />;
    case 'OTHERSEVEN':
      return <OtherSeven data={data} />;
    case 'OTHEREIGHT':
      return <OtherEight data={data} />;
    default:
      return <OtherInfoOne data={Array.isArray(data) ? data : []} />;
  }
};

export default OtherInfoBlock;
