import React, { useState } from 'react';
import Section from '../ui/Section';
import ServiceSlider from './events/ServiceSlider';
import UpcomingEvents from './events/UpcomingEvents';
import CustomEventPlanner from './events/CustomEventPlanner';

const EventsSection: React.FC = () => {
  const [upcomingEventsFilter, setUpcomingEventsFilter] = useState<string | null>(null);

  return (
    <div className="relative transform-gpu overflow-hidden">
      <Section 
        title="Event Management" 
        subtitle="Let us create your unforgettable event in Tanzania"
        dark
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] -z-10 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full filter blur-[80px] -z-10 transform -translate-x-1/3 translate-y-1/4"></div>
      
        {/* Services Slider */}
        <div className="relative">
          <div className="absolute -left-6 top-1/2 w-12 h-20 bg-gradient-to-r from-dark-900 to-transparent z-0 pointer-events-none"></div>
          <div className="absolute -right-6 top-1/2 w-12 h-20 bg-gradient-to-l from-dark-900 to-transparent z-0 pointer-events-none"></div>
          <ServiceSlider onServiceSelect={() => {}} />
        </div>
      
        {/* Upcoming Events */}
        <div className="mt-24 relative">
          <div className="absolute -top-10 -left-10 w-20 h-20 border border-accent-500/20 rounded-full"></div>
          <div className="absolute -top-6 -left-6 w-12 h-12 border border-accent-500/30 rounded-full"></div>
          <UpcomingEvents 
            activeService={upcomingEventsFilter} 
            onServiceSelect={setUpcomingEventsFilter}
            className="relative z-10" 
          />
        </div>
      
        {/* Custom Event Planning CTA */}
        <div className="mt-16 relative">
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-accent-500/10 rounded-full filter blur-3xl -z-10"></div>
          <CustomEventPlanner className="z-10" />
        </div>
      </Section>
    </div>
  );
};

export default EventsSection;