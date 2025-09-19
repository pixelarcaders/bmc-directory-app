import React from 'react';
import { X, ExternalLink, Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

interface BusinessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: {
    name: string;
    owner?: string;
    contact: string;
    description: string;
    isMember: boolean;
    isBoardMember?: boolean;
    category: string;
    address?: string;
    socialMedia?: {
      facebook?: string;
      linkedin?: string;
      instagram?: string;
      other?: string;
    };
  } | null;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  business 
}) => {
  if (!isOpen || !business) return null;

  const handleContactClick = () => {
    if (business.contact && business.contact !== 'N/A') {
      const url = business.contact.startsWith('http') ? business.contact : `https://${business.contact}`;
      window.open(url, '_blank', 'noopener noreferrer');
    }
  };

  const handleLocationClick = () => {
    if (business.address) {
      const query = encodeURIComponent(`${business.name} ${business.address}`);
      const appleMapUrl = `https://maps.apple.com/?q=${query}`;
      window.open(appleMapUrl, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {business.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {business.isBoardMember && (
                <div className="flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <img 
                    src="/assets/image_transparent_bg.png" 
                    alt="BMC Logo" 
                    className="w-4 h-4 mr-1 object-contain"
                  />
                  BOARD MEMBER
                </div>
              )}
              {business.isMember && !business.isBoardMember && (
                <div className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <img 
                    src="/assets/image_transparent_bg.png" 
                    alt="BMC Logo" 
                    className="w-4 h-4 mr-1 object-contain"
                  />
                  BMC MEMBER
                </div>
              )}
              <div className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-3 py-1 rounded-full">
                {business.category}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Owner */}
          {business.owner && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Owner</h3>
              <p className="text-slate-900 dark:text-white">{business.owner}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{business.description}</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Contact Information</h3>
            <div className="space-y-3">
              {business.contact && business.contact !== 'N/A' && (
                <button
                  onClick={handleContactClick}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Visit Website</span>
                </button>
              )}
              
              {business.address && (
                <button
                  onClick={handleLocationClick}
                  className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors group"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{business.address}</span>
                </button>
              )}
            </div>
          </div>

          {/* Social Media */}
          {business.socialMedia && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Social Media</h3>
              <div className="flex items-center space-x-4">
                {business.socialMedia.facebook && (
                  <a 
                    href={business.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-blue-600" />
                  </a>
                )}
                {business.socialMedia.instagram && (
                  <a 
                    href={business.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-pink-600" />
                  </a>
                )}
                {business.socialMedia.linkedin && (
                  <a 
                    href={business.socialMedia.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-blue-700" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Apple Maps Preview Placeholder */}
          {business.address && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Location</h3>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{business.address}</p>
                <button
                  onClick={handleLocationClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};