import React from 'react';
import BlockRenderer from './BlockRenderer';
import { PortfolioBlock } from '@/services/portfolio.api';

interface PortfolioRendererProps {
  blocks: PortfolioBlock[];
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ blocks }) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-x-hidden">
      <div className="space-y-0">
        {sortedBlocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};

export default PortfolioRenderer;
