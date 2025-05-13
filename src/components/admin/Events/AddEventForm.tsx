import React, { useState, useEffect } from 'react';
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
type FormStep = 'basic' | 'images' | 'details' | 'schedule' | 'faqs' | 'pricing' | 'review';

// Default values for form initialization
const defaultFormData: Partial<Event> = {
  title: '',
  description: '',
  event_type: '',
  start_date: '',
  end_date: '',
  time: '',
  location: '',
  price: 0,
  image_url: '',
  gallery: [],
  highlights: [],
  included: [],
  excluded: [],
  itinerary: [],
  faqs: [],
  duration: '',
  destination_id: '',
  min_attendees: 10,
  max_attendees: 100,
  featured: false
};

const AddEventForm: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Event>>(defaultFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypes, setEventTypes] = useState<{id: string; name: string}[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Arrays for detail step
  const [highlights, setHighlights] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  
  // Media upload functionality using custom hook
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
    await uploadMainImage(e);
    if (imagePreview) {
      setFormData(prev => ({ ...prev, image_url: imagePreview }));
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadGalleryImage(e);
    if (galleryPreview.length > 0) {
      setFormData(prev => ({ ...prev, gallery: galleryPreview }));
    }
  };

  const removeGalleryImage = (index: number) => {
    removeGallery(index);
    setFormData(prev => {
      const updatedGallery = [...(prev.gallery || [])];
      updatedGallery.splice(index, 1);
      return { ...prev, gallery: updatedGallery };
    });
  };

  const resetMainImage = () => {
    resetMain();
    setFormData(prev => ({ ...prev, image_url: '' }));
  };
  
  // Fetch event types on component mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      const types = await eventsService.getEventTypes();
      setEventTypes(types);
    };
    
    fetchEventTypes();
  }, []);
  
  // Update form arrays when detail components change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      highlights,
      included: inclusions,
      excluded: exclusions
    }));
  }, [highlights, inclusions, exclusions]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when it's edited
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Set a specific field value from a step component
  const setFieldValue = (name: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when it's updated
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  // Validate the current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Basic step validation
    if (currentStep === 'basic') {
      if (!formData.title?.trim()) newErrors.title = "Event title is required";
      if (!formData.description?.trim()) newErrors.description = "Description is required";
      if (!formData.event_type) newErrors.event_type = "Event type is required";
      if (!formData.location?.trim()) newErrors.location = "Location is required";
      if (!formData.start_date) newErrors.start_date = "Start date is required";
      if (!formData.price && formData.price !== 0) newErrors.price = "Price is required";
    }
    
    // Images step validation
    else if (currentStep === 'images') {
      if (!formData.image_url) newErrors.image_url = "Main image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (!validateStep()) return;
    
    const steps: FormStep[] = ['basic', 'images', 'details', 'schedule', 'faqs', 'pricing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    const steps: FormStep[] = ['basic', 'images', 'details', 'schedule', 'faqs', 'pricing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };
  
  // Create a slug from the title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Final validation across all fields
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) newErrors.title = "Event title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.event_type) newErrors.event_type = "Event type is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    if (!formData.price && formData.price !== 0) newErrors.price = "Price is required";
    if (!formData.image_url) newErrors.image_url = "Main image is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a slug if not provided
      if (!formData.slug && formData.title) {
        formData.slug = createSlug(formData.title);
      }
      
      // Ensure arrays are properly set
      const eventData: Partial<Event> = {
        ...formData,
        highlights: highlights.filter(Boolean),
        included: inclusions.filter(Boolean),
        excluded: exclusions.filter(Boolean),
        gallery: galleryPreview
      };
      
      const result = await eventsService.createEvent(eventData as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
      
      if (result) {
        toast.success("Event created successfully!");
        navigate('/admin/events');
      } else {
        toast.error("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred while creating the event");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep 
            formValues={{
              values: formData,
              onChange: setFieldValue,
            }}
            eventTypes={eventTypes}
            errors={errors}
          />
        );
        
      case 'images':
        return (
          <ImagesStep 
            formData={formData}
            errors={errors}
            imagePreview={imagePreview}
            galleryPreview={galleryPreview}
            uploading={uploading}
            progress={progress}
            handleMainImageUpload={handleMainImageUpload}
            handleGalleryImageUpload={handleGalleryImageUpload}
            removeGalleryImage={removeGalleryImage}
            resetMainImage={resetMainImage}
            handleAddImageUrl={handleAddImageUrl}
            handleAddGalleryUrl={handleAddGalleryUrl}
            setImageUrlInput={setImageUrlInput}
            setGalleryUrlInput={setGalleryUrlInput}
            imageUrlInput={imageUrlInput}
            galleryUrlInput={galleryUrlInput}
          />
        );
        
      case 'details':
        return (
          <DetailsStep 
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            highlights={highlights}
            inclusions={inclusions}
            exclusions={exclusions}
            setHighlights={setHighlights}
            setInclusions={setInclusions}
            setExclusions={setExclusions}
          />
        );
        
      case 'schedule':
        return (
          <ScheduleStep 
            formData={formData}
            setFieldValue={setFieldValue}
            errors={errors}
          />
        );
        
      case 'faqs':
        return (
          <FAQsStep 
            formData={formData}
            setFieldValue={setFieldValue}
          />
        );
        
      case 'pricing':
        return (
          <PricingStep 
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
        );
        
      case 'review':
        return (
          <div className="space-y-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Review Event Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Basic Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Event Type:</strong> {eventTypes.find(t => t.id === formData.event_type)?.name}</p>
                    <p><strong>Dates:</strong> {formData.start_date} to {formData.end_date}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Base Price:</strong> {formData.price} TZS</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Event Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p><strong>Highlights:</strong> {highlights.length} items</p>
                    <p><strong>Inclusions:</strong> {inclusions.length} items</p>
                    <p><strong>Exclusions:</strong> {exclusions.length} items</p>
                    <p><strong>FAQs:</strong> {formData.faqs?.length || 0} items</p>
                    <p><strong>Schedule Days:</strong> {formData.itinerary?.length || 0} days</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Event Images</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4">
                  {formData.image_url && (
                    <div className="relative">
                      <img 
                        src={formData.image_url} 
                        alt="Main event" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 bg-accent-600 text-white text-xs px-2 py-1 rounded-full">Main</span>
                    </div>
                  )}
                  
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {formData.gallery.slice(0, 3).map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`Gallery ${i+1}`} 
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                      {formData.gallery.length > 3 && (
                        <div className="w-24 h-24 flex items-center justify-center bg-accent-50 text-accent-600 rounded-lg">
                          +{formData.gallery.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-accent-600 hover:bg-accent-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Function to get step number (for progress indicator)
  const getStepNumber = (): number => {
    const steps: FormStep[] = ['basic', 'images', 'details', 'schedule', 'faqs', 'pricing', 'review'];
    return steps.indexOf(currentStep) + 1;
  };
  
  return (
    <div className="w-full mx-auto space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/events')}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Step {getStepNumber()} of 7
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-600 rounded-full transition-all duration-300"
              style={{ width: `${(getStepNumber() / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <h1 className="text-lg font-semibold text-gray-900">Create New Event</h1>
          <p className="mt-1 text-sm text-gray-600">Fill out the form step by step to create a new event.</p>
        </div>
        
        {/* Current Step */}
        <div className="bg-white">
          {renderStep()}
        </div>
        
        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${
              currentStep === 'basic' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentStep === 'basic'}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          {currentStep !== 'review' ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEventForm; 