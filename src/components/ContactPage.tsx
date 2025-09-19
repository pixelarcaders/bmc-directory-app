import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@rcblackminoritycc.org',
      action: () => window.location.href = 'mailto:info@rcblackminoritycc.org'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '900 South Avenue, 3rd Fl. Suite 39, Staten Island, NY 10314',
      action: () => {
        const query = encodeURIComponent('900 South Avenue, 3rd Fl. Suite 39, Staten Island, NY 10314');
        window.open(`https://maps.apple.com/?q=${query}`, '_blank', 'noopener,noreferrer');
      }
    },
    {
      icon: Globe,
      title: 'Website',
      value: 'rcblackminoritycc.org',
      action: () => window.open('https://rcblackminoritycc.org', '_blank', 'noopener,noreferrer')
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      title: 'Facebook',
      url: 'https://www.facebook.com/rcbmcc'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      url: 'https://www.instagram.com/rcblackminoritycc/?next=%2F'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/company/richmond-county-black-minority-chamber-of-commerce/'
    }
  ];

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
            Contact Us
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
            Get in Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We'd love to hear from you
          </p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-3 mb-8">
          {contactMethods.map((method, index) => (
            <button
              key={index}
              onClick={method.action}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md active:scale-98 transition-all duration-200 text-left min-h-[44px]"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg mr-4">
                  <method.icon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                    {method.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {method.value}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Social Media */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Follow Us
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 min-h-[44px]"
              >
                <social.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 mb-2" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {social.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Office Hours
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Monday - Friday</span>
              <span className="text-slate-900 dark:text-white font-medium">9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Saturday</span>
              <span className="text-slate-900 dark:text-white font-medium">By Appointment</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Sunday</span>
              <span className="text-slate-900 dark:text-white font-medium">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};