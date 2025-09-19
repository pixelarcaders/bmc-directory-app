import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  attendees?: number;
  link: string;
  isExternal?: boolean;
}

interface EventDetailPageProps {
  event: Event;
  onBack: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onBack }) => {
  const handleRegister = () => {
    if (event.isExternal && event.link.startsWith('http')) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
    } else {
      // For internal events, show beta message
      alert('Event registration will be available in the full version launching Fall 2025.');
    }
  };

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
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            Event Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {/* Event Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {event.title}
          </h2>
          
          {/* Event Meta Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <Calendar className="w-5 h-5 mr-3" />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Clock className="w-5 h-5 mr-3" />
              <span>{event.time}</span>
            </div>
            {event.location && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* External Event Badge */}
          {event.isExternal && (
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
              <ExternalLink className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                External Event - Registration on Eventbrite
              </span>
            </div>
          )}
        </div>

        {/* Event Description */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            About This Event
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Beta Notice for Internal Events */}
        {!event.isExternal && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Beta Version Notice</h4>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
              This event is part of our beta version. Full event management and registration will be available in the complete version launching Fall 2025.
            </p>
          </div>
        )}

        {/* Register Button */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <button
            onClick={handleRegister}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            {event.isExternal ? 'Register on Eventbrite' : 'Register for Event'}
          </button>
          <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-3">
            {event.isExternal 
              ? 'You will be redirected to Eventbrite to complete registration'
              : 'Registration will be available in the full version'
            }
          </p>
        </div>
      </div>
    </div>
  );
};