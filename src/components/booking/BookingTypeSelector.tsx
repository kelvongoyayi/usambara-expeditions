import React from 'react';
import { FeaturedItem } from '../../types/tours';
import LoadingImage from '../ui/LoadingImage';
import { Clock, MapPin, Calendar, Check, Star } from 'lucide-react';

interface BookingTypeSelectorProps {
  formData: {
    bookingType: 'tour' | 'event' | '';
    itemId: string;
  };
  availableTours: FeaturedItem[];
  availableEvents: FeaturedItem[];
  loading: boolean;
  onBookingTypeSelect: (type: 'tour' | 'event') => void;
  onItemSelect: (itemId: string) => void;
}

const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({
  formData,
  availableTours,
  availableEvents,
  loading,
  onBookingTypeSelect,
  onItemSelect
}) => {
  return (
    <div className="space-y-10">
      {/* Booking Type Selection */}
      <div>
        <h2 className="text-2xl font-bold text-dark-800 mb-3">What would you like to book?</h2>
        <p className="text-dark-600 mb-6">Choose the type of experience you're looking for</p>
        
        {/* Horizontal scrollable container for mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 scrollbar-hide">
          {/* Tour Option */}
          <div 
            className={`group relative rounded-2xl overflow-hidden flex-shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer ${
              formData.bookingType === 'tour' 
                ? 'shadow-sm' 
                : 'hover:shadow-sm'
            }`}
            onClick={() => onBookingTypeSelect('tour')}
          >
            {/* Border overlay (above the image) */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none z-10 ${
              formData.bookingType === 'tour'
                ? 'ring-2 ring-brand-600 border border-brand-600'
                : 'border border-gray-200 group-hover:border-brand-300'
            }`}></div>
            
            <div className="aspect-[4/3] w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Adventure Tours"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {formData.bookingType === 'tour' && (
                <div className="absolute top-3 right-3 bg-brand-600 text-white p-1.5 rounded-full z-20">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <div className={`inline-flex items-center px-3 py-1 rounded-full mb-3 ${
                formData.bookingType === 'tour' ? 'bg-brand-600' : 'bg-brand-500/80'
              }`}>
                <span className="text-sm font-medium">Adventure Experience</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Guided Tours</h3>
              <p className="text-white/90 text-sm mb-4">
                Explore Tanzania's breathtaking landscapes with expert guides
              </p>
            </div>
          </div>
          
          {/* Event Option */}
          <div 
            className={`group relative rounded-2xl overflow-hidden flex-shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer ${
              formData.bookingType === 'event' 
                ? 'shadow-sm' 
                : 'hover:shadow-sm'
            }`}
            onClick={() => onBookingTypeSelect('event')}
          >
            {/* Border overlay (above the image) */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none z-10 ${
              formData.bookingType === 'event'
                ? 'ring-2 ring-accent-500 border border-accent-500'
                : 'border border-gray-200 group-hover:border-accent-300'
            }`}></div>
            
            <div className="aspect-[4/3] w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" 
                alt="Special Events"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {formData.bookingType === 'event' && (
                <div className="absolute top-3 right-3 bg-accent-500 text-white p-1.5 rounded-full z-20">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <div className={`inline-flex items-center px-3 py-1 rounded-full mb-3 ${
                formData.bookingType === 'event' ? 'bg-accent-500' : 'bg-accent-400/80'
              }`}>
                <span className="text-sm font-medium">Curated Experience</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Special Events</h3>
              <p className="text-white/90 text-sm mb-4">
                Join organized activities, festivals, and corporate retreats
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Items Section */}
      {formData.bookingType && (
        <div className="pt-4">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark-800 mb-1">
                Available {formData.bookingType === 'tour' ? 'Tours' : 'Events'}
              </h2>
              <p className="text-dark-600">
                Select from our curated {formData.bookingType === 'tour' ? 'adventures' : 'experiences'}
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-dark-600 mt-2 md:mt-0">
              {formData.bookingType === 'tour' ? availableTours.length : availableEvents.length} options available
            </div>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mb-4"></div>
              <p className="text-dark-600">Loading available options...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Item Cards */}
              {(formData.bookingType === 'tour' ? availableTours : availableEvents).map((item) => (
                <div 
                  key={item.id} 
                  className={`relative bg-white rounded-xl overflow-hidden transition-all duration-100 cursor-pointer ${
                    formData.itemId === item.id 
                      ? 'shadow-sm' 
                      : 'hover:shadow-sm'
                  }`}
                  onClick={() => onItemSelect(item.id)}
                >
                  {/* Border overlay */}
                  <div className={`absolute inset-0 rounded-xl pointer-events-none z-10 ${
                    formData.itemId === item.id
                      ? 'ring-2 ring-brand-600 border border-brand-600'
                      : 'border border-gray-200'
                  }`}></div>
                  
                  <div className="flex flex-col md:flex-row relative">
                    {/* Image Section - Fixed width and height */}
                    <div className="md:w-1/3 aspect-[3/2] md:aspect-auto md:h-40 relative">
                      <LoadingImage 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Selection Indicator */}
                      {formData.itemId === item.id && (
                        <div className="absolute top-3 right-3 bg-brand-600 text-white p-1.5 rounded-full z-20">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-700 font-medium px-2.5 py-1 rounded-md text-xs z-10">
                        ${item.price}
                        <span className="text-xs font-normal text-dark-500 ml-1">per person</span>
                      </div>
                    </div>
                    
                    {/* Content Section - Fixed height */}
                    <div className="md:w-2/3 p-4 flex flex-col h-full md:h-40 relative">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-dark-800 mb-1.5 line-clamp-1">{item.title}</h3>
                        
                        {/* Item Highlights */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <div className="flex items-center text-dark-600 bg-gray-50 px-2 py-0.5 rounded">
                            <MapPin className="w-3 h-3 mr-1 text-brand-600" />
                            <span className="text-xs">{item.location}</span>
                          </div>
                          <div className="flex items-center text-dark-600 bg-gray-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 mr-1 text-brand-600" />
                            <span className="text-xs">{item.duration}</span>
                          </div>
                          {item.date && (
                            <div className="flex items-center text-dark-600 bg-gray-50 px-2 py-0.5 rounded">
                              <Calendar className="w-3 h-3 mr-1 text-brand-600" />
                              <span className="text-xs">{item.date}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Description - Fixed height */}
                        <p className="text-dark-600 text-xs mb-0 line-clamp-2">{item.description}</p>
                      </div>
                      
                      {/* Bottom Section */}
                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 text-yellow-500 mr-0.5" />
                          <span className="text-dark-700 text-xs font-medium">4.9</span>
                          <span className="text-dark-400 text-xs ml-1">(120)</span>
                        </div>
                        
                        {formData.itemId === item.id && (
                          <div className="flex items-center text-brand-600 text-xs font-medium">
                            <Check className="w-3.5 h-3.5 mr-0.5" />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty State */}
              {(formData.bookingType === 'tour' ? availableTours.length === 0 : availableEvents.length === 0) && (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-base font-bold text-dark-700 mb-1">
                    No {formData.bookingType === 'tour' ? 'tours' : 'events'} available
                  </h3>
                  <p className="text-dark-500 text-xs max-w-md mx-auto">
                    Please check back later or contact us for custom arrangements.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingTypeSelector;