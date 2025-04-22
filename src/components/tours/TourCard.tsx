import React from 'react';
import { MapPin, Clock, Star, ArrowRight, Heart, Share2, Calendar, Users } from 'lucide-react';
import LoadingImage from '../ui/LoadingImage';
import { FeaturedItem } from '../../types/tours';

interface TourCardProps {
  item: FeaturedItem;
  onViewDetails: (id: string) => void;
  animationDelay?: number;
  className?: string;
}

const TourCard: React.FC<TourCardProps> = ({ 
  item, 
  onViewDetails, 
  animationDelay = 0,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-card h-full flex flex-col group overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}>
      {/* Image Container with Aspect Ratio */}
      <div className="relative pt-[56.25%] overflow-hidden">
        <LoadingImage 
          src={item.image} 
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-t-xl"
        />
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-accent-500/90 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs uppercase tracking-wider border border-white/20 font-medium">
          {item.category}
        </div>
        
        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white py-1.5 px-3 rounded-full flex items-center transition-all duration-300 shadow-md">
          <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400 mr-1.5" />
          <span className="font-medium text-sm">{item.rating}</span>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-colors shadow-md">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-colors shadow-md">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-dark-800 mb-2 sm:mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
          {item.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-dark-500">
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
            <span className="truncate max-w-[100px] sm:max-w-none">{item.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-brand-500" />
            <span>{item.duration}</span>
          </div>
          {item.type === 'event' && item.date && (
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-brand-500" />
              <span>{item.date}</span>
            </div>
          )}
        </div>
        
        <p className="text-dark-600 mb-4 sm:mb-5 flex-grow line-clamp-3 text-sm sm:text-base leading-relaxed">
          {item.description}
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <button 
            onClick={() => onViewDetails(item.id)}
            className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center group/link text-sm sm:text-base"
          >
            View Details
            <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </button>
          
          <div className="text-dark-900 font-bold text-base sm:text-lg">
            ${item.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;