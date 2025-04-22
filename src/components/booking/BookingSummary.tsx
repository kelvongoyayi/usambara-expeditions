import React from 'react';
import { FeaturedItem } from '../../types/tours';
import { CreditCard, Calendar, Users, MapPin } from 'lucide-react';

interface BookingSummaryProps {
  selectedItem: FeaturedItem | null;
  adults: number;
  children: number;
  totalPrice: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedItem,
  adults,
  children,
  totalPrice
}) => {
  if (!selectedItem) return null;
  
  return (
    <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
      <h3 className="text-lg font-bold text-brand-800 mb-4">Booking Summary</h3>
      
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
            <img 
              src={selectedItem.image} 
              alt={selectedItem.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-dark-800">{selectedItem.title}</h4>
            <div className="flex items-center text-dark-600 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
              {selectedItem.location}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center text-dark-600">
              <Calendar className="w-4 h-4 mr-2 text-brand-600" />
              Duration:
            </div>
            <span className="font-medium">{selectedItem.duration}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center text-dark-600">
              <Users className="w-4 h-4 mr-2 text-brand-600" />
              Travelers:
            </div>
            <span className="font-medium">{adults} Adults, {children} Children</span>
          </div>
          
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <span className="font-medium text-dark-700">Base Price (per adult):</span>
            <span className="font-medium">${selectedItem.price.toFixed(2)}</span>
          </div>
          
          {children > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Children's Price (60%):</span>
              <span>${(selectedItem.price * 0.6).toFixed(2)} × {children}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100 font-bold">
            <span className="text-dark-800">Total Price:</span>
            <span className="text-brand-700">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="bg-brand-100 p-2 rounded-full mr-4">
          <CreditCard className="w-5 h-5 text-brand-700" />
        </div>
        <p className="text-sm text-dark-600">
          A 20% deposit (${(totalPrice * 0.2).toFixed(2)}) is required to secure your booking.
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;