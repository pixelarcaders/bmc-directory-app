import React from 'react';
import { ArrowLeft, Mail, Globe } from 'lucide-react';
import { foundingMembers } from '../data/foundingMembers';

interface AboutUsPageProps {
  onBack: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack }) => {
  const handleContactClick = (email?: string, website?: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    } else if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            About Us
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/assets/image_transparent_bg.png" 
              alt="BMC Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            About BMC
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Meet our founding members who established BMC's vision and mission
          </p>
        </div>

        {/* Founding Members */}
        <div className="space-y-6">
          {foundingMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
            >
              {/* Member Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-medium text-base mb-2">
                    {member.title}
                  </p>
                  {member.business && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {member.business}
                    </p>
                  )}
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-3">
                    {member.email && (
                      <button
                        onClick={() => handleContactClick(member.email)}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {member.email}
                      </button>
                    )}
                    {member.website && (
                      <button
                        onClick={() => handleContactClick(undefined, member.website)}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        {member.website}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <img 
                      src="/assets/image_transparent_bg.png" 
                      alt="BMC Logo" 
                      className="w-4 h-4 mr-1 object-contain"
                    />
                    FOUNDING MEMBER
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {member.bio}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};