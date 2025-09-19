import React, { useState, useEffect, useRef } from 'react';
import { businessData } from '../data/businessData';
import { Business } from '../types';
import { SearchAndFilter } from './SearchAndFilter';
import { MobileSearchBar } from './MobileSearchBar';
import { FilterBottomSheet } from './FilterBottomSheet';
import { BusinessCard } from './BusinessCard';
import { BusinessDetailPage } from './BusinessDetailPage';
import { LoadingSkeletonGrid } from './LoadingSkeleton';
import { SpotlightSection } from './SpotlightSection';
import { EventsCarousel } from './EventsCarousel';
import { NewsletterSignup } from './NewsletterSignup';
import { useSavedBusinesses } from '../hooks/useSavedBusinesses';

const ITEMS_PER_PAGE = 20;
const SCROLL_THRESHOLD = 0.8; // Trigger at 80% scroll height
const PRELOAD_PAGES = 1; // Preload next page in background
const SCROLL_STORAGE_KEY = 'rcbmc_directory_scroll';
const SCROLL_RESTORE_TIMEOUT = 5000; // 5 second timeout for restoration

export const DirectoryPage: React.FC = () => {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [preloadingNext, setPreloadingNext] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [displayedBusinesses, setDisplayedBusinesses] = useState<Business[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [preloadedBusinesses, setPreloadedBusinesses] = useState<Business[]>([]);
  const [isRestoringScroll, setIsRestoringScroll] = useState(false);
  const [businessesLoaded, setBusinessesLoaded] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toggleSaved, isSaved } = useSavedBusinesses();

  // Load all businesses from businessData.ts
  useEffect(() => {
    console.log('🔄 Loading businesses from businessData.ts...');
    setAllBusinesses(businessData);
    setTotalCount(businessData.length);
    setBusinessesLoaded(true);
    console.log('📊 Total businesses loaded:', businessData.length);
  }, []);

  // Scroll position restoration on component mount
  useEffect(() => {
    if (!businessesLoaded) return;
    
    const savedPosition = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!savedPosition) return;
    
    const targetPosition = parseInt(savedPosition, 10);
    if (isNaN(targetPosition) || targetPosition <= 0) return;
    
    console.log('🔄 Attempting to restore scroll position:', targetPosition);
    setIsRestoringScroll(true);
    
    // Poll until content is loaded and page height is sufficient
    const pollForContent = () => {
      const currentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      const viewportHeight = window.innerHeight;
      const requiredHeight = targetPosition + (viewportHeight * 0.5);
      
      console.log('📏 Content height check:', {
        currentHeight,
        requiredHeight,
        targetPosition,
        viewportHeight
      });
      
      if (currentHeight >= requiredHeight) {
        // Content is ready, restore scroll position
        console.log('✅ Content ready, restoring scroll position');
        
        // Use multiple methods to ensure restoration works
        const restoreScroll = () => {
          try {
            // Method 1: Modern browsers with smooth scroll disabled
            window.scrollTo({
              top: targetPosition,
              behavior: 'instant'
            });
          } catch (error) {
            // Method 2: Fallback for older browsers
            window.scrollTo(0, targetPosition);
          }
          
          // Method 3: Direct DOM manipulation as backup
          document.documentElement.scrollTop = targetPosition;
          document.body.scrollTop = targetPosition;
          
          console.log('🎯 Scroll restored to position:', targetPosition);
          console.log('📍 Current scroll position:', window.pageYOffset || document.documentElement.scrollTop);
        };
        
        // Use requestAnimationFrame for smooth restoration
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            restoreScroll();
            
            // Clear restoration flag after a brief delay
            setTimeout(() => {
              setIsRestoringScroll(false);
              console.log('🔓 Scroll restoration complete, infinite scroll re-enabled');
            }, 200);
          });
        });
        
        // Clear the saved position
        sessionStorage.removeItem(SCROLL_STORAGE_KEY);
        return;
      }
      
      // Content not ready yet, continue polling
      setTimeout(pollForContent, 100);
    };
    
    // Start polling with a timeout
    const timeoutId = setTimeout(() => {
      console.log('⏰ Scroll restoration timeout, giving up');
      setIsRestoringScroll(false);
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    }, SCROLL_RESTORE_TIMEOUT);
    
    pollForContent();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [businessesLoaded]);

  // Filter all businesses based on search and filter criteria
  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = !searchTerm || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.owner && business.owner.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(business.category);

    const matchesCertification = selectedCertifications.length === 0 ||
      selectedCertifications.some(cert => {
        if (cert === 'Board Member') return business.isBoardMember;
        if (cert === 'BMC Member') return business.isMember;
        return false;
      });

    return matchesSearch && matchesCategory && matchesCertification;
  });

  // Preload next page in background
  const preloadNextPage = async (nextPage: number) => {
    if (preloadingNext || nextPage * ITEMS_PER_PAGE >= filteredBusinesses.length) {
      console.log('🚫 Preload blocked:', { preloadingNext, nextPage, totalFiltered: filteredBusinesses.length });
      return;
    }
    
    setPreloadingNext(true);
    console.log('🔄 Preloading page:', nextPage);
    
    // Use requestIdleCallback for better performance
    const preloadData = () => {
      const startIndex = nextPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const nextBusinesses = filteredBusinesses.slice(startIndex, endIndex);
      
      if (nextBusinesses.length > 0) {
        setPreloadedBusinesses(nextBusinesses);
        console.log('📋 Preloaded businesses:', nextBusinesses.length);
      }
      
      setPreloadingNext(false);
    };
    
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadData);
    } else {
      setTimeout(preloadData, 50);
    }
  };

  // Reset displayed businesses when filters change
  useEffect(() => {
    console.log('🔄 Filters changed, resetting displayed businesses');
    console.log('📊 Filtered businesses count:', filteredBusinesses.length);
    
    const initialBusinesses = filteredBusinesses.slice(0, ITEMS_PER_PAGE);
    setDisplayedBusinesses(initialBusinesses);
    setCurrentPage(0);
    setHasMore(filteredBusinesses.length > ITEMS_PER_PAGE);
    setPreloadedBusinesses([]);
    setLoadingMore(false);
    
    console.log('📋 Initial displayed:', initialBusinesses.length);
    console.log('🔄 Has more:', filteredBusinesses.length > ITEMS_PER_PAGE);
    
    // Preload next page if there are more businesses
    if (filteredBusinesses.length > ITEMS_PER_PAGE) {
      setTimeout(() => preloadNextPage(1), 200);
    }
  }, [searchTerm, selectedCategories, selectedCertifications, allBusinesses]);

  // Load more businesses for infinite scroll
  const loadMoreBusinesses = async () => {
    if (loadingMore || !hasMore || preloadingNext) {
      console.log('🚫 Load more blocked:', { loadingMore, hasMore, preloadingNext });
      return;
    }
    
    console.log('🔄 Loading more businesses...');
    console.log('📊 Current displayed:', displayedBusinesses.length);
    console.log('📊 Total filtered:', filteredBusinesses.length);
    console.log('📊 Current page:', currentPage);
    
    setLoadingMore(true);
    
    try {
      // Use preloaded data if available, otherwise load fresh
      let nextBusinesses: Business[];
      
      const nextPage = currentPage + 1;
      const startIndex = nextPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      if (preloadedBusinesses.length > 0) {
        // Use preloaded data for instant loading
        nextBusinesses = preloadedBusinesses;
        setPreloadedBusinesses([]);
        console.log('⚡ Using preloaded businesses:', nextBusinesses.length);
      } else {
        // Load fresh data
        nextBusinesses = filteredBusinesses.slice(startIndex, endIndex);
        console.log('📊 Loading fresh page:', nextPage, 'range:', startIndex, '-', endIndex);
      }
      
      console.log('📋 Next businesses to add:', nextBusinesses.length);
      
      if (nextBusinesses.length > 0) {
        // Append new businesses to existing list with immediate state update
        setDisplayedBusinesses(prev => {
          const newList = [...prev, ...nextBusinesses];
          console.log('📋 Updated displayed businesses:', newList.length);
          return newList;
        });
        setCurrentPage(nextPage);
        
        // Check if we have more businesses to load
        const newTotal = displayedBusinesses.length + nextBusinesses.length;
        const stillHasMore = newTotal < filteredBusinesses.length;
        
        console.log('🔄 New total:', newTotal);
        console.log('🔄 Filtered total:', filteredBusinesses.length);
        console.log('🔄 Still has more:', stillHasMore);
        
        setHasMore(stillHasMore);
        
        // Preload next page if there are more businesses
        if (stillHasMore) {
          // Start preloading immediately for smoother experience
          setTimeout(() => preloadNextPage(nextPage + 1), 100);
        }
      } else {
        console.log('🏁 No more businesses to load');
        setHasMore(false);
      }
    } catch (error) {
      console.error('❌ Error loading more businesses:', error);
      // Reset loading state on error
      setHasMore(true);
    } finally {
      setLoadingMore(false);
    }
  };

  // Improved infinite scroll handler with 80% threshold
  useEffect(() => {
    // Don't trigger infinite scroll while restoring scroll position
    if (isRestoringScroll) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    let timeoutId: NodeJS.Timeout;
    let isScrolling = false;
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Use requestAnimationFrame for smooth performance
      timeoutId = setTimeout(() => {
        isScrolling = true;
        
        const scrollTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;
        const scrollHeight = scrollContainer.scrollHeight;
        
        // Calculate scroll position more accurately
        const scrolled = scrollTop + containerHeight;
        const scrollPercentage = (scrolled / scrollHeight) * 100;
        
        // Trigger at 80% to ensure smooth loading before user reaches bottom
        const triggerThreshold = 80;
        
        // More aggressive loading condition to prevent divider issues
        const shouldLoad = scrollPercentage >= triggerThreshold && 
                          hasMore && 
                          !loadingMore && 
                          !preloadingNext &&
                          displayedBusinesses.length > 0;
        
        if (shouldLoad) {
          console.log('🔄 Scroll triggered load more at', Math.round(scrollPercentage) + '%');
          console.log('📊 Scroll metrics:', {
            scrollTop,
            containerHeight,
            scrollHeight,
            scrolled,
            scrollPercentage,
            triggerThreshold,
            displayedCount: displayedBusinesses.length,
            filteredCount: filteredBusinesses.length
          });
          loadMoreBusinesses();
        }
        
        isScrolling = false;
      }, 50); // Faster response time
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      isScrolling = false;
    };
  }, [hasMore, loadingMore, preloadingNext, displayedBusinesses.length, filteredBusinesses.length, currentPage, isRestoringScroll, scrollContainerRef]);

  // Enhanced scroll position management
  const handleBusinessClick = (business: Business) => {
    const scrollContainer = scrollContainerRef.current;
    const currentScrollY = scrollContainer ? scrollContainer.scrollTop : 0;
    setScrollPosition(currentScrollY);
    console.log('💾 Saved scroll position:', currentScrollY);
    setSelectedBusiness(business);
    setShowBusinessDetail(true);
  };

  // Enhanced scroll position restoration
  const handleBackFromDetail = () => {
    setShowBusinessDetail(false);
    setSelectedBusiness(null);
    setIsRestoringScroll(true);
    
    // Wait for component to re-render before restoring scroll
    requestAnimationFrame(() => {
      const scrollContainer = scrollContainerRef.current;
      console.log('🔄 Restoring scroll position after detail view:', {
        targetPosition: scrollPosition,
        scrollHeight: scrollContainer?.scrollHeight || 0,
        containerHeight: scrollContainer?.clientHeight || 0,
      });
      
      requestAnimationFrame(() => {
        const targetPosition = scrollPosition;
        const scrollContainer = scrollContainerRef.current;
        
        if (scrollContainer) {
          // Smooth scroll restoration with fallback
          try {
            scrollContainer.scrollTo({
              top: targetPosition,
              behavior: 'instant' // Instant for immediate restoration
            });
            console.log('🔄 Restored scroll position:', targetPosition);
          } catch (error) {
            // Fallback for older browsers
            scrollContainer.scrollTop = targetPosition;
            console.log('🔄 Restored scroll position (fallback):', targetPosition);
          }
        }
        
        // Clear restoration flag after a brief delay
        setTimeout(() => {
          setIsRestoringScroll(false);
        }, 100);
      });
    });
  };

  // Debug logging
  useEffect(() => {
    console.log('📊 State Update:');
    console.log('  - All businesses:', allBusinesses.length);
    console.log('  - Filtered businesses:', filteredBusinesses.length);
    console.log('  - Displayed businesses:', displayedBusinesses.length);
    console.log('  - Has more:', hasMore);
    console.log('  - Loading more:', loadingMore);
    console.log('  - Preloading next:', preloadingNext);
    console.log('  - Preloaded count:', preloadedBusinesses.length);
    console.log('  - Current page:', currentPage);
    console.log('  - Expected next load at:', Math.round((displayedBusinesses.length / filteredBusinesses.length) * 100) + '%');
  }, [allBusinesses.length, filteredBusinesses.length, displayedBusinesses.length, hasMore, loadingMore, currentPage]);

  // Get unique categories and certifications from all businesses
  const categories = Array.from(new Set(allBusinesses.map(b => b.category))).sort();
  const certifications = Array.from(new Set([
    'Board Member',
    'BMC Member',
    'Woman-Owned',
    'Minority-Owned'
  ]));

  // Get featured business for spotlight
  const featuredBusiness = allBusinesses.find(b => b.is_featured) || allBusinesses.find(b => b.isBoardMember);

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
    <div ref={scrollContainerRef} className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header - Scrolls away */}
      <div className="bg-black text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4">
            {/* Logo and Title */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/assets/image_black_bg.png" 
                alt="BMC Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Business Directory</h1>
                <p className="text-red-400 text-sm">Richmond County BMC</p>
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              Discover and connect with local Black & minority-owned businesses
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter - Sticky */}
      <div className="sticky top-0 z-50">
        <MobileSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          selectedCertifications={selectedCertifications}
          onCertificationChange={setSelectedCertifications}
          categories={categories}
          certifications={certifications}
          onFilterToggle={() => setShowFilterSheet(true)}
          showFilters={showFilterSheet}
          activeFilterCount={selectedCategories.length + selectedCertifications.length}
        />
        <FilterBottomSheet
          isOpen={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          selectedCertifications={selectedCertifications}
          onCertificationChange={setSelectedCertifications}
          categories={categories}
          certifications={certifications}
        />
      </div>

      {/* Content */}
      <div>
        {/* Featured Business Spotlight */}
        {featuredBusiness && (
          <SpotlightSection featuredBusiness={featuredBusiness} />
        )}

        {/* Business Directory */}
        <div id="business-directory" className="px-4 py-6 pb-24">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Business Directory
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {loading ? 'Loading...' : (
                <>
                  {filteredBusinesses.length} businesses found
                  {displayedBusinesses.length < filteredBusinesses.length && (
                    <span> (showing {displayedBusinesses.length})</span>
                  )}
                  {preloadingNext && (
                    <span className="text-green-600 dark:text-green-400 ml-2">• Preloading...</span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Business List */}
          {loading ? (
            <LoadingSkeletonGrid />
          ) : displayedBusinesses.length > 0 ? (
            <>
              <div className="space-y-3">
                {displayedBusinesses.map((business, index) => (
                  <BusinessCard
                    key={business.id || `${business.name}-${index}`}
                    name={business.name}
                    description={business.description}
                    owner={business.owner}
                    contact={business.contact}
                    isMember={business.isMember}
                    isBoardMember={business.isBoardMember}
                    address={business.address}
                    socialMedia={business.socialMedia}
                    is_featured={business.is_featured}
                    isSaved={isSaved(business)}
                    onSaveToggle={() => toggleSaved(business)}
                    onClick={() => handleBusinessClick(business)}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>
              
              {/* Load More Indicator */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    <span className="text-sm font-medium">
                      Loading more businesses...
                    </span>
                  </div>
                </div>
              )}
              
              {/* Preloading Indicator (subtle) */}
              {preloadingNext && !loadingMore && (
                <div className="flex justify-center py-1">
                  <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                    <div className="animate-pulse w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-xs">Preparing next page...</span>
                  </div>
                </div>
              )}

              {/* End of Results */}
              {!hasMore && !loadingMore && displayedBusinesses.length > 0 && displayedBusinesses.length === filteredBusinesses.length && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      ✨ You've seen all {filteredBusinesses.length} businesses
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No businesses found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your search or filter criteria'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>

    </div>
  );
};