import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const backgrounds = [
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=90',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=90',
  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=90'
];

type BookingType = 'safari' | 'event';

interface BookingFormData {
  type: BookingType;
  destination: string;
  date: string;
  guests: string;
}

const Hero: React.FC = () => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const transitionTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const autoTransitionTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll to hide indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Popular destinations
  const popularDestinations = {
    safari: ['Usambara Mountains', 'Serengeti', 'Zanzibar', 'Kilimanjaro'],
    event: ['Corporate', 'Wedding', 'Conference', 'Retreat']
  };

  // Reset the transition progress when slide changes
  useEffect(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
    }
    
    setTransitionProgress(0);
    const interval = setInterval(() => {
      setTransitionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 60); // 6000ms (slide duration) / 100 (progress steps) = 60ms per step
    
    progressTimer.current = interval;
    
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [currentBackground]);

  // Auto-slide functionality
  useEffect(() => {
    if (transitioning) return;
    
    if (autoTransitionTimer.current) {
      clearTimeout(autoTransitionTimer.current);
    }
    
    const timeout = setTimeout(() => {
      goToNextSlide();
    }, 6000);
    
    autoTransitionTimer.current = timeout;
    
    return () => {
      if (autoTransitionTimer.current) {
        clearTimeout(autoTransitionTimer.current);
      }
    };
  }, [currentBackground, transitioning]);

  // Go to the next slide
  const goToNextSlide = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setCurrentBackground(prev => (prev + 1) % backgrounds.length);
    
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
    
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 1000); // Match this with the CSS transition duration
    
    transitionTimer.current = timer;
  };

  // Go to the previous slide
  const goToPrevSlide = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setCurrentBackground(prev => (prev - 1 + backgrounds.length) % backgrounds.length);
    
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
    
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 1000); // Match this with the CSS transition duration
    
    transitionTimer.current = timer;
  };

  // Go to a specific slide
  const goToSlide = (index: number) => {
    if (transitioning || index === currentBackground) return;
    
    setTransitioning(true);
    setCurrentBackground(index);
    
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
    
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 1000); // Match this with the CSS transition duration
    
    transitionTimer.current = timer;
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goToNextSlide();
    }
    
    if (isRightSwipe) {
      goToPrevSlide();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
  };

  const scrollToContent = () => {
    const firstSection = document.querySelector('section:not(:first-child)');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      {backgrounds.map((bg, index) => (
        <div 
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-2000 ease-in-out ${
            index === currentBackground ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
      ))}
      
      {/* Overlay Gradient - Improved for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70"></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white z-10">
        <div className="container mx-auto px-4 pt-16 md:pt-0">
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 opacity-0 animate-fadeIn font-display tracking-tight" 
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            Discover <span className="text-accent-400">Adventure</span>
          </h1>
          
          <p 
            className="text-lg md:text-xl mb-8 sm:mb-10 max-w-md sm:max-w-xl mx-auto opacity-0 animate-fadeIn text-white/90" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Unforgettable adventures across Tanzania's most breathtaking landscapes
          </p>
          
          {/* Book Now Button */}
          <div 
            className="opacity-0 animate-fadeIn" 
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            <Link 
              to="/book" 
              className="bg-accent-500 hover:bg-accent-600 text-white py-3 px-8 rounded-full inline-flex items-center transition-colors font-medium shadow-lg text-lg"
            >
              Book Your Adventure
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group h-1.5 relative flex items-center focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                  {index === currentBackground && (
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${transitionProgress}%` }}
                    ></div>
                  )}
                </div>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/50 px-2 py-1 rounded-md">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <div 
            className={`absolute bottom-32 left-[calc(50%-48px)] transform flex flex-col items-center justify-center transition-opacity duration-300 ${
              showScrollIndicator ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              animationDelay: '1.2s',
              animationFillMode: 'forwards'
            }}
          >
            <span className="text-white/80 text-[10px] mb-1.5 tracking-wide font-medium">Scroll to Explore</span>
            <div className="w-4 h-7 border-[1.5px] border-white/40 rounded-full relative flex items-center justify-center">
              <div 
                className="w-[3px] h-[3px] bg-white/80 rounded-full animate-scrollDown"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;