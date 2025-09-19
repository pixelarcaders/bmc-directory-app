import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventInfoModal } from './EventInfoModal';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  link: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "The Launch Pad Accelerator",
    date: "September 12, 2025",
    time: "11:00 AM - 2:00 PM",
    description: "Connect with our local entrepreneurs at our roundtable to talk challenges and brainstorm solutions.",
    link: "https://www.eventbrite.com/e/the-launchpad-business-round-table-discussion-tickets-1484974802609?utm_experiment=test_share_listing&aff=ebdsshios&sg=dfd89ab42e52380322693dc613a42163e18888e82c227dd43af7dcdfefd0ebe3d73861c4eccd12f347225e5ad8b7ce11ebfc0692619a9e6cbb630773f521e1083fc081dc32e7d07616d7ab40"
  },
  {
    id: 2,
    title: "BMC Monthly Networking Mixer",
    date: "February 28, 2026",
    time: "6:00 PM - 8:00 PM",
    description: "Connect with local business owners and discover new partnership opportunities in a relaxed, professional setting.",
    link: "/events"
  },
  {
    id: 3,
    title: "Small Business Workshop Series",
    date: "March 8, 2026",
    time: "2:00 PM - 4:00 PM",
    description: "Learn essential business skills including marketing strategies, financial planning, and digital presence optimization.",
    link: "/events"
  },
  {
    id: 4,
    title: "Minority Business Certification Workshop",
    date: "April 12, 2026",
    time: "10:00 AM - 2:00 PM",
    description: "Learn about certification processes and benefits for minority-owned businesses in government contracting.",
    link: "/events"
  }
];

export const EventsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
    setIsAutoPlaying(false);
  };

  const handleLearnMore = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Find the current event and show modal
      const currentEvent = upcomingEvents[currentIndex];
      setSelectedEvent(currentEvent);
      setIsEventModalOpen(true);
    }
  };

  return (
    <section data-section="events" className="bg-white dark:bg-slate-800 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join us for networking opportunities, educational workshops, and community building events.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Events Carousel */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="w-full flex-shrink-0 bg-stone-50 dark:bg-slate-700 border border-stone-200 dark:border-slate-600 p-6 sm:p-8"
                >
                  <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                      {event.title}
                    </h3>
                    
                    {/* Date and Time */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-base sm:text-lg">
                      {event.description}
                    </p>

                    {/* Learn More Button */}
                    <button
                      onClick={() => handleLearnMore(event.link)}
                      className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous event"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next event"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {upcomingEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-red-600 scale-125'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Event Info Modal */}
        <EventInfoModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent}
        />

        {/* View All Events Button — Temporarily Disabled for MVP */}
        {/*
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => handleLearnMore('/events')}
            className="bg-red-700 hover:bg-red-800 text-white rounded-md px-8 py-3 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            View All Events
          </button>
        </div>
        */}

      </div>
    </section>
  );
};