//import React from 'react';
import { Star, ExternalLink, MapPin } from 'lucide-react';
import { Business } from '../types';

interface SpotlightSectionProps {
  featuredBusiness?: Business;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({ featuredBusiness }) => {
  if (!featuredBusiness) return null;

  const handleContactClick = () => {
    if (featuredBusiness.website_url) {
      window.open(featuredBusiness.website_url, '_blank', 'noopener noreferrer');
    }
  };

  const handleLocationClick = () => {
    if (featuredBusiness.address) {
      const query = encodeURIComponent(`${featuredBusiness.name} ${featuredBusiness.address}`);
      const appleMapUrl = `https://maps.apple.com/?q=${query}`;
      window.open(appleMapUrl, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-700 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Business Spotlight
            </h2>
          </div>
          <p className="text-red-100 text-base sm:text-lg">
            Featuring exceptional businesses in our community
          </p>
        </div>

        {/* Featured Business Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Business Logo */}
            {featuredBusiness.logo_file && featuredBusiness.logo_filename && (
              <div className="flex-shrink-0">
                <img
                  src={`data:${featuredBusiness.logo_content_type};base64,${btoa(String.fromCharCode(...featuredBusiness.logo_file))}`}
                  alt={`${featuredBusiness.name} logo`}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg bg-slate-50 dark:bg-slate-700 p-2"
                  onError={(e) => {
                    console.log('Logo failed to load:', featuredBusiness.logo_filename);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {featuredBusiness.name}
                  </h3>
                  {featuredBusiness.owner && (
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                      Owner: {featuredBusiness.owner}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      {featuredBusiness.category}
                    </span>
                    {featuredBusiness.isBoardMember && (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Board Member
                      </span>
                    )}
                    {featuredBusiness.isMember && !featuredBusiness.isBoardMember && (
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                        BMC Member
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-base sm:text-lg">
                {featuredBusiness.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {featuredBusiness.website_url && (
                  <button
                    onClick={handleContactClick}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit Website
                  </button>
                )}
                {featuredBusiness.address && (
                  <button
                    onClick={handleLocationClick}
                    className="flex items-center justify-center border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    View Location
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};