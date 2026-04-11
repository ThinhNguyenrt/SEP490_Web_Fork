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
}

const IntroBlock: React.FC<IntroBlockProps> = ({ data, variant }) => {
  // Normalize data: support both 'avatar' and 'avatarKey' fields
  const normalizedData = {
    ...data,
    // If backend returns 'avatarKey', map it to 'avatar' for components
    avatar: data.avatar || data.avatarKey || undefined,
  };

  switch (variant.toUpperCase()) {
    case 'INTROONE':
      return <IntroOne data={normalizedData} />;
    case 'INTROTWO':
      return <IntroTwo data={normalizedData} />;
    case 'INTROTHREE':
      return <IntroThree data={normalizedData} />;
    case 'INTROFOUR':
      return <IntroFour data={normalizedData} />;
    case 'INTROFIVE':
      return <IntroFive data={normalizedData} />;
    default:
      return <IntroOne data={normalizedData} />;
  }
};

export default IntroBlock;
