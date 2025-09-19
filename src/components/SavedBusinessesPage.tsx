import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Heart } from 'lucide-react';
import { Business } from '../types';
import { BusinessCard } from './BusinessCard';
import { BusinessDetailPage } from './BusinessDetailPage';

interface SavedBusinessesPageProps {
  onBack: () => void;
}

export const SavedBusinessesPage: React.FC<SavedBusinessesPageProps> = ({ onBack }) => {
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Load saved businesses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedBusinesses');
    if (saved) {
      try {
        setSavedBusinesses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved businesses:', error);
      }
    }
  }, []);

  const handleRemoveFromSaved = (businessId: string) => {
    const updatedSaved = savedBusinesses.filter(b => b.id !== businessId);
    setSavedBusinesses(updatedSaved);
    localStorage.setItem('savedBusinesses', JSON.stringify(updatedSaved));
  };

  const handleBusinessClick = (business: Business) => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    setSavedScrollPosition(currentScrollY);
    console.log('💾 Saved scroll position (Saved page):', currentScrollY);
    setSelectedBusiness(business);
    setShowBusinessDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowBusinessDetail(false);
    setSelectedBusiness(null);
    
    // Restore scroll position with smooth animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          window.scrollTo({
            top: savedScrollPosition,
            behavior: 'instant'
          });
          console.log('🔄 Restored scroll position (Saved page):', savedScrollPosition);
        } catch (error) {
          window.scrollTo(0, savedScrollPosition);
          console.log('🔄 Restored scroll position (Saved page, fallback):', savedScrollPosition);
        }
      });
    });
  };

  // Show business detail page if business is selected
  if (showBusinessDetail && selectedBusiness) {
    return (
      <BusinessDetailPage
        business={selectedBusiness}
        onBack={handleBackFromDetail}
      />
    );
  }

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
            Saved Businesses
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Bookmark className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Saved Businesses
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {savedBusinesses.length} businesses saved
          </p>
        </div>

        {/* Saved Businesses List */}
        {savedBusinesses.length > 0 ? (
          <div className="space-y-3">
            {savedBusinesses.map((business, index) => (
              <BusinessCard
                key={business.id || index}
                name={business.name}
                description={business.description}
                owner={business.owner}
                contact={business.contact}
                isMember={business.isMember}
                isBoardMember={business.isBoardMember}
                address={business.address}
                socialMedia={business.socialMedia}
                is_featured={business.is_featured}
                isSaved={true}
                onSaveToggle={() => handleRemoveFromSaved(business.id!)}
                onClick={() => handleBusinessClick(business)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No saved businesses yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start exploring the directory and save businesses you're interested in.
            </p>
            <button
              onClick={onBack}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};