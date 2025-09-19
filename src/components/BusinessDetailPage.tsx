import React from 'react';
import { ArrowLeft, ExternalLink, Phone, Mail, MapPin, Star, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Business } from '../types';

interface BusinessDetailPageProps {
  business: Business;
  onBack: () => void;
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({ business, onBack }) => {
  const handleContactClick = (type: 'website' | 'phone' | 'email', value: string) => {
    switch (type) {
      case 'website':
        if (value && value !== 'N/A') {
          const url = value.startsWith('http') ? value : `https://${value}`;
          window.open(url, '_blank', 'noopener noreferrer');
        }
        break;
      case 'phone':
        if (value) {
          window.location.href = `tel:${value}`;
        }
        break;
      case 'email':
        if (value) {
          window.location.href = `mailto:${value}`;
        }
        break;
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
    <div className="fixed inset-0 bg-stone-50 dark:bg-slate-900 z-50 overflow-y-auto">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-stone-200 dark:border-slate-700 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {business.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {/* Business Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {business.name}
              </h2>
              {business.owner && (
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-3">
                  {business.owner}
                </p>
              )}
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
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-3 py-1 rounded-full">
                  {business.category}
                </span>
              </div>
            </div>
            {business.is_featured && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
            {business.description}
          </p>
        </div>

        {/* Contact Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
          <div className="space-y-3">
            {business.contact && business.contact !== 'N/A' && (
              <button
                onClick={() => handleContactClick('website', business.contact)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
              >
                <div className="flex items-center">
                  <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-slate-900 dark:text-white font-medium">Visit Website</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
            )}
            
            {business.contact_phone && (
              <button
                onClick={() => handleContactClick('phone', business.contact_phone!)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
              >
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-slate-900 dark:text-white font-medium">Call Business</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
            )}
            
            {business.contact_email && (
              <button
                onClick={() => handleContactClick('email', business.contact_email!)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-slate-900 dark:text-white font-medium">Send Email</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* Location */}
        {business.address && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Location</h3>
            <button
              onClick={handleLocationClick}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors min-h-[44px]"
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-red-600 mr-3" />
                <div className="text-left">
                  <p className="text-slate-900 dark:text-white font-medium">Get Directions</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{business.address}</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
          </div>
        )}

        {/* Social Media */}
        {business.socialMedia && Object.values(business.socialMedia).some(url => url) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Social Media</h3>
            <div className="grid grid-cols-3 gap-3">
              {business.socialMedia.facebook && (
                <a 
                  href={business.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors min-h-[44px]"
                >
                  <Facebook className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Facebook</span>
                </a>
              )}
              {business.socialMedia.instagram && (
                <a 
                  href={business.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors min-h-[44px]"
                >
                  <Instagram className="w-6 h-6 text-pink-600 mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Instagram</span>
                </a>
              )}
              {business.socialMedia.linkedin && (
                <a 
                  href={business.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors min-h-[44px]"
                >
                  <Linkedin className="w-6 h-6 text-blue-700 mb-1" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};