import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { resolveImageUrl } from '@/services/portfolio.api';
import RankBadge from '../../RankBadge';

interface IntroOneProps {
  data: { fullName?: string; name?: string; title?: string; studyField?: string; description?: string; avatar?: string; email?: string; phone?: string };
  rank?: number;
}

/**
 * IntroOne - Giới thiệu cơ bản
 * Hiển thị thông tin cá nhân cơ bản của người dùng
 */
const IntroOne: React.FC<IntroOneProps> = ({ data, rank }) => {
  const { fullName, name,  studyField, description, avatar, email, phone } = data;
  
  // Debug logging
  console.log("📱 [IntroOne] Rendering with rank:", rank);
  
  // Use fullName first, then fall back to name, then 'Your Name'
  const displayName = fullName || name || 'Your Name';
  // Use title first, then fall back to studyField
  const displayTitle = studyField;
  
  // Resolve avatar URL (handles HTTP URLs, reference IDs, and data URLs)
  const avatarUrl = avatar ? resolveImageUrl(avatar) : undefined;

  return (
    <div className="intro-block bg-white px-6 py-8 text-center border-b border-gray-200 last:border-b-0">
      {/* Avatar */}
      {avatarUrl && (
        <div className="mb-6 flex justify-center">
          <RankBadge rank={rank}>
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
              onError={(e) => {
                console.warn("❌ Failed to load avatar image");
                e.currentTarget.style.display = "none";
              }}
            />
          </RankBadge>
        </div>
      )}

      {/* Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>

      {/* Title */}
      {displayTitle && <p className="text-lg text-blue-600 font-semibold mb-4">{displayTitle}</p>}

      {/* Description */}
      {description && (
        <p className="text-gray-700 text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}

      {/* Contact Info */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Mail size={16} />
            {email}
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Phone size={16} />
            {phone}
          </a>
        )}
      </div>
    </div>
  );
};

export default IntroOne;
