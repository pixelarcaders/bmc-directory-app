import React from 'react';
import { ChevronRight, Star, Bookmark } from 'lucide-react';

// Helper function to highlight matching text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-0.5 rounded">
        {part}
      </mark>
    ) : part
  );
};

interface BusinessCardProps {
  name: string;
  description: string;
  owner?: string;
  contact: string;
  isMember: boolean;
  isBoardMember?: boolean;
  address?: string;
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    other?: string;
  };
  is_featured?: boolean;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  onClick?: () => void;
  searchTerm?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  name,
  description,
  owner,
  contact,
  isMember,
  isBoardMember,
  address,
  socialMedia,
  is_featured,
  isSaved = false,
  onSaveToggle,
  onClick,
  searchTerm = ''
}) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle();
    }
  };

  return (
    <div 
      className="w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all duration-200 min-h-[44px] relative cursor-pointer"
      onClick={onClick}
    >
      {/* Save Button */}
      {onSaveToggle && (
        <button
          onClick={handleSaveClick}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
          aria-label={isSaved ? 'Remove from saved' : 'Save business'}
        >
          <Bookmark 
            className={`w-5 h-5 transition-colors ${
              isSaved 
                ? 'fill-red-600 text-red-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`} 
          />
        </button>
      )}

      <div className="flex items-start justify-between mb-3 pr-8">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-[17px] leading-tight mb-2">
            {highlightText(name, searchTerm)}
          </h3>
          {owner && (
            <p className="text-slate-600 dark:text-slate-400 text-[15px] mb-2">
              {highlightText(owner, searchTerm)}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {is_featured && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-medium">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </div>
            )}
            {isBoardMember && (
              <div className="flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2 py-1 rounded-lg">
                <img 
                  src="/assets/image_transparent_bg.png" 
                  alt="BMC Logo" 
                  className="w-4 h-4 mr-1 object-contain"
                />
                BOARD MEMBER
              </div>
            )}
            {isMember && !isBoardMember && (
              <div className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-2 py-1 rounded-lg">
                <img 
                  src="/assets/image_transparent_bg.png" 
                  alt="BMC Logo" 
                  className="w-4 h-4 mr-1 object-contain"
                />
                BMC MEMBER
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed mb-4 pr-8">
        {highlightText(description, searchTerm)}
      </div>
      
      {/* Quick Info */}
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 pr-8">
        <span>{address || 'Richmond County'}</span>
        <ChevronRight className="w-5 h-5 text-slate-400 absolute top-1/2 right-4 transform -translate-y-1/2" />
      </div>
    </div>
  );
};