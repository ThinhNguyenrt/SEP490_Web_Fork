import React from 'react';
import IntroOne from './introOne';
import IntroTwo from './introTwo';
import IntroFour from './introFour';
import IntroThree from './introThree';
import IntroFive from './introFive';

interface IntroBlockProps {
  data: { 
    fullName?: string; 
    title?: string; 
    description?: string; 
    avatar?: string; 
    avatarKey?: string;
    email?: string; 
    phone?: string;
    [key: string]: any;
  };
  variant: string;
  rank?: number;
}

const IntroBlock: React.FC<IntroBlockProps> = ({ data, variant, rank }) => {
  // Normalize data: support both 'avatar' and 'avatarKey' fields
  const normalizedData = {
    ...data,
    // If backend returns 'avatarKey', map it to 'avatar' for components
    avatar: data.avatar || data.avatarKey || undefined,
  };

  switch (variant.toUpperCase()) {
    case 'INTROONE':
      return <IntroOne data={normalizedData} rank={rank} />;
    case 'INTROTWO':
      return <IntroTwo data={normalizedData} rank={rank} />;
    case 'INTROTHREE':
      return <IntroThree data={normalizedData} rank={rank} />;
    case 'INTROFOUR':
      return <IntroFour data={normalizedData} rank={rank} />;
    case 'INTROFIVE':
      return <IntroFive data={normalizedData} rank={rank} />;
    default:
      return <IntroOne data={normalizedData} rank={rank} />;
  }
};

export default IntroBlock;
