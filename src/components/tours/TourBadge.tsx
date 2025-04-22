import React from 'react';
import { Star, Briefcase } from 'lucide-react';

interface TourBadgeProps {
  type: 'tour' | 'event';
  className?: string;
  style?: React.CSSProperties;
}

const TourBadge: React.FC<TourBadgeProps> = ({ type, className = '', style }) => {
  return (
    <div 
      className={`inline-flex items-center text-white py-1.5 px-4 rounded-full text-xs md:text-sm uppercase tracking-wider w-fit
      ${type === 'event' ? 'bg-accent-500' : 'bg-brand-600'} ${className}`}
      style={style}
    >
      {type === 'event' ? (
        <>
          <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
          Featured Event
        </>
      ) : (
        <>
          <Star className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
          Featured Tour
        </>
      )}
    </div>
  );
};

export default TourBadge;