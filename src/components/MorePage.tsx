import React from 'react';
import { ArrowRight, Users, Info, Mail, Globe, Shield, FileText, UserPlus } from 'lucide-react';

interface MorePageProps {
  onNavigate: (page: 'about' | 'contact' | 'privacy' | 'terms' | 'advisory') => void;
}

export const MorePage: React.FC<MorePageProps> = ({ onNavigate }) => {
  const menuItems = [
    {
      id: 'about' as const,
      title: 'About Us',
      description: 'Our mission and founding members',
      icon: Info,
      action: () => onNavigate('about')
    },
    {
      id: 'contact' as const,
      title: 'Contact',
      description: 'Get in touch with BMC',
      icon: Mail,
      action: () => onNavigate('contact')
    },
    {
      id: 'advisory' as const,
      title: 'Advisory Board',
      description: 'Meet our leadership team',
      icon: Users,
      action: () => onNavigate('advisory')
    },
    {
      id: 'membership',
      title: 'Membership',
      description: 'Join the chamber community',
      icon: UserPlus,
      action: () => window.open('https://rcblackminoritycc.org/membership-account/membership-checkout/?level=6', '_blank', 'noopener,noreferrer')
    },
    {
      id: 'website',
      title: 'Official Website',
      description: 'Visit rcblackminoritycc.org',
      icon: Globe,
      action: () => window.open('https://rcblackminoritycc.org', '_blank', 'noopener,noreferrer')
    },
  ];

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
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
                <h1 className="text-2xl sm:text-3xl font-bold">More</h1>
                <p className="text-red-400 text-sm">Additional Resources</p>
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              Learn more about BMC and access additional resources
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 pb-24">

        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md active:scale-98 transition-all duration-200 text-left min-h-[44px] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl mr-4 flex-shrink-0">
                    <item.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 ml-3" />
              </div>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-center">
              BMC Directory
            </h3>
            <p className="text-slate-500 dark:text-slate-500 text-xs text-center">
              © 2025 Richmond County Black & Minority Chamber of Commerce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};