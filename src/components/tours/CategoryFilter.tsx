import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Users, Clock, MapPin, Briefcase } from 'lucide-react';

export type TourCategory = 'all' | 'hiking' | 'cycling' | 'cultural' | 'event';

interface CategoryFilterProps {
  activeCategory: TourCategory;
  onCategoryChange: (category: TourCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Categories data
  const categories: { id: TourCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <Filter className="w-4 h-4" /> },
    { id: 'hiking', label: 'Hiking', icon: <Users className="w-4 h-4" /> },
    { id: 'cycling', label: 'Cycling', icon: <Clock className="w-4 h-4" /> },
    { id: 'cultural', label: 'Cultural', icon: <MapPin className="w-4 h-4" /> },
    { id: 'event', label: 'Events', icon: <Briefcase className="w-4 h-4" /> }
  ];

  // Horizontal scroll handling for categories on mobile
  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative mb-6 sm:mb-8">
      {/* Scrollable Categories */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto scrollbar-hide py-4 pt-8 px-8 md:px-0 md:justify-center scroll-smooth"
      >
        <div className="bg-white p-1.5 rounded-full shadow-soft inline-flex items-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap text-sm md:text-base py-2 px-4 md:px-5 rounded-full transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-dark-600 hover:bg-gray-100'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;