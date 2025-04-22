import React from 'react';
import { MapPin, Clock, Calendar, Users } from 'lucide-react';
import { FeaturedItem } from '../../types/tours';

interface TourFeatureTagsProps {
  item: FeaturedItem;
  className?: string;
  style?: React.CSSProperties;
}

const TourFeatureTags: React.FC<TourFeatureTagsProps> = ({ item, className = '', style }) => {
  return (
    <div className={`flex flex-wrap gap-2 sm:gap-4 ${className}`} style={style}>
      <div className="bg-white/15 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center text-white text-xs sm:text-sm">
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-400" />
        <span className="truncate max-w-[100px] sm:max-w-none">{item.location}</span>
      </div>
      <div className="bg-white/15 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center text-white text-xs sm:text-sm">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-400" />
        {item.duration}
      </div>
      
      {item.type === 'event' && item.date && (
        <div className="bg-white/15 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center text-white text-xs sm:text-sm">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-400" />
          {item.date}
        </div>
      )}
      
      {item.type === 'tour' && (
        <div className="bg-white/15 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center text-white text-xs sm:text-sm">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-400" />
          Small groups
        </div>
      )}
    </div>
  );
};

export default TourFeatureTags;