import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm animate-pulse transition-all duration-500 ease-in-out">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2 sm:gap-0">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2 transition-all duration-300"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 transition-all duration-300"></div>
        </div>
        <div className="flex-shrink-0">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-24 transition-all duration-300"></div>
        </div>
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full transition-all duration-300"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6 transition-all duration-300"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6 transition-all duration-300"></div>
      </div>
      
      {/* Owner skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-3 transition-all duration-300"></div>
      
      {/* Contact skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 transition-all duration-300"></div>
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700 rounded transition-all duration-300"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700 rounded transition-all duration-300"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700 rounded transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSkeletonGrid: React.FC = () => {
  return (
    <div className="space-y-3 transition-all duration-300 ease-in-out">
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingSkeleton key={index} />
      ))}
    </div>
  );
};