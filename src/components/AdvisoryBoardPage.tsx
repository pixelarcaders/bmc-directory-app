import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { advisoryBoardMembers } from '../data/advisoryBoard';

interface AdvisoryBoardPageProps {
  onBack: () => void;
}

export const AdvisoryBoardPage: React.FC<AdvisoryBoardPageProps> = ({ onBack }) => {
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
            Advisory Board
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
            Advisory Board
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Meet the distinguished leaders guiding BMC's mission
          </p>
        </div>

        {/* Board Members */}
        <div className="space-y-4">
          {advisoryBoardMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-medium text-base mb-2">
                    {member.title}
                  </p>
                  {member.business && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {member.business}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <img 
                      src="/assets/image_transparent_bg.png" 
                      alt="BMC Logo" 
                      className="w-4 h-4 mr-1 object-contain"
                    />
                    BOARD MEMBER
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};