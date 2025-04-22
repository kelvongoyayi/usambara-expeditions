import React from 'react';
import { Star, MapPin, Clock, Calendar, Users, ChevronRight, Heart } from 'lucide-react';
import LoadingImage from '../ui/LoadingImage';
import { FeaturedItem } from '../../types/tours';

interface TourDetailsModalProps {
  item: FeaturedItem;
  isVisible: boolean;
  onClose: () => void;
}

const TourDetailsModal: React.FC<TourDetailsModalProps> = ({ 
  item, 
  isVisible, 
  onClose 
}) => {
  if (!item) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-white rounded-xl overflow-hidden max-w-3xl sm:max-w-4xl w-full max-h-[90vh] shadow-2xl transition-all duration-300 transform"
        style={{
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)'
        }}
      >
        <div className="relative h-52 sm:h-64 md:h-72">
          <LoadingImage 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/20 backdrop-blur-sm hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close modal"
          >
            ✕
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="bg-accent-500 text-white py-1 px-3 rounded-full text-xs uppercase tracking-wider inline-flex items-center mb-3 sm:mb-4">
              {item.type === 'event' ? (
                <>
                  <span className="w-3 h-3 bg-white rounded-full mr-1.5"></span>
                  {item.category}
                </>
              ) : (
                item.category
              )}
            </div>
            <h3 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white" 
              id="modal-title"
            >
              {item.title}
            </h3>
          </div>
        </div>
        
        <div className="p-5 sm:p-6 overflow-auto max-h-[calc(90vh-16rem)]">
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="bg-brand-50 rounded-full py-1.5 px-3 flex items-center text-brand-700 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 mr-2 text-brand-600" />
              {item.location}
            </div>
            <div className="bg-brand-50 rounded-full py-1.5 px-3 flex items-center text-brand-700 text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 mr-2 text-brand-600" />
              {item.duration}
            </div>
            {item.type === 'event' && item.date && (
              <div className="bg-brand-50 rounded-full py-1.5 px-3 flex items-center text-brand-700 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 mr-2 text-brand-600" />
                {item.date}
              </div>
            )}
            <div className="bg-brand-50 rounded-full py-1.5 px-3 flex items-center text-brand-700 text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 mr-2 text-accent-500" />
              {item.rating} Rating
            </div>
            {item.type === 'tour' && (
              <div className="bg-brand-50 rounded-full py-1.5 px-3 flex items-center text-brand-700 text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 mr-2 text-brand-600" />
                Small Group (4-12)
              </div>
            )}
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h4 className="text-lg sm:text-xl font-bold text-dark-800 mb-3 sm:mb-4">
              {item.type === 'event' ? 'Event Overview' : 'Tour Overview'}
            </h4>
            <p className="text-dark-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
            <p className="text-dark-600 mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed">
              {item.type === 'event' 
                ? 'Join us for this exceptional event in the beautiful landscapes of Tanzania. Our experienced team will ensure you have a memorable and enriching experience.'
                : 'This tour offers an unforgettable experience to explore the beautiful landscapes of Tanzania. Our expert guides will ensure you have a safe and enriching journey through some of the most stunning natural environments in East Africa.'}
            </p>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h4 className="text-lg sm:text-xl font-bold text-dark-800 mb-3 sm:mb-4">What's Included</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
              {[
                item.type === 'event' ? 'Event materials' : 'Professional guide', 
                'Transportation',
                item.type === 'event' ? 'Refreshments' : 'Meals as specified',
                item.type === 'tour' ? 'Accommodation' : 'Venue access',
                'Entrance fees',
                'Safety equipment'
              ].map((feature, i) => (
                <li key={i} className="flex items-start bg-gray-50 p-3 rounded-lg">
                  <div className="bg-accent-500/10 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {item.type === 'tour' && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl font-bold text-dark-800 mb-3 sm:mb-4">Tour Schedule</h4>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                {Array.from({ length: parseInt(item.duration.split(' ')[0]) }).map((_, i) => (
                  <div key={i} className="border-l-2 border-brand-500 pl-4 sm:pl-5 pb-5">
                    <div className="bg-brand-500 text-white inline-block px-2 py-1 rounded-md mb-2">Day {i + 1}</div>
                    <p className="text-dark-600 leading-relaxed">
                      {i === 0 
                        ? 'Arrival and orientation. Begin with a welcome briefing and short hike.' 
                        : i === parseInt(item.duration.split(' ')[0]) - 1
                          ? 'Final excursion and departure. Enjoy a farewell meal before leaving.'
                          : `Explore the ${item.category === 'hiking' ? 'trails' : item.category === 'cycling' ? 'routes' : 'villages'} with expert guides.`
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {item.type === 'event' && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl font-bold text-dark-800 mb-3 sm:mb-4">Event Details</h4>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="border-l-2 border-accent-500 pl-4 sm:pl-5 pb-5">
                  <div className="bg-accent-500 text-white inline-block px-2 py-1 rounded-md mb-2">Schedule</div>
                  <p className="text-dark-600 leading-relaxed">
                    The event will run from 9:00 AM to 5:00 PM each day, with various activities and sessions throughout.
                  </p>
                </div>
                <div className="border-l-2 border-accent-500 pl-4 sm:pl-5 pb-5">
                  <div className="bg-accent-500 text-white inline-block px-2 py-1 rounded-md mb-2">Who Should Attend</div>
                  <p className="text-dark-600 leading-relaxed">
                    This event is perfect for {item.category === 'corporate' ? 'businesses and teams looking to build stronger connections' : 'individuals interested in culture, adventure, and unique experiences'}.
                  </p>
                </div>
                <div className="border-l-2 border-accent-500 pl-4 sm:pl-5 pb-5">
                  <div className="bg-accent-500 text-white inline-block px-2 py-1 rounded-md mb-2">Requirements</div>
                  <p className="text-dark-600 leading-relaxed">
                    Participants should bring {item.category === 'corporate' ? 'business cards and an open mind' : 'comfortable clothing and a spirit of adventure'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-5 sm:p-6 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-dark-500 text-xs sm:text-sm">From</p>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-900">${item.price} <span className="text-xs sm:text-sm md:text-base font-normal text-dark-500">{item.type === 'event' ? 'per person' : 'per person'}</span></div>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button className="bg-white border border-dark-300 hover:border-dark-400 text-dark-700 py-2.5 px-4 sm:py-2.5 sm:px-6 rounded-full inline-flex items-center transition-colors text-sm sm:text-base">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </button>
            <button className="bg-accent-500 hover:bg-accent-600 text-white py-2.5 px-5 sm:py-2.5 sm:px-6 rounded-full inline-flex items-center transition-colors font-medium shadow-md group text-sm sm:text-base">
              {item.type === 'event' ? 'Register Now' : 'Book This Tour'}
              <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsModal;