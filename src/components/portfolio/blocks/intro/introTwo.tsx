import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { resolveImageUrl } from '@/services/portfolio.api';
import RankBadge from '../../RankBadge';

interface IntroTwoProps {
  data: { 
    fullName?: string; 
    name?: string; 
    position?: string;
    title?: string; 
    studyField?: string; 
    description?: string; 
    avatar?: string; 
    email?: string; 
    phoneNumber?: string;
    phone?: string;
    yearOfStudy?: string;
    school?: string;
  };
  rank?: number;
}

/**
 * IntroTwo - Giới thiệu với thiết kế sidebar
 * Hiển thị thông tin cá nhân với avatar ở sidebar bên trái
 */
const IntroTwo: React.FC<IntroTwoProps> = ({ data, rank }) => {
  const { fullName, name, position, title, studyField, description, avatar, email, phoneNumber, phone } = data;
  
  // Use fullName first, then fall back to name, then 'Your Name'
  const displayName = fullName || name || 'Your Name';
  // Use position first, then title, then studyField
  const displayTitle = position || title || studyField;
  
  // Resolve avatar URL (handles HTTP URLs, reference IDs, and data URLs)
  const avatarUrl = avatar ? resolveImageUrl(avatar) : undefined;

  return (
    <div className="intro-block flex bg-white border-b border-gray-200 last:border-b-0 mt-10">
      {/* Left Sidebar - Avatar */}
      <div className="ml-8 rounded-md border-gray-300">
        {avatarUrl && (
          <RankBadge rank={rank}>
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-40 h-48 object-cover rounded-md"
              onError={(e) => {
                console.warn("❌ Failed to load avatar image");
                e.currentTarget.style.display = "none";
              }}
            />
          </RankBadge>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        {/* Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{displayName}</h1>

        {/* Title */}
        {displayTitle && (
          <p className="text-xl text-blue-500 font-semibold mb-4">{displayTitle}</p>
        )}

        {/* Description - Multiple lines */}
        {description && (
          <div className="text-gray-700 text-sm mb-6 space-y-1">
            {description.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center gap-8 text-sm text-gray-600">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Mail size={18} />
              <span>{email}</span>
            </a>
          )}
          {(phoneNumber || phone) && (
            <a href={`tel:${phoneNumber || phone}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Phone size={18} />
              <span>{phoneNumber || phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroTwo;
