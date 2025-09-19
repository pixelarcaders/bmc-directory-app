import React, { useEffect, useState } from 'react';

interface ParallaxHeroProps {
  children: React.ReactNode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Background Pattern with Parallax */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-600/20"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          ></div>
          <div 
            className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-red-500/5 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-red-600/5 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.4}px)`,
            }}
          ></div>
        </div>
        
        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};