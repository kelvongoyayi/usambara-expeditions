import React from 'react';
import { 
  MapPin, Calendar, Users, Clock, DollarSign, Info
} from 'lucide-react';
import { 
  InputField, 
  SelectField, 
  QuantityField
} from '../ui';
import { FeaturedItem } from '../../types/tours';
import LoadingImage from '../ui/LoadingImage';

interface BookingDetailsProps {
  formData: {
    bookingType: 'tour' | 'event' | '';
    itemId: string;
    destination: string;
    date: string;
    adults: number;
    children: number;
  };
  selectedItem: FeaturedItem | null;
  destinations: { value: string; label: string }[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onNumberChange: (field: 'adults' | 'children', value: number) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  formData,
  selectedItem,
  destinations,
  onInputChange,
  onSelectChange,
  onNumberChange
}) => {
  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-dark-800 mb-2">Trip Details</h2>
        <p className="text-dark-600 mb-6">
          Review your selected item and enter your trip details
        </p>
        
        {selectedItem && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Image with price badge */}
              <div className="md:w-2/5 relative">
                <LoadingImage 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-[220px] md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Price badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-brand-700 font-bold px-4 py-2 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>${selectedItem.price}</span>
                    <span className="text-xs font-normal text-dark-500 ml-1">per person</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 md:w-3/5">
                {/* Type badge */}
                <div className="mb-3">
                  <span className="bg-brand-100 text-brand-700 text-xs font-medium py-1 px-3 rounded-full">
                    {formData.bookingType === 'tour' ? 'Guided Tour' : 'Special Event'}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-dark-800 mb-3">{selectedItem.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-dark-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-brand-600" />
                    <span>{selectedItem.location}</span>
                  </div>
                  
                  <div className="flex items-center text-dark-600 text-sm">
                    {formData.bookingType === 'tour' ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 text-brand-600" />
                        <span>{selectedItem.duration}</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2 text-brand-600" />
                        <span>{selectedItem.date}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-dark-600 mb-4">{selectedItem.description}</p>
                
                <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 text-sm">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-brand-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-700">
                      {formData.bookingType === 'tour' 
                        ? 'This tour requires a minimum of 2 participants. Customization options are available.' 
                        : 'Event tickets are non-refundable but can be transferred to another person.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-brand-600" />
            Booking Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Destination"
              name="destination"
              options={destinations}
              value={formData.destination}
              onChange={(value) => onSelectChange('destination', value)}
              icon={<MapPin className="w-5 h-5" />}
              className="bg-gray-50 border-gray-200 focus-within:bg-white"
            />
            
            <InputField
              label="Travel Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={onInputChange}
              required
              min={today}
              max={maxDateString}
              icon={<Calendar className="w-5 h-5" />}
              className="bg-gray-50 border-gray-200 focus-within:bg-white"
            />
            
            <QuantityField
              label="Adults (18+)"
              value={formData.adults}
              onChange={(value) => onNumberChange('adults', value)}
              min={1}
              max={20}
              className="bg-gray-50 border-gray-200"
            />
            
            <QuantityField
              label="Children (0-17)"
              value={formData.children}
              onChange={(value) => onNumberChange('children', value)}
              min={0}
              max={10}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          
          <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-100">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-dark-700">
                A 20% deposit is required to secure your booking. The remaining balance will be due 30 days before your trip.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;