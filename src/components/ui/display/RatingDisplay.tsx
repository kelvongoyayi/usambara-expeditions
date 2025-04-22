import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  maxRating = 5,
  showValue = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => (
          <span key={index}>
            {index < fullStars ? (
              <Star className={`${sizeClasses[size]} text-accent-500 fill-accent-500`} />
            ) : index === fullStars && hasHalfStar ? (
              <Star className={`${sizeClasses[size]} text-accent-500 fill-accent-500`} />
            ) : (
              <Star className={`${sizeClasses[size]} text-gray-300`} />
            )}
          </span>
        ))}
      </div>
      
      {showValue && (
        <span className={`ml-2 text-dark-700 font-medium ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;