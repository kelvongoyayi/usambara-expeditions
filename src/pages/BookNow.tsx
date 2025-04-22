import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, ArrowLeft, CreditCard } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Section from '../components/ui/Section';
import { 
  Button,
  Stepper,
  FeatureList
} from '../components/ui';
import BookingTypeSelector from '../components/booking/BookingTypeSelector';
import BookingDetails from '../components/booking/BookingDetails';
import PersonalInfoForm from '../components/booking/PersonalInfoForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import BookingSummary from '../components/booking/BookingSummary';
import { toursService } from '../services/tours.service';
import { eventsService } from '../services/events.service';
import { bookingsService } from '../services/bookings.service';
import { FeaturedItem } from '../types/tours';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// Booking type interface
interface BookingFormData {
  bookingType: 'tour' | 'event' | '';
  itemId: string;
  destination: string;
  date: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  agreeToTerms: boolean;
}

// Steps for the booking process
const bookingSteps = [
  { id: 'select-type', label: 'Select Type' },
  { id: 'trip-details', label: 'Trip Details' },
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'confirmation', label: 'Confirmation' }
];

const BookNow: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // State for the current booking step
  const [currentStep, setCurrentStep] = useState<string>('select-type');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // State for available tours and events
  const [availableTours, setAvailableTours] = useState<FeaturedItem[]>([]);
  const [availableEvents, setAvailableEvents] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [isSavingBooking, setIsSavingBooking] = useState<boolean>(false);
  
  // Initialize booking form data
  const [formData, setFormData] = useState<BookingFormData>({
    bookingType: '',
    itemId: '',
    destination: '',
    date: '',
    adults: 2,
    children: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeToTerms: false
  });

  // Fetch tours and events on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tours
        const toursData = await toursService.getTours();
        const featuredTours = toursData.map(tour => toursService.toFeaturedItem(tour));
        setAvailableTours(featuredTours);
        
        // Fetch events
        const eventsData = await eventsService.getEvents();
        const featuredEvents = eventsData.map(event => eventsService.toFeaturedItem(event));
        setAvailableEvents(featuredEvents);
        
        // Check URL parameters for pre-selected tour or event
        const params = new URLSearchParams(location.search);
        const tourId = params.get('tour');
        const eventId = params.get('event');
        
        if (tourId) {
          setFormData(prev => ({ 
            ...prev, 
            bookingType: 'tour',
            itemId: tourId
          }));
          setCurrentStep('trip-details');
          setCompletedSteps(['select-type']);
        } else if (eventId) {
          setFormData(prev => ({ 
            ...prev, 
            bookingType: 'event',
            itemId: eventId
          }));
          setCurrentStep('trip-details');
          setCompletedSteps(['select-type']);
        }
        
        // Pre-fill user data if logged in
        if (user) {
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load available tours and events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, user]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox differently
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear booking error when user makes changes
    if (bookingError) {
      setBookingError(null);
    }
  };

  // Handle number inputs (adults, children)
  const handleNumberChange = (field: 'adults' | 'children', value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear booking error when user makes changes
    if (bookingError) {
      setBookingError(null);
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear booking error when user makes changes
    if (bookingError) {
      setBookingError(null);
    }
  };

  // Handle booking type selection
  const handleBookingTypeSelect = (type: 'tour' | 'event') => {
    setFormData(prev => ({ 
      ...prev, 
      bookingType: type,
      itemId: '' // Reset item selection when changing type
    }));
  };

  // Handle item selection (tour or event)
  const handleItemSelect = (itemId: string) => {
    setFormData(prev => ({ ...prev, itemId }));
  };

  // Move to the next step
  const handleNextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    const currentIndex = bookingSteps.findIndex(step => step.id === currentStep);
    if (currentIndex < bookingSteps.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Move to the next step
      setCurrentStep(bookingSteps[currentIndex + 1].id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Move to the previous step
  const handlePrevStep = () => {
    const currentIndex = bookingSteps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(bookingSteps[currentIndex - 1].id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validate the current step
  const validateCurrentStep = (): boolean => {
    if (currentStep === 'select-type') {
      if (!formData.bookingType) {
        toast.error('Please select a booking type (Tour or Event)');
        return false;
      }
      if (!formData.itemId) {
        toast.error(`Please select a ${formData.bookingType}`);
        return false;
      }
      return true;
    }
    
    if (currentStep === 'trip-details') {
      if (!formData.date) {
        toast.error('Please select a date');
        return false;
      }
      if (formData.adults < 1) {
        toast.error('At least one adult is required');
        return false;
      }
      return true;
    }
    
    if (currentStep === 'personal-info') {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!formData.email) {
        toast.error('Please enter your email address');
        return false;
      }
      if (!formData.email.includes('@')) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!formData.agreeToTerms) {
        toast.error('Please agree to the terms and conditions');
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    // Process the booking
    try {
      setBookingError(null);
      setIsSavingBooking(true);
      
      // Get the selected item
      const selectedItem = formData.bookingType === 'tour' 
        ? availableTours.find(tour => tour.id === formData.itemId)
        : availableEvents.find(event => event.id === formData.itemId);
      
      if (!selectedItem) {
        throw new Error(`Selected ${formData.bookingType} not found`);
      }
      
      // Calculate total price
      const adultPrice = selectedItem.price;
      const childPrice = selectedItem.price * 0.6; // 60% of adult price for children
      const totalAmount = (adultPrice * formData.adults) + (childPrice * formData.children);
      
      // Generate booking reference
      const bookingReference = `UE-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create booking object
      const bookingData = {
        // Only include user_id if user is logged in
        ...(user?.id ? { user_id: user.id } : {}),
        booking_reference: bookingReference,
        booking_date: new Date().toISOString(),
        travel_date: new Date(formData.date).toISOString(),
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        [formData.bookingType === 'tour' ? 'tour_id' : 'event_id']: formData.itemId,
        total_price: totalAmount,
        total_amount: totalAmount,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        adults: formData.adults,
        children: formData.children,
        special_requests: formData.specialRequests || undefined
      };
      
      console.log("Submitting booking:", bookingData);
      
      // Create the booking
      const booking = await bookingsService.createBooking(bookingData);

      if (!booking) {
        throw new Error('Failed to create booking');
      }
      
      if (booking.id === 'error') {
        // Show error but still show the user their reference in case it was actually created
        console.error("Error creating booking but providing reference:", booking);
        console.error("Error details:", booking.error_details);
        setBookingReference(booking.booking_reference);
        setBookingError(`There was an issue saving your booking. Please note your booking reference: ${booking.booking_reference} and contact support. Error details: ${booking.error_details}`);
        toast.error(`Booking error: ${booking.error_details || 'Unknown error'}`);
        
        // Still move to confirmation step so user can see their reference
        setCurrentStep('confirmation');
        if (!completedSteps.includes('personal-info')) {
          setCompletedSteps([...completedSteps, 'personal-info']);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Set booking reference for confirmation
      setBookingReference(booking.booking_reference);
      
      // Check if it's a successful booking with a real ID (not a fallback)
      if (booking.id && booking.id !== 'pending' && booking.id !== 'fallback') {
        console.log("Booking created successfully with id:", booking.id);
        toast.success('Booking created successfully!');
      } else {
        console.warn("Booking may not have been fully processed:", booking);
        toast.success('Booking reference created. Please save your reference number!');
      }
      
      // Move to confirmation step
      setCurrentStep('confirmation');
      if (!completedSteps.includes('personal-info')) {
        setCompletedSteps([...completedSteps, 'personal-info']);
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      setBookingError('Failed to create booking. Please try again. If the problem persists, please contact support.');
      toast.error('Error submitting booking. Please try again.');
    } finally {
      setIsSavingBooking(false);
    }
  };

  // Get the selected item details
  const getSelectedItem = (): FeaturedItem | null => {
    if (!formData.bookingType || !formData.itemId) return null;
    
    return formData.bookingType === 'tour'
      ? availableTours.find(tour => tour.id === formData.itemId) || null
      : availableEvents.find(event => event.id === formData.itemId) || null;
  };
  
  // Calculate the total price
  const calculateTotalPrice = (): number => {
    const selectedItem = getSelectedItem();
    if (!selectedItem) return 0;
    
    const adultPrice = selectedItem.price;
    const childPrice = selectedItem.price * 0.6; // 60% of adult price for children
    
    return (adultPrice * formData.adults) + (childPrice * formData.children);
  };

  // Get available destinations based on selected booking type
  const getAvailableDestinations = (): { value: string; label: string }[] => {
    if (!formData.bookingType) return [];
    
    const items = formData.bookingType === 'tour' ? availableTours : availableEvents;
    const uniqueLocations = [...new Set(items.map(item => item.location))];
    
    return [
      { value: '', label: 'Select a destination' },
      ...uniqueLocations.map(location => ({ value: location, label: location }))
    ];
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-24 md:pt-36 pb-20 md:pb-32 bg-brand-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white font-display">
              Book Your <span className="text-accent-400">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the beauty of Tanzania with our carefully curated tours and events. 
              Complete your booking in just a few simple steps.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <Section>
        <div className="max-w-5xl mx-auto">
          {/* Booking Progress */}
          <div className="mb-10">
            <Stepper 
              steps={bookingSteps.map(step => ({ 
                id: step.id, 
                label: step.label,
                completed: completedSteps.includes(step.id)
              }))} 
              currentStep={currentStep}
            />
          </div>

          {/* Booking Form Content */}
          <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Booking Type Selection */}
              {currentStep === 'select-type' && (
                <BookingTypeSelector
                  formData={formData}
                  availableTours={availableTours}
                  availableEvents={availableEvents}
                  loading={loading}
                  onBookingTypeSelect={handleBookingTypeSelect}
                  onItemSelect={handleItemSelect}
                />
              )}
              
              {/* Step 2: Trip Details */}
              {currentStep === 'trip-details' && (
                <BookingDetails
                  formData={formData}
                  selectedItem={getSelectedItem()}
                  destinations={getAvailableDestinations()}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onNumberChange={handleNumberChange}
                />
              )}
              
              {/* Step 3: Personal Information */}
              {currentStep === 'personal-info' && (
                <PersonalInfoForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  bookingError={bookingError}
                />
              )}
              
              {/* Step 4: Confirmation */}
              {currentStep === 'confirmation' && (
                <BookingConfirmation
                  bookingReference={bookingReference}
                  formData={formData}
                  selectedItem={getSelectedItem()}
                  totalPrice={calculateTotalPrice()}
                />
              )}
              
              {/* Navigation Buttons */}
              {currentStep !== 'confirmation' && (
                <div className="flex justify-between mt-10">
                  {currentStep !== 'select-type' ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handlePrevStep}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                  ) : (
                    <div></div> // Empty div to maintain flex spacing
                  )}
                  
                  {currentStep === 'personal-info' ? (
                    <Button
                      type="submit"
                      variant="accent"
                      disabled={isSavingBooking}
                    >
                      {isSavingBooking ? 'Processing...' : 'Complete Booking'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="accent"
                      onClick={handleNextStep}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Booking Summary */}
          {(currentStep === 'trip-details' || currentStep === 'personal-info') && (
            <BookingSummary
              selectedItem={getSelectedItem()}
              adults={formData.adults}
              children={formData.children}
              totalPrice={calculateTotalPrice()}
            />
          )}

          {/* Additional Information */}
          {currentStep !== 'confirmation' && (
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
              <h3 className="text-lg font-bold text-brand-800 mb-4">Important Information</h3>
              
              <FeatureList
                features={[
                  { text: 'A 20% deposit is required to secure your booking' },
                  { text: 'Free cancellation up to 14 days before the trip date' },
                  { text: 'Children under 5 years may require special arrangements' },
                  { text: 'We\'ll send detailed information about what to bring after booking' }
                ]}
                variant="card"
                className="mb-6"
              />
              
              <div className="mt-6 flex items-center">
                <div className="bg-brand-100 p-2 rounded-full mr-4">
                  <CreditCard className="w-6 h-6 text-brand-700" />
                </div>
                <p className="text-sm text-dark-600">
                  Secure payment processing. We accept major credit cards and mobile payments.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
};

export default BookNow;