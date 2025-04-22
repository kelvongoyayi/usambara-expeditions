import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: { 
    value: number; 
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  className?: string;
  index?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  change,
  className = '',
  index = 0
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-500 text-sm uppercase font-medium">{title}</h3>
        {icon && (
          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</span>
        
        {change && (
          <div className="ml-3 flex items-center text-xs sm:text-sm">
            <span 
              className={`
                font-medium mr-1 flex items-center
                ${change.trend === 'up' ? 'text-green-600' : ''}
                ${change.trend === 'down' ? 'text-red-600' : ''}
                ${change.trend === 'neutral' ? 'text-gray-600' : ''}
              `}
            >
              {change.trend === 'up' && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
              {change.trend === 'down' && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {change.value}%
            </span>
            <span className="text-gray-400">vs {change.period || 'last month'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;