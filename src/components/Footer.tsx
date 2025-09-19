import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Page } from '../hooks/useNavigation';

interface FooterProps {
  onPageChange?: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/rcbmcc', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/rcblackminoritycc/?next=%2F', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/richmond-county-black-minority-chamber-of-commerce/', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'info@rcblackminoritycc.org', href: 'mailto:info@rcblackminoritycc.org' },
    { icon: MapPin, text: '900 South Avenue, 3rd Fl. Suite 39, Staten Island, NY 10314', href: '#' },
  ];

  const handleQuickLinkClick = (linkType: string) => {
    switch (linkType) {
      case 'directory':
        if (onPageChange) onPageChange('directory');
        const directorySection = document.getElementById('business-directory');
        if (directorySection) {
          directorySection.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'advisory':
        if (onPageChange) onPageChange('advisory');
        break;
      case 'about':
        if (onPageChange) onPageChange('about');
        break;
      case 'membership':
        window.open('https://rcblackminoritycc.org/membership-account/membership-checkout/?level=6', '_blank', 'noopener,noreferrer');
        break;
      case 'events':
        if (onPageChange) onPageChange('directory');
        setTimeout(() => {
          const eventsSection = document.querySelector('[data-section="events"]');
          if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        break;
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/image_transparent_bg.png" 
                alt="BMC Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">BMC</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The Richmond County Black & Minority Chamber of Commerce empowers businesses 
              and fosters economic growth in our community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('directory')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Business Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('advisory')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Advisory Board
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('about')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('membership')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Membership
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('events')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Events
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                 target="_blank"
                 rel="noopener noreferrer"
                  aria-label={social.label}
                 className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-sm text-slate-400 text-center sm:text-right">
             <p>Copyright &copy; 2025 The Richmond County Black and Minority Chamber of Commerce. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};