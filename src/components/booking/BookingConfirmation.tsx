import React from 'react';
import { Check, Calendar, MapPin, Users, ArrowRight, Copy, FileText, Download, ChevronRight } from 'lucide-react';
import { Button, Alert } from '../ui';
import { FeaturedItem } from '../../types/tours';

interface BookingConfirmationProps {
  bookingReference: string;
  formData: {
    bookingType: 'tour' | 'event' | '';
    date: string;
    adults: number;
    children: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  selectedItem: FeaturedItem | null;
  totalPrice: number;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingReference,
  formData,
  selectedItem,
  totalPrice
}) => {
  // Function to copy booking reference to clipboard
  const copyReferenceToClipboard = () => {
    navigator.clipboard.writeText(bookingReference);
    alert('Booking reference copied to clipboard!');
  };
  
  // Format the date properly
  const formattedDate = formData.date ? 
    new Date(formData.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
  
  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-50 to-green-100 rounded-full mb-6">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-dark-800 mb-3">Booking Confirmed!</h2>
          <p className="text-lg text-dark-600 max-w-md mx-auto">
            Thank you for your booking, {formData.firstName}. We've sent a confirmation email to {formData.email}.
          </p>
        </div>
        
        {/* Reference Card */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="text-brand-700 font-medium mb-1">Booking Reference</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold font-mono text-brand-700 mr-3">{bookingReference}</h3>
                <button 
                  onClick={copyReferenceToClipboard}
                  className="text-brand-600 hover:text-brand-700 bg-white p-1.5 rounded-md border border-brand-200 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="py-2 px-3 bg-accent-100 text-accent-700 rounded-lg font-medium text-sm">
                Status: Confirmed
              </div>
              <div className="py-2 px-3 bg-yellow-100 text-yellow-700 rounded-lg font-medium text-sm">
                Payment: Pending
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Details Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Card Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-xl text-dark-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-brand-600" />
              Booking Summary
            </h3>
          </div>
          
          {/* Card Body */}
          <div className="p-6">
            {/* Trip Details */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-dark-800">
                  {formData.bookingType === 'tour' ? 'Tour' : 'Event'} Details
                </h4>
                {selectedItem && (
                  <span className="font-bold text-lg text-brand-700">${totalPrice?.toFixed(2)}</span>
                )}
              </div>
              
              {selectedItem && (
                <div className="flex flex-col md:flex-row gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="md:w-1/3 h-32 md:h-auto">
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.title}
                      className="w-full h-full object-cover rounded-md shadow-sm"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h5 className="font-bold text-dark-800 mb-2">{selectedItem.title}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-4">
                      <div className="flex items-center text-dark-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-brand-600" />
                        <span>{selectedItem.location}</span>
                      </div>
                      <div className="flex items-center text-dark-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-brand-600" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center text-dark-600 text-sm">
                        <Users className="w-4 h-4 mr-2 text-brand-600" />
                        <span>{formData.adults} Adults, {formData.children} Children</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-dark-600">{selectedItem.description}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Information */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h4 className="font-bold text-dark-800 mb-3">Payment Details</h4>
              
              <div className="flex justify-between">
                <span className="text-dark-600">Subtotal</span>
                <span className="font-medium text-dark-800">${totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Deposit Due (20%)</span>
                <span className="font-medium text-dark-800">${(totalPrice * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Balance Due (Before Trip)</span>
                <span className="font-medium text-dark-800">${(totalPrice * 0.8).toFixed(2)}</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
                <p className="text-sm text-dark-600">
                  <strong>Payment Instructions:</strong> Please pay the 20% deposit ({(totalPrice * 0.2).toFixed(2)}) 
                  within 48 hours to secure your booking. The remaining balance will be due 30 days before your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            as="a" 
            href="/"
            variant="secondary"
            className="flex items-center justify-center"
            leftIcon={<ArrowRight className="w-4 h-4" />}
          >
            Return to Home
          </Button>
          
          <Button 
            type="button" 
            variant="primary"
            className="flex items-center justify-center"
            onClick={() => window.print()}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Confirmation
          </Button>
          
          <Button 
            as="a"
            href="/account/bookings"
            variant="outline"
            className="flex items-center justify-center"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Manage Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;