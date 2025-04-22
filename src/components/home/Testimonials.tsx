import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MapPin } from 'lucide-react';
import { Testimonial } from '../../types';
import Section from '../ui/Section';
import { useInView } from 'react-intersection-observer';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Our hiking tour in the Usambara Mountains was magical. The guides were knowledgeable and the scenery took our breath away.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    location: 'United States'
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 5,
    comment: 'Usambara Expeditions planned our corporate retreat flawlessly. The team-building activities were engaging and memorable.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    location: 'Singapore'
  },
  {
    id: '3',
    name: 'Amina Kimathi',
    rating: 4,
    comment: 'The cultural village tour offered authentic insights into local traditions. A truly enriching experience.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    location: 'Kenya'
  },
  {
    id: '4',
    name: 'David Miller',
    rating: 5,
    comment: 'The cycling tour through tea plantations was unforgettable. Bikes were excellent and our guide was exceptional.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    location: 'Canada'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Update visible count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % (testimonials.length - visibleCount + 1)
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - visibleCount : prevIndex - 1
    );
  };

  // Auto-scroll when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering, currentIndex, visibleCount]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Section
      title="Guest Experiences" 
      subtitle="See what our travelers say about their journeys"
      className="overflow-hidden"
    >
      <div 
        className="relative"
        ref={ref}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Navigation Buttons */}
        <button 
          onClick={prev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none transition-transform duration-300 hover:-translate-y-1"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 text-dark-700" />
        </button>
        
        <button 
          onClick={next}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none transition-transform duration-300 hover:-translate-y-1"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 text-dark-700" />
        </button>
        
        {/* Testimonial Cards */}
        <div className="overflow-hidden px-4 py-8">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`min-w-0 transition-all duration-500 ${
                  inView ? 'opacity-0 animate-fadeIn' : 'opacity-0'
                }`}
                style={{ 
                  flex: `0 0 ${100 / visibleCount}%`, 
                  animationDelay: `${0.2 * index}s`,
                  transform: 'scale(0.95)',
                  animationFillMode: 'forwards'
                }}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col relative">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -right-2 text-accent-500 transform rotate-6">
                    <Quote className="w-12 h-12 opacity-20" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Comment */}
                  <p className="text-dark-600 mb-6 flex-grow italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  
                  {/* User Info */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent-100"
                      loading="lazy"
                    />
                    <div className="ml-3">
                      <h4 className="font-semibold text-dark-800">{testimonial.name}</h4>
                      <div className="flex items-center text-sm text-dark-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-accent-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up">
        {[
          { label: 'Happy Guests', value: '2,500+' },
          { label: 'Destinations', value: '25+' },
          { label: 'Tours Completed', value: '1,200+' },
          { label: 'Years Experience', value: '15+' }
        ].map((stat, index) => (
          <div 
            key={index} 
            className="bg-brand-50 rounded-xl p-6 text-center transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl md:text-4xl font-bold text-brand-700 mb-1">{stat.value}</div>
            <div className="text-dark-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;