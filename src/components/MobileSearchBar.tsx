import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Clock, TrendingUp } from 'lucide-react';

interface MobileSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedCertifications: string[];
  onCertificationChange: (certifications: string[]) => void;
  categories: string[];
  certifications: string[];
  onFilterToggle: () => void;
  showFilters: boolean;
  activeFilterCount: number;
}

interface RecentSearch {
  id: string;
  term: string;
  timestamp: number;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedCertifications,
  onCertificationChange,
  categories,
  certifications,
  onFilterToggle,
  showFilters,
  activeFilterCount
}) => {
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const searches = JSON.parse(saved);
        setRecentSearches(searches.slice(0, 5)); // Keep only 5 most recent
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchInputValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInputValue, onSearchChange]);

  // Update local state when external searchTerm changes
  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim() || term.length < 2) return;

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      term: term.trim(),
      timestamp: Date.now()
    };

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(s => s.term.toLowerCase() !== term.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSearchSubmit = (term: string) => {
    setSearchInputValue(term);
    onSearchChange(term);
    saveRecentSearch(term);
    setShowSuggestions(false);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setShowSuggestions(value.length === 0 && recentSearches.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(searchInputValue);
    }
  };

  const clearSearch = () => {
    setSearchInputValue('');
    onSearchChange('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const removeRecentSearch = (id: string) => {
    const updatedSearches = recentSearches.filter(s => s.id !== id);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Popular search suggestions based on categories
  const popularSearches = [
    'Construction',
    'IT Services',
    'Healthcare',
    'Board Members',
    'BMC Members'
  ];

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800">
      {/* Main Search Container */}
      <div className="px-4 py-3">
        <div className="relative">
          {/* Search Input */}
          <div className={`relative bg-white dark:bg-slate-800 rounded-full border-2 transition-all duration-200 ${
            isSearchFocused 
              ? 'border-red-500 shadow-lg shadow-red-500/10' 
              : 'border-gray-200 dark:border-slate-700 shadow-md'
          }`}>
            <div className="flex items-center">
              {/* Search Icon */}
              <div className="pl-4 pr-2">
                <Search className={`w-5 h-5 transition-colors duration-200 ${
                  isSearchFocused ? 'text-red-500' : 'text-gray-400'
                }`} />
              </div>

              {/* Input Field */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search businesses..."
                value={searchInputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
                className="flex-1 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none text-base"
              />

              {/* Clear Button */}
              {searchInputValue && (
                <button
                  onClick={clearSearch}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors mr-1"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}

              {/* Filter Button */}
              <button
                onClick={onFilterToggle}
                className={`p-3 mr-1 rounded-full transition-all duration-200 relative ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400'
                }`}
              >
                <Filter className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (isSearchFocused || searchInputValue.length === 0) && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 max-h-80 overflow-y-auto"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && searchInputValue.length === 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Recent Searches
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <div key={search.id} className="flex items-center justify-between group">
                        <button
                          onClick={() => handleSearchSubmit(search.term)}
                          className="flex-1 text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="text-gray-700 dark:text-slate-300">{search.term}</span>
                        </button>
                        <button
                          onClick={() => removeRecentSearch(search.id)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-all"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {searchInputValue.length === 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popular Searches
                  </h3>
                  <div className="space-y-1">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchSubmit(term)}
                        className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-gray-700 dark:text-slate-300">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No suggestions message */}
              {searchInputValue.length === 0 && recentSearches.length === 0 && (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Start typing to search businesses
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Results Count */}
      {searchInputValue && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Search results will appear below
          </p>
        </div>
      )}
    </div>
  );
};