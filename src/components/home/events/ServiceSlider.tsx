import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Check, Briefcase, Award, 
  School, Users, Coffee, Globe, Activity, Zap, Heart, 
  Music, Film
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Types
type ServiceType = 'corporate' | 'adventure' | 'education' | 'special';

interface EventService {
  id: ServiceType;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
}

// Book icon
function Book(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

// Service Icons
const serviceIcons = {
  'corporate': [<Coffee key="1" />, <Globe key="2" />, <Activity key="3" />],
  'adventure': [<Zap key="1" />, <Activity key="2" />, <Globe key="3" />],
  'education': [<Book key="1" />, <Globe key="2" />, <Users key="3" />],
  'special': [<Heart key="1" />, <Music key="2" />, <Film key="3" />]
};

// Services Data
const eventServices: EventService[] = [
  {
    id: 'corporate',
    icon: <Briefcase className="w-6 h-6 text-brand-600" />,
    title: 'Corporate Events',
    description: 'Professional event planning for business retreats, conferences, and team-building activities.',
    features: ['Business Retreats', 'Conferences', 'Team Building'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'adventure',
    icon: <Award className="w-6 h-6 text-accent-500" />,
    title: 'Adventure Events',
    description: 'Exciting adventures and outdoor activities designed for thrill-seekers and adventure enthusiasts.',
    features: ['Motorsports', 'Mountain Expeditions', 'Cycling Tours'],
    image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80'
  },
  {
    id: 'education',
    icon: <School className="w-6 h-6 text-emerald-600" />,
    title: 'Educational Programs',
    description: 'Educational field trips and outdoor learning experiences for schools and institutions.',
    features: ['School Trips', 'Cultural Exchanges', 'Learning Workshops'],
    image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'special',
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: 'Special Occasions',
    description: 'Comprehensive solutions for organizing and managing weddings, parties, and special celebrations.',
    features: ['Weddings', 'Anniversary Parties', 'Special Celebrations'],
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

interface ServiceSliderProps {
  onServiceSelect: (serviceId: ServiceType | null) => void;
}

const ServiceSlider: React.FC<ServiceSliderProps> = ({ onServiceSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    
    if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Update visible count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(2);
      } else {
        setVisibleCount(2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Set isInitialRender to false after initial animation
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const maxIndex = Math.max(0, eventServices.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleCardHover = (index: number) => {
    setActiveCard(index);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Services Slider */}
      <div 
        className="overflow-hidden px-2 md:px-6 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-700 ease-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {eventServices.map((service, index) => (
            <div
              key={index}
              className={`${inView ? (isInitialRender ? 'opacity-0 animate-fade-in-up' : 'opacity-100') : 'opacity-0'} flex-shrink-0`}
              style={{ 
                animationDelay: `${0.15 * index}s`,
                width: `calc(${100 / visibleCount}% - ${(visibleCount > 1 ? 16 : 0)}px)`
              }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
              onClick={() => onServiceSelect(service.id)}
            >
              <div className="relative h-[400px] md:h-[450px] rounded-xl overflow-hidden cursor-pointer group">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.image})` }}
                ></div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40 transition-opacity duration-300 group-hover:opacity-90"></div>
                
                {/* Floating particles for visual interest */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-white/20 w-2 h-2"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-xl inline-flex items-center space-x-2 md:space-x-3 shadow-lg transform transition-all duration-300 group-hover:translate-y-2 group-hover:scale-105 hover:shadow-2xl mb-6">
                      <div className="bg-white rounded-full p-1.5 shadow-md">
                        {service.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-white text-sm md:text-base mb-4 md:mb-6 max-w-lg bg-white/5 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-lg transform transition-all duration-500 group-hover:translate-y-0 translate-y-2 opacity-90 group-hover:opacity-100">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 md:space-y-3">
                      {service.features.map((feature, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center text-white transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                          style={{ transitionDelay: `${idx * 0.1 + 0.1}s` }}
                        >
                          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 mr-3 shadow-md">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 md:mt-6 transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0" style={{ transitionDelay: '0.4s' }}>
                      <div className="text-white flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full py-1.5 px-3 transition-all duration-300 w-fit group/btn shadow-md hover:shadow-lg">
                        <span className="text-xs md:text-sm">Explore {service.title}</span>
                        <ChevronRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-3 left-3 w-8 h-8 border border-white/20 rounded-full transform transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 opacity-70"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border border-white/20 rounded-full transform transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 opacity-70"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Dots and Navigation - Now enclosed in a single background */}
      <div className="flex justify-center mt-8">
        <div className="bg-brand-900/40 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-brand-800/30 flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(eventServices.length - visibleCount + 1, eventServices.length) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index 
                    ? 'bg-accent-500 w-8 h-2 hover:bg-accent-600' 
                    : 'bg-brand-800/50 w-2 h-2 hover:bg-brand-700/60'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300"
            aria-label="Next service"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSlider;