import React, { useState } from 'react';
import { MapPin, ChevronRight, ArrowRight, Camera, Sun, Calendar, ChevronLeft } from 'lucide-react';
import Section from '../ui/Section';
import { useInView } from 'react-intersection-observer';

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
  bestTime: string;
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Ancient rainforests and panoramic views in Tanzania\'s hidden gem.',
    features: ['Forest Hikes', 'Cultural Villages', 'Mountain Views'],
    bestTime: 'June to October'
  },
  {
    id: '2',
    name: 'Serengeti National Park',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Witness the spectacular Great Migration across endless plains.',
    features: ['Wildlife Safari', 'Great Migration', 'Balloon Rides'],
    bestTime: 'January to March, June to October'
  },
  {
    id: '3',
    name: 'Zanzibar Island',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Crystal waters and white sands with rich cultural heritage.',
    features: ['Beach Relaxation', 'Historic Stone Town', 'Spice Tours'],
    bestTime: 'June to October'
  }
];

const DestinationHighlights: React.FC = () => {
  const [activeDestination, setActiveDestination] = useState<string | null>(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <Section 
      title="Explore Tanzania" 
      subtitle="Discover our most iconic destinations"
      gradient 
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={ref}>
        {destinations.map((destination, index) => (
          <div 
            key={destination.id} 
            className={`relative group overflow-hidden rounded-xl h-[550px] shadow-lg transform transition-all duration-500 hover:-translate-y-2 ${
              inView ? 'opacity-0 animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: `${0.2 * index}s` }}
            onMouseEnter={() => setActiveDestination(destination.id)}
            onMouseLeave={() => setActiveDestination(null)}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${destination.image})` }}
            ></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              {/* Location Badge */}
              <div 
                className="inline-flex items-center mb-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transform transition-all duration-500 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 border border-white/10 hover:border-white/20 shadow-md"
                style={{ transform: 'translateY(20px)' }}
              >
                <MapPin className="w-4 h-4 text-accent-400 mr-2" />
                <span className="text-sm">Tanzania</span>
              </div>
              
              {/* Destination Name */}
              <h3 className="text-3xl font-bold mb-4 transition-all duration-300 group-hover:text-accent-400">
                {destination.name}
              </h3>
              
              {/* Description */}
              <p className="text-white/90 mb-6 max-w-md transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                {destination.description}
              </p>
              
              {/* Features */}
              <div 
                className="grid grid-cols-1 gap-3 mb-8 transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                style={{ transitionDelay: '0.1s' }}
              >
                {destination.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="bg-accent-500/20 p-1 rounded-full mr-3">
                      <Camera className="w-3 h-3 text-accent-400" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                <div className="flex items-center">
                  <div className="bg-accent-500/20 p-1 rounded-full mr-3">
                    <Sun className="w-3 h-3 text-accent-400" />
                  </div>
                  <span className="text-sm">Best Time: {destination.bestTime}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <a 
                href="#" 
                className="inline-flex items-center text-white hover:text-accent-400 transition-colors border-b border-white/30 hover:border-accent-400 pb-1 group/link transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                style={{ transitionDelay: '0.2s' }}
              >
                Explore Tours
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </a>
            </div>
            
            {/* Floating Tag */}
            <div className="absolute top-6 right-6 bg-accent-500 text-white px-3 py-1 rounded-full text-xs tracking-wider uppercase font-medium shadow-lg transform rotate-3 transition-transform group-hover:rotate-0">
              Featured
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex space-x-2">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => {}}
                className={`transition-all duration-300 rounded-full ${
                  index === 0 
                    ? 'bg-accent-500 w-8 h-2' 
                    : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                }`}
                aria-label={`Go to destination ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <a
          href="#"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors border-b border-white/30 hover:border-white pb-1 text-lg font-medium group mt-8"
        >
          View All Destinations
          <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </Section>
  );
};

export default DestinationHighlights;