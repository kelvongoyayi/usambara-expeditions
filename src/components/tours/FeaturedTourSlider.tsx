import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import LoadingImage from '../ui/LoadingImage';
import TourBadge from './TourBadge';
import TourFeatureTags from './TourFeatureTags';
import { FeaturedItem } from '../../types/tours';

interface FeaturedTourSliderProps {
  items: FeaturedItem[];
  onViewDetails: (id: string) => void;
}

const FeaturedTourSlider: React.FC<FeaturedTourSliderProps> = ({ items, onViewDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Autoplay for featured items
  useEffect(() => {
    if (autoplayPaused || isAnimating) return;
    
    const startAutoplay = () => {
      autoplayTimerRef.current = window.setTimeout(() => {
        goToNext();
      }, 6000);
    };
    
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, isAnimating, autoplayPaused]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, []);

  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToPrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Mouse and touch event handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    setAutoplayPaused(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const newOffset = clientX - dragStartX;
    setDragOffset(newOffset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setAutoplayPaused(false);
    
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    setDragOffset(0);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Calculate transform with drag offset
  const getTransformStyle = () => {
    const baseTransform = `translateX(-${currentIndex * 100}%)`;
    if (!isDragging) return baseTransform;
    
    const percentOffset = (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;
    return `translateX(calc(-${currentIndex * 100}% + ${percentOffset}%))`;
  };

  return (
    <div 
      className="relative overflow-hidden rounded-xl shadow-lg min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px]" 
      ref={(node) => {
        // Combine refs
        if (node) {
          carouselRef.current = node;
          ref(node);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`transition-transform duration-500 ease-out flex ${isDragging ? 'transition-none' : ''}`}
        style={{ transform: getTransformStyle() }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="min-w-full relative">
            {/* Content Container */}
            <div className="h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] relative">
              <LoadingImage 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 pb-12 sm:p-10 sm:pb-16 md:p-16 md:pb-24">
                {/* Badge */}
                <TourBadge type={item.type} className="mb-4 md:mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }} />
                
                {/* Title */}
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                >
                  {item.title}
                </h3>
                
                {/* Rating */}
                <div 
                  className="flex items-center mb-3 md:mb-5 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={i < Math.floor(item.rating) ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-accent-500' : 'text-gray-300'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white ml-2 text-sm md:text-base">{item.rating} stars</span>
                </div>
                
                {/* Description */}
                <p 
                  className="text-white/90 max-w-xl mb-5 sm:mb-7 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  {item.description}
                </p>
                
                {/* Feature Tags */}
                <TourFeatureTags 
                  item={item} 
                  className="mb-5 sm:mb-8 opacity-0 animate-fade-in-up" 
                  style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                />
                
                {/* Call-to-action Buttons */}
                <div 
                  className="flex flex-wrap gap-3 sm:gap-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
                >
                  <a 
                    href="#" 
                    className="bg-accent-500 hover:bg-accent-600 text-white py-2.5 px-5 sm:py-3 sm:px-6 rounded-full inline-flex items-center transition-colors font-medium shadow-lg group text-sm sm:text-base"
                  >
                    {item.type === 'event' ? 'Register Now' : 'Book Now'} – ${item.price}
                    <ChevronRight className="ml-2 sm:ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <button 
                    onClick={() => onViewDetails(item.id)}
                    className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white py-2.5 px-5 sm:py-3 sm:px-6 rounded-full inline-flex items-center transition-colors font-medium border border-white/20 text-sm sm:text-base"
                  >
                    {item.type === 'event' ? 'Event Details' : 'Tour Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20 bg-brand-900/40 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-brand-800/30">
        <button 
          onClick={goToPrev}
          className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-0.5"
          aria-label="Previous featured item"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Pagination dots */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? 'bg-accent-500 w-8 h-2 hover:bg-accent-600' 
                  : 'bg-brand-800/50 w-2 h-2 hover:bg-brand-700/60'
              }`}
              aria-label={`Go to featured item ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
        
        <button 
          onClick={goToNext}
          className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-0.5"
          aria-label="Next featured item"
          disabled={isAnimating}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedTourSlider;