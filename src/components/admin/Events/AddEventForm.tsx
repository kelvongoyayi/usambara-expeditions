import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { eventsService, Event } from '../../../services/events.service';
import BasicInfoStep from './Steps/BasicInfoStep';
import ImagesStep from './Steps/ImagesStep';
import DetailsStep from './Steps/DetailsStep';
import ScheduleStep from './Steps/ScheduleStep';
import FAQsStep from './Steps/FAQsStep';
import PricingStep from './Steps/PricingStep';
import { toast } from 'react-hot-toast';
import useMediaUploader from '../../../hooks/useMediaUploader';

// Define form steps
type FormStep = 'basic' | 'images' | 'details' | 'pricing' | 'schedule' | 'faqs';

const steps = [
  { id: 'basic' as FormStep, label: 'Basic Information', description: 'Enter the essential details about your event' },
  { id: 'images' as FormStep, label: 'Images', description: 'Upload appealing images for your event' },
  { id: 'details' as FormStep, label: 'Details', description: 'Set highlights, inclusions, and exclusions' },
  { id: 'pricing' as FormStep, label: 'Pricing', description: 'Set pricing and capacity details' },
  { id: 'schedule' as FormStep, label: 'Schedule', description: 'Add daily schedule and activities' },
  { id: 'faqs' as FormStep, label: 'FAQs', description: 'Add common questions and answers' }
];

const AddEventForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [eventTypes, setEventTypes] = useState<{id: string; name: string}[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for event data
  const [event, setEvent] = useState<Partial<Event>>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    event_type: '',
    location: '',
    start_date: '',
    end_date: '',
    duration: '',
    rating: 4.5,
    featured: false,
    min_attendees: 10,
    max_attendees: 100,
    image_url: '',
    gallery: [],
    highlights: [],
    included: [],
    excluded: [],
    itinerary: [],
    faqs: []
  });

  // Additional state for form arrays
  const [highlights, setHighlights] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);

  // Use media uploader hook for image management
  const { 
    imagePreview,
    galleryPreview,
    uploading,
    progress,
    handleMainImageUpload: uploadMainImage,
    handleGalleryImageUpload: uploadGalleryImage,
    removeGalleryImage: removeGallery,
    resetMainImage: resetMain,
    handleAddImageUrl,
    handleAddGalleryUrl,
    setImageUrlInput,
    setGalleryUrlInput,
    imageUrlInput,
    galleryUrlInput
  } = useMediaUploader({ 
    bucketName: 'events' 
  });

  // Wrap the media uploader functions to connect with form state
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadMainImage(e, setFieldValue);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadGalleryImage(e, setFieldValue, event.gallery || []);
  };

  const removeGalleryImage = (index: number) => {
    removeGallery(index, setFieldValue, event.gallery || []);
  };

  const resetMainImage = () => {
    resetMain(setFieldValue);
  };

  const handleImageUrl = () => {
    handleAddImageUrl(setFieldValue);
  };

  const handleGalleryUrl = () => {
    handleAddGalleryUrl(setFieldValue, event.gallery || []);
  };

  // Fetch event types when component mounts
  React.useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const types = await eventsService.getEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error('Error fetching event types:', error);
        toast.error('Failed to load event types. Using default values.');
        
        // Fallback to default event types
        setEventTypes([
          { id: 'corporate', name: 'Corporate Event' },
          { id: 'adventure', name: 'Adventure Event' },
          { id: 'education', name: 'Educational Program' },
          { id: 'festival', name: 'Festival' },
          { id: 'retreat', name: 'Retreat' },
          { id: 'seminar', name: 'Seminar' },
          { id: 'workshop', name: 'Workshop' },
        ]);
      }
    };

    fetchEventTypes();
  }, []);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'basic') {
      if (!event.title) newErrors.title = 'Event title is required';
      if (!event.description) newErrors.description = 'Description is required';
      if (!event.price && event.price !== 0) newErrors.price = 'Price is required';
      if (event.price !== undefined && Number(event.price) < 0) newErrors.price = 'Price must be 0 or greater';
      if (!event.event_type) newErrors.event_type = 'Event type is required';
      if (!event.location) newErrors.location = 'Location is required';
      if (!event.start_date) newErrors.start_date = 'Start date is required';
      if (!event.end_date) newErrors.end_date = 'End date is required';
      
      // Validate date range
      if (event.start_date && event.end_date) {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        if (endDate < startDate) {
          newErrors.end_date = 'End date must be after or equal to start date';
        }
      }
    }
    
    if (currentStep === 'images') {
      if (!event.image_url && !imagePreview) {
        newErrors.image_url = 'Main image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      const currentIndex = steps.findIndex(step => step.id === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id);
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Make sure required fields are defined
      if (!event.title || !event.description || event.price === undefined) {
        throw new Error('Required fields are missing');
      }
      
      // Generate a slug if one doesn't exist
      if (!event.slug && event.title) {
        event.slug = event.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Ensure numeric fields are properly formatted
      const numericFields = ['price', 'min_attendees', 'max_attendees', 'rating'];
      const eventData = { ...event } as Record<string, unknown>;
      
      numericFields.forEach(field => {
        if (eventData[field] !== undefined) {
          // Convert to number if it's a string
          if (typeof eventData[field] === 'string') {
            const parsed = parseFloat(eventData[field] as string);
            eventData[field] = !isNaN(parsed) ? parsed : null;
          }
        }
      });
      
      // Make sure we have an image_url, even if using the preview
      if (!eventData.image_url && imagePreview) {
        eventData.image_url = imagePreview;
      }
      
      // Add the form array data
      eventData.highlights = highlights.filter(item => item.trim() !== '');
      eventData.included = inclusions.filter(item => item.trim() !== '');
      eventData.excluded = exclusions.filter(item => item.trim() !== '');
      
      // Create the event
      const result = await eventsService.createEvent(eventData as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
      
      if (result) {
        toast.success('Event created successfully!');
        navigate('/admin/events');
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error: unknown) {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const setFieldValue = (name: string, value: string | number | boolean | string[] | any[]) => {
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep 
            formValues={{
              values: event as Event, 
              onChange: (name, value) => setFieldValue(name, value)
            }}
            eventTypes={eventTypes}
            errors={errors}
          />
        );
      case 'images':
        return (
          <ImagesStep 
            formData={event}
            errors={errors}
            imagePreview={imagePreview}
            galleryPreview={galleryPreview}
            uploading={uploading}
            progress={progress}
            handleMainImageUpload={handleMainImageUpload}
            handleGalleryImageUpload={handleGalleryImageUpload}
            removeGalleryImage={removeGalleryImage}
            resetMainImage={resetMainImage}
            handleAddImageUrl={handleImageUrl}
            handleAddGalleryUrl={handleGalleryUrl}
            imageUrlInput={imageUrlInput}
            galleryUrlInput={galleryUrlInput}
            setImageUrlInput={setImageUrlInput}
            setGalleryUrlInput={setGalleryUrlInput}
          />
        );
      case 'details':
        return (
          <DetailsStep 
            formData={event}
            errors={errors}
            handleChange={handleInputChange}
            highlights={highlights}
            inclusions={inclusions}
            exclusions={exclusions}
            setHighlights={setHighlights}
            setInclusions={setInclusions}
            setExclusions={setExclusions}
          />
        );
      case 'pricing':
        return (
          <PricingStep 
            event={event}
            setEvent={setEvent}
            errors={errors}
            isLoading={isSubmitting}
          />
        );
      case 'schedule':
        return (
          <ScheduleStep 
            formData={event}
            setFieldValue={setFieldValue}
            errors={errors}
          />
        );
      case 'faqs':
        return (
          <FAQsStep 
            formData={event}
            setFieldValue={setFieldValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Back to events button */}
      <button 
        onClick={() => navigate('/admin/events')}
        className="flex items-center text-gray-600 mb-4 hover:text-accent-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Back to events</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Step Progress Indicator - Updated UI */}
        <div className="mb-6 sm:mb-10">
          <div className="relative flex items-start justify-between overflow-x-auto pb-4 sm:pb-2">
            {/* Mobile step indicator (visible on small screens) */}
            <div className="block w-full text-center mb-2 sm:hidden">
              <span className="text-xs font-medium bg-accent-50 text-accent-600 rounded-full px-3 py-1 border border-accent-100">
                Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
              </span>
            </div>
            
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center min-w-[70px]">
                  {/* Step Marker and Connection */}
                  <div className="relative flex items-center w-full justify-center">
                    {/* Left Connecting Line (not for first item) */}
                    {index > 0 && (
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1 ${isCompleted || isActive ? 'bg-accent-600' : 'bg-gray-200'}`}></div>
                    )}
                    
                    {/* Step Circle */}
                    <div 
                      className={`
                        relative z-10 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 ease-in-out
                        ${isActive 
                          ? 'bg-accent-600 text-white ring-2 sm:ring-4 ring-accent-100' 
                          : isCompleted 
                            ? 'bg-accent-600 text-white' 
                            : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-accent-300'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      ) : (
                        <span className="text-xs sm:text-sm md:text-base font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Right Connecting Line (not for last item) */}
                    {index < steps.length - 1 && (
                      <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1 ${isCompleted ? 'bg-accent-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>

                  {/* Step Label - hidden on small mobile, visible on larger screens */}
                  <div className="mt-1 sm:mt-2 text-center px-1">
                    <div 
                      className={`
                        font-semibold text-[10px] sm:text-xs md:text-sm truncate
                        ${isActive 
                          ? 'text-accent-600' 
                          : isCompleted 
                            ? 'text-accent-600' 
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Improve the header area for mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              Create New Event
            </h1>
            <div className="hidden sm:block text-sm font-medium text-accent-600">
              Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}: {steps.find(s => s.id === currentStep)?.label}
            </div>
          </div>
        </div>

        {/* Current Step Content - Match Tour form design */}
        <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
          {renderStepContent()}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 sm:p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <div className="font-bold mb-1">Error:</div>
            <div>{errors.submit}</div>
            <div className="mt-2 text-xs">
              Please try again or contact support if the problem persists.
            </div>
          </div>
        )}

        {/* Navigation Buttons - match Tour form design */}
        <div className="flex justify-between pt-4 sm:pt-6 border-t">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 'basic' || isSubmitting}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-accent-600 px-2 sm:px-3 md:px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sm:inline">Previous</span>
          </button>
          
          <div className="flex gap-2 sm:gap-3">
            {currentStep === 'faqs' ? (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-1 sm:gap-2 bg-accent-600 hover:bg-accent-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm text-xs sm:text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="inline">Create Event</span>
                  </>
                )}
              </button>
            ) : (
              <button 
                type="button"
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="flex items-center gap-1 sm:gap-2 bg-accent-600 hover:bg-accent-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm text-xs sm:text-sm md:text-base"
              >
                <span className="inline">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Help section - Keep simplified version */}
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating an Engaging Event</h3>
          <p className="text-gray-600 mb-4">Tips for creating successful events that attract participants:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs mr-2 mt-0.5">Tip</span>
              <p className="text-gray-700">Set clear dates and include detailed schedule information</p>
            </div>
            <div className="flex items-start">
              <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs mr-2 mt-0.5">Tip</span>
              <p className="text-gray-700">Specify what's included in the event fee to set proper expectations</p>
            </div>
            <div className="flex items-start">
              <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs mr-2 mt-0.5">Tip</span>
              <p className="text-gray-700">Upload high-quality images that showcase the venue and activities</p>
            </div>
            <div className="flex items-start">
              <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs mr-2 mt-0.5">Tip</span>
              <p className="text-gray-700">Address common questions in the FAQ section to reduce inquiries</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm; 