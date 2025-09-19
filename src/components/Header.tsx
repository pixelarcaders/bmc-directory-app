import React from 'react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/70 shadow-lg border-b border-red-600/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/image_black_bg.png" 
              alt="BMC Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-white">
                Member Directory
              </h1>
              <p className="text-sm text-red-400">
                Richmond County BMC
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}