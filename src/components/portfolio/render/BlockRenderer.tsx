import React from 'react';
import { PortfolioBlock } from '@/services/portfolio.api';
import IntroBlock from '../blocks/intro/IntroBlock';
import SkillBlock from '../blocks/skill/SkillBlock';
import EducationBlock from '../blocks/education/EducationBlock';
import ExperienceBlock from '../blocks/experience/ExperienceBlock';
import ProjectBlock from '../blocks/project/ProjectBlock';
import CertificationBlock from '../blocks/diploma/CertificationBlock';
import AwardBlock from '../blocks/award/AwardBlock';
import ActivityBlock from '../blocks/activity/ActivityBlock';
import OtherInfoBlock from '../blocks/otherinfo/OtherInfoBlock';
import ReferenceBlock from '../blocks/reference/ReferenceBlock';
import ResearchBlock from '../blocks/research/ResearchBlock';
import TeachingBlock from '../blocks/teaching/TeachingBlock';
import TypicalCaseBlock from '../blocks/typicalcase/TypicalCaseBlock';

interface BlockRendererProps {
  block: PortfolioBlock;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const { type, variant, data } = block;

  console.log("📦 [BlockRenderer] Rendering block - type:", type, "variant:", variant);
  console.log("📦 [BlockRenderer] Block data:", data);

  const renderBlock = () => {
    // Normalize the block type - handle various cases and formats
    const blockType = (type || '')
      .toLowerCase()
      .trim()
      .replace(/-/g, '')  // Remove hyphens
      .replace(/_/g, '');  // Remove underscores
    
    const blockVariant = (variant || '').toUpperCase().trim();

    // Debug logging
    if (!blockType) {
      console.error('BlockRenderer: Empty or null block type', { type, variant, data });
    }

    console.log("📦 [BlockRenderer] Normalized blockType:", blockType, "blockVariant:", blockVariant);

    switch (blockType) {
      case 'intro':
        return <IntroBlock data={data} variant={blockVariant} />;
      case 'skill':
        return <SkillBlock data={data} variant={blockVariant} />;
      case 'education':
        return <EducationBlock data={data} variant={blockVariant} />;
      case 'experience':
      case 'experiment':
        return <ExperienceBlock data={data} variant={blockVariant} />;
      case 'project':
        return <ProjectBlock data={data} variant={blockVariant} />;
      case 'certificate':
        return <CertificationBlock data={data} variant={blockVariant} />;
      case 'diploma':
        return <CertificationBlock data={data} variant={blockVariant} />;
      case 'award':
        return <AwardBlock data={data} variant={blockVariant} />;
      case 'activities':
      case 'activity':
        return <ActivityBlock data={data} variant={blockVariant} />;
      case 'otherinfo':
        return <OtherInfoBlock data={data} variant={blockVariant} />;
      case 'reference':
        return <ReferenceBlock data={data} variant={blockVariant} />;
      case 'research':
        return <ResearchBlock data={data} variant={blockVariant} />;
      case 'teaching':
        return <TeachingBlock data={data} variant={blockVariant} />;
      case 'typicalcase':
      case 'typical':
        return <TypicalCaseBlock data={data} variant={blockVariant} />;
      default:
        console.warn('BlockRenderer: Unknown block type', { 
          type,
          blockType, 
          variant, 
          blockVariant,
          rawType: type,
          dataLength: Array.isArray(data) ? data.length : typeof data
        });
        return (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-800 font-semibold">Unknown block type: {type}</p>
            <p className="text-red-700 text-sm mt-1">Block variant: {variant}</p>
            <p className="text-red-700 text-sm mt-1">Normalized type: {blockType}</p>
            <p className="text-red-600 text-xs mt-2">Please check your portfolio configuration.</p>
          </div>
        );
    }
  };

  return <div className="block-renderer">{renderBlock()}</div>;
};

export default BlockRenderer;
