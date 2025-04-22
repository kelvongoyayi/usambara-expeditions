import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, ArrowRight, AlertCircle, ChevronRight
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { eventsService } from '../../../services/events.service';
import { Event } from '../../../services/events.service';
import toast from 'react-hot-toast';

// Import shared components
import FormStepper from '../../../components/admin/Tours/FormComponents/FormStepper';
import MediaUploader from '../../../components/admin/shared/MediaUploader';
import ArrayItemsEditor from '../../../components/admin/shared/ArrayItemsEditor';
import ItineraryEditor from '../../../components/admin/shared/ItineraryEditor';
import FAQItemEditor from '../../../components/admin/shared/FAQItemEditor';

// Import step components
import BasicInfoStep from '../../../components/admin/Events/Steps/BasicInfoStep';

// Import custom hooks
import useFormFields from '../../../hooks/useFormFields';
import useMediaUploader from '../../../hooks/useMediaUploader';
import useItineraryEditor from '../../../hooks/useItineraryEditor';
import useFaqEditor from '../../../hooks/useFaqEditor';

const EditEvent: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [eventTypes, setEventTypes] = useState<{id: string; name: string}[]>([]);
  const [loadingEventTypes, setLoadingEventTypes] = useState(true);
  
  // State for form steps
  const formSteps = [
    { id: 'basic-info', name: 'Basic Info', description: 'Event details and pricing' },
    { id: 'images', name: 'Images', description: 'Upload event images' },
    { id: 'details', name: 'Details', description: 'Features and requirements' },
    { id: 'itinerary', name: 'Itinerary', description: 'Day by day schedule' },
    { id: 'faqs', name: 'FAQs', description: 'Frequently asked questions' }
  ];
  
  const [currentStep, setCurrentStep] = useState(formSteps[0].id);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Use form fields hook for form state management
  const { 
    values: formData, 
    setValues: setFormData,
    errors,
    setErrors,
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    setFieldValue
  } = useFormFields<Partial<Event>>([
    { name: 'title', initialValue: '', required: true },
    { name: 'slug', initialValue: '' },
    { name: 'event_type', initialValue: '', required: true },
    { name: 'description', initialValue: '', required: true },
    { name: 'location', initialValue: '', required: true },
    { name: 'price', initialValue: 0, required: true },
    { name: 'rating', initialValue: 4.5 },
    { name: 'featured', initialValue: false },
    { name: 'image_url', initialValue: '', required: true },
    { name: 'start_date', initialValue: '', required: true },
    { name: 'end_date', initialValue: '', required: true },
    { name: 'duration', initialValue: '' },
    { name: 'min_attendees', initialValue: 10 },
    { name: 'max_attendees', initialValue: 100 },
    { name: 'highlights', initialValue: [''] },
    { name: 'included', initialValue: [''] },
    { name: 'excluded', initialValue: [''] },
    { name: 'gallery', initialValue: [] }
  ]);
  
  // Use media uploader hook for image management
  const { 
    imagePreview,
    galleryPreview,
    imageUrlInput,
    setImageUrlInput,
    galleryUrlInput,
    setGalleryUrlInput,
    uploading,
    progress,
    handleMainImageUpload: handleRawMainImageUpload,
    handleGalleryImageUpload: handleRawGalleryImageUpload,
    removeGalleryImage: handleRawGalleryImageRemove,
    resetMainImage: handleRawMainImageReset,
    handleAddImageUrl: handleRawAddImageUrl,
    handleAddGalleryUrl: handleRawAddGalleryUrl,
    setInitialValues: setMediaInitialValues
  } = useMediaUploader({ bucketName: 'images' });  // Use the generic images bucket
  
  // Use itinerary editor hook
  const { 
    itinerary, 
    setItinerary,
    addItineraryDay,
    removeItineraryDay,
    handleItineraryChange,
    addItineraryActivity,
    removeItineraryActivity,
    handleItineraryActivityChange,
    handleMealToggle
  } = useItineraryEditor();
  
  // Use FAQ editor hook
  const {
    faqs,
    setFaqs,
    addFaq,
    removeFaq,
    handleFaqChange
  } = useFaqEditor();
  
  // Wrapper functions to connect media uploader to form state
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => 
    handleRawMainImageUpload(e, setFieldValue);
  
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => 
    handleRawGalleryImageUpload(e, setFieldValue, formData.gallery || []);
  
  const handleGalleryImageRemove = (index: number) => 
    handleRawGalleryImageRemove(index, setFieldValue, formData.gallery || []);
  
  const handleMainImageReset = () => 
    handleRawMainImageReset(setFieldValue);
  
  const handleAddImageUrl = () => 
    handleRawAddImageUrl(setFieldValue);
  
  const handleAddGalleryUrl = () => 
    handleRawAddGalleryUrl(setFieldValue, formData.gallery || []);
    
  // Loading state for saving
  const [saving, setSaving] = useState(false);

  // Fetch event types on component mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoadingEventTypes(true);
      try {
        const eventTypesData = await eventsService.getEventTypes();
        setEventTypes(eventTypesData);
      } catch (error) {
        console.error('Error fetching event types:', error);
        // Fallback to default event types
        setEventTypes([
          { id: 'corporate', name: 'Corporate Event' },
          { id: 'adventure', name: 'Adventure Event' },
          { id: 'education', name: 'Educational Program' },
          { id: 'special', name: 'Special Occasion' }
        ]);
      } finally {
        setLoadingEventTypes(false);
      }
    };
    
    fetchEventTypes();
  }, []);

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      
      try {
        const event = await eventsService.getEventById(eventId);
        
        if (!event) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        // Set form data
        setFormData({
          ...event
        });
        
        // Set media previews
        setMediaInitialValues(event);
        
        // Set itinerary
        if (event.itinerary && event.itinerary.length > 0) {
          setItinerary(event.itinerary);
        }
        
        // Set FAQs
        if (event.faqs && event.faqs.length > 0) {
          setFaqs(event.faqs);
        } else {
          setFaqs([{ question: '', answer: '' }]);
        }
        
        // Mark all steps as completed
        setCompletedSteps(formSteps.map(step => step.id));
        
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setNotFound(true);
        toast.error('Failed to fetch event details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, setFormData, setMediaInitialValues, setItinerary, setFaqs]);

  // Form navigation
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 'basic-info') {
      if (!formData.title) newErrors.title = 'Event title is required';
      if (!formData.event_type) newErrors.event_type = 'Event type is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.start_date) newErrors.start_date = 'Start date is required';
      if (!formData.end_date) newErrors.end_date = 'End date is required';
      if (!formData.price && formData.price !== 0) newErrors.price = 'Price is required';
      
      // Handle missing slug
      if (!formData.slug) {
        // Auto-generate from title
        if (formData.title) {
          const slug = formData.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
          
          setFieldValue('slug', slug);
        } else {
          newErrors.slug = 'Slug is required';
        }
      }
      
      // Validate date range
      if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        if (endDate < startDate) {
          newErrors.end_date = 'End date must be after or equal to start date';
        }
      }
    }
    
    if (currentStep === 'images') {
      if (!formData.image_url && !imagePreview) {
        newErrors.image_url = 'Main image is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const goToNextStep = () => {
    if (!validateCurrentStep()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const currentIndex = formSteps.findIndex(step => step.id === currentStep);
    if (currentIndex < formSteps.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Move to next step
      setCurrentStep(formSteps[currentIndex + 1].id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPrevStep = () => {
    const currentIndex = formSteps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(formSteps[currentIndex - 1].id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleStepClick = (stepId: string) => {
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Calculate duration based on start and end dates
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      // Calculate the difference in days
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      setFieldValue('duration', `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`);
    }
  }, [formData.start_date, formData.end_date, setFieldValue]);
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Event title is required';
    if (!formData.event_type) newErrors.event_type = 'Event type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (!formData.price && formData.price !== 0) newErrors.price = 'Price is required';
    if (!formData.image_url && !imagePreview) newErrors.image_url = 'Main image is required';
    
    // Validate date range
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) {
        newErrors.end_date = 'End date must be after or equal to start date';
      }
    }
    
    // Auto-generate slug if missing
    if (!formData.slug && formData.title) {
      const slug = formData.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      setFieldValue('slug', slug);
    } else if (!formData.slug) {
      newErrors.slug = 'Slug is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // If we have errors, navigate to the earliest step that has an error
      if (newErrors.title || newErrors.event_type || newErrors.description || 
          newErrors.location || newErrors.start_date || newErrors.end_date || 
          newErrors.price || newErrors.slug) {
        setCurrentStep('basic-info');
        toast.error('Please fill in all required fields in Basic Information');
      } else if (newErrors.image_url) {
        setCurrentStep('images');
        toast.error('Please add a main image');
      }
      
      return;
    }
    
    setSaving(true);
    
    try {
      // Make sure we have an image_url, even if using the preview
      if (!formData.image_url && imagePreview) {
        setFieldValue('image_url', imagePreview);
      }
      
      // Clean array data (remove empty items)
      const cleanedData = {
        ...formData,
        highlights: formData.highlights?.filter(h => h.trim() !== '') || [],
        included: formData.included?.filter(i => i.trim() !== '') || [],
        excluded: formData.excluded?.filter(e => e.trim() !== '') || [],
      };
      
      // Prepare the event data with proper numeric conversions
      const eventData = {
        ...cleanedData,
        price: Number(cleanedData.price),
        rating: Number(cleanedData.rating),
        min_attendees: cleanedData.min_attendees ? Number(cleanedData.min_attendees) : undefined,
        max_attendees: cleanedData.max_attendees ? Number(cleanedData.max_attendees) : undefined,
        itinerary: itinerary.length > 0 ? itinerary : undefined,
        faqs: faqs.some(faq => faq.question && faq.answer) ? 
          faqs.filter(faq => faq.question && faq.answer) : undefined
      };
      
      if (!eventId) {
        throw new Error('Event ID is required');
      }
      
      const result = await eventsService.updateEvent(eventId, eventData as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
      
      if (result) {
        toast.success('Event updated successfully!');
        navigate('/admin/events');
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Render different form sections based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            eventTypes={eventTypes}
            loadingEventTypes={loadingEventTypes}
          />
        );
      case 'images':
        return (
          <MediaUploader
            title="Event Images"
            description="Add the main image and gallery images for this event"
            mainImage={imagePreview}
            galleryImages={galleryPreview}
            onMainImageUpload={handleMainImageUpload}
            onGalleryImageUpload={handleGalleryImageUpload}
            onRemoveMainImage={handleMainImageReset}
            onRemoveGalleryImage={handleGalleryImageRemove}
            uploading={uploading}
            progress={progress}
            errors={errors}
            urlInput={{
              main: imageUrlInput,
              setMain: setImageUrlInput,
              gallery: galleryUrlInput,
              setGallery: setGalleryUrlInput
            }}
            onAddMainImageUrl={handleAddImageUrl}
            onAddGalleryImageUrl={handleAddGalleryUrl}
          />
        );
      case 'details':
        return (
          <div>
            <ArrayItemsEditor
              title="Event Highlights"
              items={formData.highlights || ['']}
              onChange={(index, value) => handleArrayChange('highlights', index, value)}
              onAdd={() => addArrayItem('highlights')}
              onRemove={(index) => removeArrayItem('highlights', index)}
              placeholder="e.g. Professional team-building facilitators"
              className="mb-8"
            />
            
            <ArrayItemsEditor
              title="What's Included"
              items={formData.included || ['']}
              onChange={(index, value) => handleArrayChange('included', index, value)}
              onAdd={() => addArrayItem('included')}
              onRemove={(index) => removeArrayItem('included', index)}
              placeholder="e.g. Professional facilitation"
              className="mb-8"
            />
            
            <ArrayItemsEditor
              title="What's Not Included"
              items={formData.excluded || ['']}
              onChange={(index, value) => handleArrayChange('excluded', index, value)}
              onAdd={() => addArrayItem('excluded')}
              onRemove={(index) => removeArrayItem('excluded', index)}
              placeholder="e.g. Transportation to venue"
            />
          </div>
        );
      case 'itinerary':
        return (
          <ItineraryEditor
            itinerary={itinerary}
            onAddDay={addItineraryDay}
            onRemoveDay={removeItineraryDay}
            onChangeDay={handleItineraryChange}
            onAddActivity={addItineraryActivity}
            onRemoveActivity={removeItineraryActivity}
            onChangeActivity={handleItineraryActivityChange}
            onToggleMeal={handleMealToggle}
          />
        );
      case 'faqs':
        return (
          <FAQItemEditor
            faqs={faqs}
            onAddFaq={addFaq}
            onRemoveFaq={removeFaq}
            onChangeFaq={handleFaqChange}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Event Not Found
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The event you are trying to edit could not be found.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/events')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/events')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-sm text-gray-500">{formData.title}</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress bar and steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
          <div className="max-w-4xl mx-auto">
            <FormStepper
              steps={formSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={completedSteps}
            />
          </div>
        </div>
        
        {/* Form Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {renderStepContent()}
          
          {/* Step Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              disabled={currentStep === formSteps[0].id}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            {currentStep === formSteps[formSteps.length - 1].id ? (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                Save Event
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditEvent;