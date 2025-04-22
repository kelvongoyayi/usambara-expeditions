import React from 'react';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'booking' | 'tour' | 'event' | 'user';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'pending' | 'cancelled';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
  viewAllLink?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  title = 'Recent Activity',
  viewAllLink 
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'tour':
        return <MapPin className="w-5 h-5 text-brand-600" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-accent-500" />;
      case 'user':
        return <User className="w-5 h-5 text-blue-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-200 rounded-full"></div>;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusClasses = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all
          </a>
        )}
      </div>
      
      <motion.div 
        className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.length > 0 ? (
          activities.map((activity) => (
            <motion.div 
              key={activity.id} 
              className="px-4 sm:px-6 py-4 flex items-start hover:bg-gray-50 transition-colors"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 p-2 bg-gray-50 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center ml-2">
                    {getStatusBadge(activity.status)}
                    <span className="ml-2 text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
            No recent activities to display
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecentActivity;