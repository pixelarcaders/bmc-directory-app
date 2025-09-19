import React from 'react';
import { Home, Calendar, Plus, Bookmark, MoreHorizontal } from 'lucide-react';
import { Page } from '../hooks/useNavigation';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange
}) => {
  const navItems = [
    { id: 'directory' as Page, label: 'Directory', icon: Home },
    { id: 'events' as Page, label: 'Events', icon: Calendar },
    { id: 'add-business' as Page, label: 'Add Business', icon: Plus },
    { id: 'saved' as Page, label: 'Saved', icon: Bookmark },
    { id: 'more' as Page, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] ${
              currentPage === id
                ? 'text-[#D92E2F] bg-red-50 dark:bg-red-900/20'
                : 'text-[#6D6D72] dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${currentPage === id ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};