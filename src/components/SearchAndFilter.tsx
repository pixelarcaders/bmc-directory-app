import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedCertifications: string[];
  onCertificationChange: (certifications: string[]) => void;
  categories: string[];
  certifications: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedCertifications,
  onCertificationChange,
  categories,
  certifications
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounced search implementation
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchInputValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInputValue, onSearchChange]);

  // Update local state when external searchTerm changes
  React.useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

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
    onSearchChange('');
    setSearchInputValue('');
    setIsSearchFocused(false);
  };

  const activeFilterCount = selectedCategories.length + selectedCertifications.length;

  return (
    <div className={`bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-all duration-300 ${
      isSearchFocused ? 'shadow-lg' : ''
    }`}>
      {/* Search Bar */}
      <div className={`px-4 transition-all duration-300 ${
        isSearchFocused ? 'py-4 bg-slate-50 dark:bg-slate-800' : 'py-3'
      }`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            isSearchFocused ? 'text-red-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Delay blur to allow for filter interactions
              setTimeout(() => {
                if (!showFilters && !searchInputValue.trim()) {
                  setIsSearchFocused(false);
                }
              }, 150);
            }}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none transition-all duration-200 ${
              isSearchFocused 
                ? 'border-red-500 bg-white dark:bg-slate-700 shadow-md focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-red-500 focus:border-transparent'
            }`}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all duration-200 ${
              isSearchFocused 
                ? 'hover:bg-red-50 dark:hover:bg-red-900/20' 
                : 'hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <Filter className={`w-5 h-5 transition-colors duration-200 ${
              activeFilterCount > 0 || isSearchFocused ? 'text-red-600' : 'text-gray-400'
            }`} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Search suggestions or quick actions when focused */}
        {isSearchFocused && searchInputValue.trim() && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Press Enter to search or use filters below
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {(showFilters || isSearchFocused) && (
        <div className={`border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 transition-all duration-300 ${
          showFilters || isSearchFocused ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="px-4 py-4 space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Categories</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-red-600 border-gray-300 dark:border-slate-600 rounded focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Certifications</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {certifications.map((certification) => (
                  <label
                    key={certification}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCertifications.includes(certification)}
                      onChange={() => handleCertificationToggle(certification)}
                      className="w-4 h-4 text-red-600 border-gray-300 dark:border-slate-600 rounded focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">{certification}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};