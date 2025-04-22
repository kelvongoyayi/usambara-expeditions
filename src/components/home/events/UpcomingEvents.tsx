import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, UserPlus, ChevronRight, 
  ChevronLeft, ArrowRight
} from 'lucide-react';

// Types
type ServiceType = 'corporate' | 'adventure' | 'education' | 'special';

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: ServiceType;
  attendees: number;
  image: string;
  tag?: string;
  tagColor?: string;
}

// Events Data
const upcomingEvents: EventItem[] = [
  {
    id: '1',
    title: "Corporate Team Building Retreat",
    date: "June 15-18, 2025",
    location: "Usambara Mountains",
    type: "corporate",
    attendees: 32,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    tag: "Open Registration",
    tagColor: "bg-green-500"
  },
  {
    id: '2',
    title: "Mountain Cycling Championship",
    date: "July 22, 2025",
    location: "Lushoto Valley",
    type: "adventure",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tag: "Featured",
    tagColor: "bg-accent-500"
  },
  {
    id: '3',
    title: "Cultural Exchange Program",
    date: "August 5-10, 2025",
    location: "Multiple Villages",
    type: "education",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    tag: "Limited Spots",
    tagColor: "bg-yellow-500"
  },
  {
    id: '4',
    title: "Luxury Wedding Package",
    date: "September 12, 2025",
    location: "Tanga Beach Resort",
    type: "special",
    attendees: 150,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

interface UpcomingEventsProps {
  activeService: string | null;
  onServiceSelect: (service: ServiceType | null) => void;
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ activeService, onServiceSelect, className = '' }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [animatingDirection, setAnimatingDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const filteredEvents = activeService 
    ? upcomingEvents.filter(event => event.type === activeService)
    : upcomingEvents;

  // Reset progress bar animation
  const resetProgressBar = () => {
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '0%';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = 'width 8000ms linear';
          progressRef.current.style.width = '100%';
        }
      }, 10);
    }
  };

  const handleAutoplay = () => {
    if (filteredEvents.length <= 1 || isCardHovered) return;
    
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    
    resetProgressBar();
    
    autoplayRef.current = setTimeout(() => {
      if (!isAnimating) {
        nextEvent();
      }
    }, 8000);
  };

  useEffect(() => {
    handleAutoplay();
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentEventIndex, isAnimating, filteredEvents.length, isCardHovered]);

  const nextEvent = () => {
    if (filteredEvents.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setAnimatingDirection('right');
    setCurrentEventIndex(prev => (prev + 1) % filteredEvents.length);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingDirection(null);
      handleAutoplay();
    }, 700);
  };

  const prevEvent = () => {
    if (filteredEvents.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setAnimatingDirection('left');
    setCurrentEventIndex(prev => (prev - 1 + filteredEvents.length) % filteredEvents.length);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingDirection(null);
      handleAutoplay();
    }, 700);
  };

  const goToEvent = (index: number) => {
    if (isAnimating || index === currentEventIndex) return;
    const direction = index > currentEventIndex ? 'right' : 'left';
    setIsAnimating(true);
    setAnimatingDirection(direction);
    setCurrentEventIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingDirection(null);
      handleAutoplay();
    }, 700);
  };

  // Touch handling for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || isAnimating) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // If significant swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextEvent();
      } else {
        prevEvent();
      }
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <div 
      className={`relative ${className}`}
      ref={carouselRef}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Header with title and navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div className="relative flex items-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Upcoming Events
          </h3>
        </div>
      </div>
      
      {/* Event Filter Pills - Scrollable on Mobile */}
      <div className="flex overflow-x-auto pb-3 -mx-4 px-4 md:overflow-visible md:pb-0 md:px-0 md:mx-0 mb-8 scrollbar-hide">
        <div className="flex space-x-2 md:flex-wrap md:gap-2">
          <button 
            onClick={() => onServiceSelect(null)}
            className={`py-2 px-4 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
              activeService === null 
                ? 'bg-accent-500 text-white shadow-lg scale-105' 
                : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 backdrop-blur-sm'
            }`}
          >
            All Events
          </button>
          
          {['corporate', 'adventure', 'education', 'special'].map((type) => (
            <button 
              key={type}
              onClick={() => onServiceSelect(type as ServiceType)}
              className={`py-2 px-4 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                activeService === type 
                  ? 'bg-accent-500 text-white shadow-lg scale-105' 
                  : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 backdrop-blur-sm'
              }`}
            >
              {type === 'corporate' ? 'Corporate Events' : 
               type === 'adventure' ? 'Adventure Events' : 
               type === 'education' ? 'Educational Programs' : 'Special Occasions'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Events Carousel */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`transition-transform ease-out flex ${
            isAnimating ? 'duration-700' : 'duration-0'
          }`}
          style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}
        >
          {filteredEvents.map((event, idx) => (
            <div key={event.id} className="min-w-full">
              <div className="flex flex-col md:grid md:grid-cols-5 bg-brand-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-inner border border-brand-800/50 h-[500px] md:h-[550px]">
                {/* Event Image (Full width on mobile, 2/5 on desktop) */}
                <div className="md:col-span-2 relative h-60 sm:h-64 md:h-auto overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    loading="lazy" 
                  />
                  
                  {/* Tag if available */}
                  {event.tag && (
                    <div className={`absolute top-4 right-4 ${event.tagColor} text-white text-xs py-1.5 px-4 rounded-full uppercase tracking-wider font-medium shadow-md backdrop-blur-sm`}>
                      {event.tag}
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 flex items-center bg-dark-900/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-dark-700">
                    <span className="text-white text-sm mr-1 font-medium">Type:</span>
                    <span className="text-accent-400 font-medium capitalize">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                {/* Event Details (Full width on mobile, 3/5 on desktop) */}
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between relative">
                  <div className="relative">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                      {event.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                      <div 
                        className="flex items-center text-white/80 group/item hover:text-white transition-colors duration-300"
                      >
                        <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 group-hover/item:border-white/20 p-2 rounded-full shadow-md mr-3 transition-colors duration-300 transform group-hover/item:scale-110">
                          <Calendar className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-white/60 group-hover/item:text-white/80 transition-colors duration-300">Date</p>
                          <p className="text-sm md:text-base">{event.date}</p>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center text-white/80 group/item hover:text-white transition-colors duration-300"
                      >
                        <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 group-hover/item:border-white/20 p-2 rounded-full shadow-md mr-3 transition-colors duration-300 transform group-hover/item:scale-110">
                          <MapPin className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-white/60 group-hover/item:text-white/80 transition-colors duration-300">Location</p>
                          <p className="text-sm md:text-base">{event.location}</p>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center text-white/80 group/item hover:text-white transition-colors duration-300"
                      >
                        <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 group-hover/item:border-white/20 p-2 rounded-full shadow-md mr-3 transition-colors duration-300 transform group-hover/item:scale-110">
                          <Clock className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-white/60 group-hover/item:text-white/80 transition-colors duration-300">Duration</p>
                          <p className="text-sm md:text-base">Full Day Event</p>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center text-white/80 group/item hover:text-white transition-colors duration-300"
                      >
                        <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 group-hover/item:border-white/20 p-2 rounded-full shadow-md mr-3 transition-colors duration-300 transform group-hover/item:scale-110">
                          <UserPlus className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-white/60 group-hover/item:text-white/80 transition-colors duration-300">Attendees</p>
                          <p className="text-sm md:text-base">{event.attendees}+ Expected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 relative">
                    <a 
                      href="#" 
                      className="text-white bg-accent-500 hover:bg-accent-600 rounded-full px-6 py-3 inline-flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-accent-600/20 hover:-translate-y-1 group/btn overflow-hidden relative"
                    >
                      <span className="relative z-10">Register Now</span>
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 relative z-10" />
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                    </a>
                    
                    <a 
                      href="#" 
                      className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-5 py-2.5 inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group/btn border border-white/10 hover:border-white/20"
                    >
                      Learn More
                      <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Improved Pagination Dots in unified container */}
      {filteredEvents.length > 1 && (
        <div className="flex justify-center mt-8">
          <div className="bg-brand-900/40 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-brand-800/30 flex items-center gap-2">
            <button
              onClick={prevEvent}
              className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300"
              aria-label="Previous event"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {filteredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToEvent(index)}
                className={`transition-all duration-300 ${
                  currentEventIndex === index 
                    ? 'bg-accent-500 w-8 h-2 hover:bg-accent-600' 
                    : 'bg-brand-800/50 w-2 h-2 hover:bg-brand-700/60'
                } rounded-full`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
            
            <button
              onClick={nextEvent}
              className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300"
              aria-label="Next event"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Progress indicator during autoplay - Improved visuals */}
      <div className="flex justify-center mt-4">
        <div className="w-32 h-1 bg-dark-700/50 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-accent-500/50"
            style={{ width: '0%', transition: 'width 8000ms linear' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;