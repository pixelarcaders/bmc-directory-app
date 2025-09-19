import React from 'react';
import { Check } from 'lucide-react';
import { ResizableBottomSheet } from './ResizableBottomSheet';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedCertifications: string[];
  onCertificationChange: (certifications: string[]) => void;
  categories: string[];
  certifications: string[];
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onCategoryChange,
  selectedCertifications,
  onCertificationChange,
  categories,
  certifications
}) => {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleCertificationToggle = (certification: string) => {
    if (selectedCertifications.includes(certification)) {
      onCertificationChange(selectedCertifications.filter(c => c !== certification));
    } else {
      onCertificationChange([...selectedCertifications, certification]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    onCertificationChange([]);
  };

  const activeFilterCount = selectedCategories.length + selectedCertifications.length;

  const stickyButton = (
    <button
      onClick={onClose}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold transition-colors"
    >
      Apply Filters
      {activeFilterCount > 0 && ` (${activeFilterCount})`}
    </button>
  );

  return (
    <ResizableBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      stickyButton={stickyButton}
    >
      <div className="space-y-6">
        {/* Filter Status */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
            </p>
            <button
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 min-h-[44px] ${
                    isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <span className={`font-medium text-sm ${
                    isSelected 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-gray-700 dark:text-slate-300'
                  }`}>
                    {category}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h3>
          <div className="space-y-3 pb-6">
            {certifications.map((certification) => {
              const isSelected = selectedCertifications.includes(certification);
              return (
                <button
                  key={certification}
                  onClick={() => handleCertificationToggle(certification)}
                  className={`flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 min-h-[44px] ${
                    isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                  }`}
                >
                  <span className={`font-medium ${
                    isSelected 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-gray-700 dark:text-slate-300'
                  }`}>
                    {certification}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ResizableBottomSheet>
  );
};