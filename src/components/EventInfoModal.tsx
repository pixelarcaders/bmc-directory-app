import React from 'react';
import { X, Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  link: string;
}

interface EventInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export const EventInfoModal: React.FC<EventInfoModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const handleRegister = () => {
    if (event.link.startsWith('http')) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
    } else {
      alert('Event registration will be available in the full version launching Fall 2025.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Event Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
            {event.title}
          </h4>
          
          {/* Event Meta */}
          <div className="space-y-2">
            <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {event.description}
          </p>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {event.link.startsWith('http') ? 'Register on Eventbrite' : 'Learn More'}
          </button>
        </div>
      </div>
    </div>
  );
};