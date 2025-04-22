import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FeaturedItem } from '../../../types/tours';
import { formatDate } from '../../../utils/date-utils';

interface UpcomingEventsProps {
  events: FeaturedItem[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
      </div>
      
      <motion.div 
        className="divide-y divide-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {events.length > 0 ? (
          events.map((event) => (
            <motion.div 
              key={event.id} 
              className="px-4 sm:px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">
                    {event.location} • {event.date}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${event.price}</p>
                <p className="text-xs text-gray-500 capitalize">{event.type}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
            No upcoming events to display
          </div>
        )}
      </motion.div>
      
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
        <a 
          href="/admin/events" 
          className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center"
        >
          <span>View all events</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

export default UpcomingEvents;