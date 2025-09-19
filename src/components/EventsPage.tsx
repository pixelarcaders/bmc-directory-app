import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { EventDetailPage } from './EventDetailPage';

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

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "The Launch Pad Accelerator",
    date: "September 12, 2025",
    time: "11:00 AM - 2:00 PM",
    description: "Connect with our local entrepreneurs at our roundtable to talk challenges and brainstorm solutions.",
    location: "BMC Conference Center",
    attendees: 45,
    link: "https://www.eventbrite.com/e/the-launchpad-business-round-table-discussion-tickets-1484974802609",
    isExternal: true
  },
  {
    id: 2,
    title: "BMC Monthly Networking Mixer",
    date: "February 28, 2026",
    time: "6:00 PM - 8:00 PM",
    description: "Connect with local business owners and discover new partnership opportunities in a relaxed, professional setting.",
    location: "Staten Island Community Center",
    attendees: 32,
    link: "/events"
  },
  {
    id: 3,
    title: "Small Business Workshop Series",
    date: "March 8, 2026",
    time: "2:00 PM - 4:00 PM",
    description: "Learn essential business skills including marketing strategies, financial planning, and digital presence optimization.",
    location: "BMC Training Room",
    attendees: 28,
    link: "/events"
  },
  {
    id: 4,
    title: "Minority Business Certification Workshop",
    date: "April 12, 2026",
    time: "10:00 AM - 2:00 PM",
    description: "Learn about certification processes and benefits for minority-owned businesses in government contracting.",
    location: "Richmond County Office Building",
    attendees: 15,
    link: "/events"
  }
];

interface EventsPageProps {
  onEventSelect?: (event: Event) => void;
  onBack?: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onEventSelect, onBack }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  const handleEventClick = (event: Event) => {
    if (event.isExternal && event.link.startsWith('http')) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
    } else {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      setSavedScrollPosition(currentScrollY);
      console.log('💾 Saved scroll position (Events page):', currentScrollY);
      setSelectedEvent(event);
      setShowEventDetail(true);
      if (onEventSelect) onEventSelect(event);
    }
  };

  const handleBackFromDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
    
    // Restore scroll position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          window.scrollTo({
            top: savedScrollPosition,
            behavior: 'instant'
          });
          console.log('🔄 Restored scroll position (Events page):', savedScrollPosition);
        } catch (error) {
          window.scrollTo(0, savedScrollPosition);
          console.log('🔄 Restored scroll position (Events page, fallback):', savedScrollPosition);
        }
      });
    });
  };

  // Show event detail page if event is selected
  if (showEventDetail && selectedEvent) {
    return (
      <EventDetailPage
        event={selectedEvent}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header - Scrolls away */}
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
                <h1 className="text-2xl sm:text-3xl font-bold">Upcoming Events</h1>
                <p className="text-red-400 text-sm">Richmond County BMC</p>
              </div>
            </div>
            
            {/* Beta Notice */}
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2 inline-block">
              <p className="text-red-200 text-sm font-medium">
                Full event management launching Sept 15, 2025.
              </p>
            </div>
            
            {/* Subtitle */}
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              Join us for networking and community building events
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div>
        <div className="px-4 py-6 pb-24">
          {/* Header */}
          <div className="mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              {upcomingEvents.length} events scheduled
            </p>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md active:scale-98 transition-all duration-200 text-left min-h-[44px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    {/* Date and Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Location and Attendees */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      {event.location && (
                        <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Event Details</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4 flex items-center">
                    {event.isExternal && (
                      <ExternalLink className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {event.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};