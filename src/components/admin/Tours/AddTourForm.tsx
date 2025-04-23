import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { toursService } from '../../../services/tours.service';
import BasicInfoStep from './Steps/BasicInfoStep';
import ImagesStep from './Steps/ImagesStep';
import ItineraryStep from './Steps/ItineraryStep';
import InclusionsStep from './Steps/InclusionsStep';
import { toast } from 'react-hot-toast';

// Define Tour type here to avoid circular imports
interface Tour {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category?: string;
  location?: string;
  duration?: number | string;
  min_group_size?: number;
  max_group_size?: number;
  difficulty?: string;
  best_season?: string;
  accommodation_type?: string;
  status?: string;
  featured?: boolean;
  start_location?: string;
  end_location?: string;
  image_url?: string;  // Main image URL
  gallery?: string[];  // Gallery image URLs
  highlights?: string[];
  requirements?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: Array<{
    id?: string;
    day_number: number;
    title: string;
    description: string;
    location?: string;
    distance?: string;
    difficulty?: string;
    accommodation?: string;
    meals?: string[] | string; // Accept both string and string[] for compatibility
    activities?: string[];
  }>;
  rating?: number;
}

// Define FormErrors type inline
type FormErrors<T> = Record<keyof T | string, string>;

type FormStep = 'basic' | 'images' | 'itinerary' | 'inclusions';

const steps = [
  { id: 'basic' as FormStep, label: 'Basic Information', description: 'Enter the essential details about your tour' },
  { id: 'images' as FormStep, label: 'Images', description: 'Upload appealing images for your tour' },
  { id: 'itinerary' as FormStep, label: 'Itinerary', description: 'Create a detailed day-by-day itinerary' },
  { id: 'inclusions' as FormStep, label: 'Inclusions & Exclusions', description: 'Specify what is included and excluded in the tour' }
];

const AddTourForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [tour, setTour] = useState<Tour>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    duration: '',
    category: '',
    location: '',
    min_group_size: 2,
    max_group_size: 15,
    difficulty: 'moderate',
    rating: 0,
    status: 'draft',
    featured: false,
    image_url: '',
    gallery: [],
    highlights: [],
    included: [],
    excluded: [],
    requirements: [],
    itinerary: []
  });
  const [errors, setErrors] = useState<FormErrors<Tour>>({});

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors<Tour> = {};

    if (currentStep === 'basic') {
      if (!tour.title) newErrors.title = 'Tour title is required';
      if (!tour.description) newErrors.description = 'Description is required';
      if (!tour.price) newErrors.price = 'Price is required';
      if (tour.price !== undefined && tour.price <= 0) newErrors.price = 'Price must be greater than 0';
      if (!tour.duration) newErrors.duration = 'Duration is required';
      if (typeof tour.duration === 'number' && tour.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
      if (!tour.category) newErrors.category = 'Category is required';
      if (!tour.location) newErrors.location = 'Location is required';
    }
    
    if (currentStep === 'images') {
      if (!tour.image_url) {
        console.warn('No main image provided - this is allowed but not recommended');
      }
    }

    if (currentStep === 'itinerary') {
      if (!tour.itinerary || tour.itinerary.length === 0) {
        newErrors.itinerary = 'Please add at least one day to your itinerary';
      } else {
        tour.itinerary.forEach((day, index) => {
          if (!day.title || !day.title.trim()) {
            newErrors[`itinerary[${index}].title`] = `Day ${index + 1} requires a title`;
          }
          if (!day.description || !day.description.trim()) {
            newErrors[`itinerary[${index}].description`] = `Day ${index + 1} requires a description`;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (validateCurrentStep()) {
      const currentIndex = steps.findIndex(step => step.id === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id);
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      if (!tour.title || !tour.description || tour.price === undefined) {
        throw new Error('Required fields are missing');
      }
      
      // Generate a slug if one doesn't exist
      if (!tour.slug && tour.title) {
        tour.slug = tour.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Ensure numeric fields are properly formatted
      const numericFields = ['price', 'min_group_size', 'max_group_size'];
      const tourData: any = { ...tour };
      
      numericFields.forEach(field => {
        if (tourData[field] !== undefined) {
          // Convert to number if it's a string
          if (typeof tourData[field] === 'string') {
            const parsed = parseFloat(tourData[field]);
            tourData[field] = !isNaN(parsed) ? parsed : null;
          }
        }
      });
      
      // Ensure arrays are properly formatted
      const arrayFields = ['included', 'excluded', 'highlights', 'requirements'];
      arrayFields.forEach(field => {
        // Make sure the field exists and is an array
        if (!Array.isArray(tourData[field])) {
          tourData[field] = [];
        }
        
        // Filter out empty strings
        if (Array.isArray(tourData[field])) {
          tourData[field] = tourData[field].filter((item: any) => 
            item && (typeof item === 'string' ? item.trim() : true)
          );
        }
      });
      
      // Ensure we have required default values
      const tourWithDefaults = {
        ...tourData,
        rating: tourData.rating || 0,
        featured: typeof tourData.featured === 'boolean' ? tourData.featured : false,
        status: tourData.status || 'draft',
        image_url: tourData.image_url || '', // Empty string as fallback
        description: tourData.description.trim(),
        title: tourData.title.trim(),
      };
      
      // Format itinerary data properly
      let formattedItinerary: any[] = [];
      if (Array.isArray(tourWithDefaults.itinerary) && tourWithDefaults.itinerary.length > 0) {
        formattedItinerary = tourWithDefaults.itinerary.map((day: any, index: number) => {
          // Process meals to ensure it's always an array of strings
          let formattedMeals: string[] = [];
          if (Array.isArray(day.meals)) {
            formattedMeals = day.meals.filter(Boolean) as string[];
          } else if (typeof day.meals === 'string' && day.meals.trim()) {
            formattedMeals = day.meals.split(',').map((m: string) => m.trim()).filter(Boolean);
          }
          
          return {
            day: day.day_number || index + 1, // Required field for database
            day_number: day.day_number || index + 1, 
            title: day.title || `Day ${index + 1}`,
            description: day.description || '',
            activities: Array.isArray(day.activities) ? day.activities.filter(Boolean) : [],
            meals: formattedMeals,
            accommodation: day.accommodation || '',
            distance: day.distance || '',
            elevation: day.elevation || '',
            location: day.location || ''
          };
        });
      }
      
      // Prepare the final tour data with properly formatted itinerary
      const finalTourData = {
        ...tourWithDefaults,
        itinerary: formattedItinerary
      };
      
      console.log('Submitting tour data:', JSON.stringify(finalTourData, null, 2));
      
      // Create the tour in the database
      const result = await toursService.createTour(finalTourData as any);
      
      if (result) {
        toast.success('Tour created successfully!');
        navigate('/admin/tours');
      } else {
        throw new Error('Failed to create tour');
      }
    } catch (error: any) {
      console.error('Error creating tour:', error);
      // Extract more detailed error information if available
      const errorMessage = error.message || 'Failed to create tour';
      const detailedError = error.error ? `${errorMessage}: ${JSON.stringify(error.error)}` : errorMessage;
      
      toast.error(detailedError);
      setErrors({ submit: detailedError });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValueChange = useCallback((field: keyof Tour, value: any) => {
    setTour((prev: Tour) => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep 
            formValues={tour}
            onChange={setTour}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'images':
        return (
          <ImagesStep 
            formValues={tour}
            onChange={setTour}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'itinerary':
        return (
          <ItineraryStep 
            formValues={tour}
            onChange={setTour}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'inclusions':
        return (
          <InclusionsStep 
            tour={tour as Partial<Tour>}
            setTour={setTour as React.Dispatch<React.SetStateAction<Partial<Tour>>>}
            errors={errors}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back to tours button */}
      <button 
        onClick={() => navigate('/admin/tours')}
        className="flex items-center text-gray-600 mb-6 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Back to tours</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Step Progress Indicator - Updated UI */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Create New Tour</h1>
            <div className="text-sm font-medium text-brand-600">Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}: {steps.find(s => s.id === currentStep)?.label}</div>
          </div>
          
          {/* Steps Container */}
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center">
                  {/* Step Marker and Connection */}
                  <div className="relative flex items-center w-full justify-center">
                    {/* Left Connecting Line (not for first item) */}
                    {index > 0 && (
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1 ${isCompleted || isActive ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                    )}
                    
                    {/* Step Circle */}
                    <div 
                      className={`
                        relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-in-out
                        ${isActive 
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100' 
                          : isCompleted 
                            ? 'bg-brand-600 text-white' 
                            : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-brand-300'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-lg font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Right Connecting Line (not for last item) */}
                    {index < steps.length - 1 && (
                      <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1 ${isCompleted ? 'bg-brand-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>

                  {/* Step Label & Description */}
                  <div className="mt-3 text-center px-2">
                    <div 
                      className={`
                        font-semibold text-sm md:text-base
                        ${isActive 
                          ? 'text-brand-600' 
                          : isCompleted 
                            ? 'text-brand-600' 
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step.label}
                    </div>
                    {/* Optional: Hide description on mobile or for non-active steps */}
                    {/* <p className={`hidden sm:block text-xs mt-1 text-gray-400 ${!isActive && 'sm:hidden'}`}>{step.description}</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content - Removed gray wrapper */}
        <div /* className="bg-gray-50 p-4 sm:p-6 rounded-xl" */ >
          {renderStepContent()}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <div className="font-bold mb-1">Error:</div>
            <div>{errors.submit}</div>
            <div className="mt-2 text-xs">
              Please try again. If the problem persists, try the following:
              <ul className="list-disc pl-5 mt-1">
                <li>Check that all required fields are filled correctly</li>
                <li>Try uploading a smaller image or using an image URL</li>
                <li>Simplify your tour details and try again</li>
                <li>Contact support if the issue continues</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 'basic' || isSubmitting}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-600 px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <div className="flex gap-3">
            {currentStep === 'inclusions' ? (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Tour
                  </>
                )}
              </button>
            ) : (
              <button 
                type="button"
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTourForm; 