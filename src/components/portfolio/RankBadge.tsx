import React from 'react';

interface RankBadgeProps {
  rank?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * RankBadge - Hiển thị badge xếp hạng cho avatar trong portfolio
 * Áp dụng gradient border và rank badge khi rank từ 1-10
 */
const RankBadge: React.FC<RankBadgeProps> = ({ rank, children, className = '' }) => {
  // Check if rank is valid (1-10)
  const isValidRank = typeof rank === 'number' && rank >= 1 && rank <= 10;

  // Debug logging
  if (rank !== undefined) {
    console.log("🏆 [RankBadge] Rank:", rank, "Valid:", isValidRank);
  }

  if (!isValidRank) {
    return <>{children}</>;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Gradient Border Wrapper */}
      <div
        className="p-1 rounded-full"
        style={{
          backgroundImage: 'linear-gradient(135deg, #FF7A00 0%, #FFD700 50%, #FF2D2D 100%)',
          boxShadow: '0 0 20px rgba(255, 122, 0, 0.6)',
        }}
      >
        {children}
      </div>

      {/* Rank Badge Circle */}
      <div
        className="absolute -bottom-1 -right-1 flex items-center justify-center"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          backgroundColor: '#FF2D2D',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <span
          className="font-black text-white text-sm"
          style={{ fontSize: '0.875rem' }}
        >
          #{rank}
        </span>
      </div>
    </div>
  );
};

export default RankBadge;
