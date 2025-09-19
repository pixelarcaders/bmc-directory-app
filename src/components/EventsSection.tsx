import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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
    title: "Success Tribe Connect & Collab Summit 2025",
    date: "March 15, 2025",
    time: "9:00 AM - 5:00 PM",
    description: "Join us for a day of networking, collaboration, and business growth opportunities with fellow entrepreneurs and industry leaders.",
    link: "/events"
  },
  {
    id: 2,
    title: "BMC Monthly Networking Mixer",
    date: "February 28, 2025",
    time: "6:00 PM - 8:00 PM",
    description: "Connect with local business owners and discover new partnership opportunities in a relaxed, professional setting.",
    link: "/events"
  },
  {
    id: 3,
    title: "Small Business Workshop Series",
    date: "March 8, 2025",
    time: "2:00 PM - 4:00 PM",
    description: "Learn essential business skills including marketing strategies, financial planning, and digital presence optimization.",
    link: "/events"
  }
];

export const EventsSection: React.FC = () => {
  const handleLearnMore = (link: string) => {
    // For MVP, just scroll to top or show placeholder
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-white dark:bg-slate-800 py-12 sm:py-16">
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-stone-50 dark:bg-slate-700 border border-stone-200 dark:border-slate-600 rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {/* Event Header */}
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                  {event.title}
                </h3>
                
                {/* Date and Time */}
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
              </div>

              {/* Event Description */}
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {event.description}
              </p>

              {/* Learn More Button */}
              <button
                onClick={() => handleLearnMore(event.link)}
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm group transition-all duration-200 active:scale-95"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => handleLearnMore('/events')}
            className="bg-red-700 hover:bg-red-800 text-white rounded-md px-8 py-3 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};