import React from 'react';
import { useInView } from 'react-intersection-observer';
import TourCard from './TourCard';
import { FeaturedItem } from '../../types/tours';

interface TourGridProps {
  items: FeaturedItem[];
  showAsGrid: boolean;
  onViewDetails: (id: string) => void;
}

const TourGrid: React.FC<TourGridProps> = ({ items, showAsGrid, onViewDetails }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref}
      className={`transition-all duration-500 ease-in-out ${
        showAsGrid 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2' 
          : 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-5 pb-6 pt-2'
      }`}
      id="itemGrid"
    >
      {items.map((item, index) => (
        <div 
          key={item.id}
          className={`transition-all duration-500 ease-in-out ${
            showAsGrid 
              ? inView ? 'opacity-0 animate-fade-in-up' : 'opacity-0'
              : 'flex-none w-[85%] sm:w-[45%] lg:w-[31%] snap-center'
          }`}
          style={{ 
            animationDelay: `${0.1 * index}s`,
            transitionDelay: `${0.05 * index}s`
          }}
        >
          <TourCard 
            item={item} 
            onViewDetails={onViewDetails} 
            animationDelay={index * 0.1}
          />
        </div>
      ))}
    </div>
  );
};

export default TourGrid;