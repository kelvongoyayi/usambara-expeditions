import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Check, ChevronLeft, ChevronRight, Loader2, ArrowLeft 
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { toursService, Tour } from '../../../services/tours.service';
import toast from 'react-hot-toast';

// Import step components
import BasicInfoStep from '../../../components/admin/Tours/Steps/BasicInfoStep';
import ImagesStep from '../../../components/admin/Tours/Steps/ImagesStep';
import ItineraryStep from '../../../components/admin/Tours/Steps/ItineraryStep';
import InclusionsStep from '../../../components/admin/Tours/Steps/InclusionsStep';

// Types
type FormStep = 'basic' | 'images' | 'itinerary' | 'inclusions';
type FormErrors<T> = {
  [K in keyof T]?: string;
};

const steps = [
  { id: 'basic' as FormStep, label: 'Basic Information', description: 'Enter the essential details about your tour' },
  { id: 'images' as FormStep, label: 'Images', description: 'Upload appealing images for your tour' },
  { id: 'itinerary' as FormStep, label: 'Itinerary', description: 'Create a detailed day-by-day itinerary' },
  { id: 'inclusions' as FormStep, label: 'Inclusions & Exclusions', description: 'Specify what is included and excluded in the tour' }
];

const EditTour: React.FC = () => {
  const navigate = useNavigate();
  const { tourId: encodedTourId } = useParams<{ tourId: string }>();
  const tourId = encodedTourId ? decodeURIComponent(encodedTourId) : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  
  const [tour, setTour] = useState<Partial<Tour>>({
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

  // Fetch tour data on component mount
  useEffect(() => {
    const fetchTour = async () => {
      console.log("EditTour component - fetchTour initialized");
      
      if (!tourId) {
        console.error("Tour ID is missing from URL parameters");
        setNotFound(true);
        setIsLoading(false);
        toast.error('Tour ID is missing from URL');
        return;
      }

      console.log('Tour ID from URL params:', tourId, 'Type:', typeof tourId);
      
      try {
        console.log('Calling toursService.getTourById with ID:', tourId);
        const tourData = await toursService.getTourById(tourId);
        
        if (!tourData) {
          console.error('Tour not found for ID:', tourId);
          setNotFound(true);
          toast.error('Tour not found');
          setIsLoading(false);
          return;
        }
        
        console.log('Tour data loaded successfully:', tourData);
        
        // Set tour data
        setTour(tourData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchTour:', error);
        toast.error('Error loading tour data. Please try again.');
        setIsLoading(false);
      }
    };
    
    console.log('EditTour component - useEffect triggered, tourId:', tourId);
    fetchTour();
  }, [tourId]);

  // Form validation
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
            newErrors[`itinerary[${index}].title` as keyof Tour] = `Day ${index + 1} requires a title`;
          }
          if (!day.description || !day.description.trim()) {
            newErrors[`itinerary[${index}].description` as keyof Tour] = `Day ${index + 1} requires a description`;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form navigation
  const goToNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault(); // Prevent potential default form submission

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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Make sure required fields are defined
      if (!tour.title || !tour.description || tour.price === undefined || !tourId) {
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
      
      console.log('Updating tour with data:', tourWithDefaults);
      const result = await toursService.updateTour(tourId, tourWithDefaults);
      
      if (result) {
        toast.success('Tour updated successfully!');
        navigate('/admin/tours');
      } else {
        throw new Error('Failed to update tour');
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update tour state
  const handleTourChange = (updateData: Partial<Tour>) => {
    setTour(prev => ({
      ...prev,
      ...updateData
    }));
  };

  // Create a proper setState-compatible function for InclusionsStep
  const setTourState: React.Dispatch<React.SetStateAction<Partial<Tour>>> = (value) => {
    if (typeof value === 'function') {
      // If it's a function, call it with the previous state
      setTour(prevState => {
        const newState = (value as ((prevState: Partial<Tour>) => Partial<Tour>))(prevState);
        return newState;
      });
    } else {
      // If it's a direct value, use it
      setTour(value);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep
            formValues={tour}
            onChange={handleTourChange}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'images':
        return (
          <ImagesStep
            formValues={tour}
            onChange={handleTourChange}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'itinerary':
        return (
          <ItineraryStep
            formValues={tour}
            onChange={handleTourChange}
            errors={errors}
            onValidation={() => {}}
          />
        );
      case 'inclusions':
        return (
          <InclusionsStep
            tour={tour}
            setTour={setTourState}
            errors={errors}
            isLoading={isSubmitting}
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
              <div className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Tour Not Found
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The tour you are trying to edit could not be found.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/tours')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tours
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back to tours button */}
        <button 
          onClick={() => navigate('/admin/tours')}
          className="flex items-center text-gray-600 mb-6 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to tours</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Step Progress Indicator */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Tour: {tour.title}</h1>
              <div className="text-sm font-medium text-brand-600">Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}</div>
            </div>
            
            <div className="overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {steps.map((step, index) => {
                    const isCurrent = step.id === currentStep;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                    
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => {
                          const currentIndex = steps.findIndex(s => s.id === currentStep);
                          // Only allow going backwards or to the current step
                          if (index <= currentIndex) {
                            setCurrentStep(step.id);
                          }
                        }}
                        className={`
                          pb-4 font-medium text-sm flex items-center space-x-2 border-b-2 
                          ${isCurrent 
                            ? 'border-brand-500 text-brand-600' 
                            : isCompleted 
                              ? 'border-green-500 text-green-600 hover:text-green-700' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <span className={`
                          flex items-center justify-center w-6 h-6 rounded-full text-xs
                          ${isCurrent 
                            ? 'bg-brand-100 text-brand-600' 
                            : isCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-500'
                          }
                        `}>
                          {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                        </span>
                        <span>{step.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="space-y-6">
            {renderStepContent()}
          </div>
          
          {/* Save Button for all steps */}
          <div className="mt-8 bg-gray-50 -mx-6 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
              >
                <div className="flex items-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Progress
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={goToPreviousStep}
              className={`
                px-4 py-2 text-sm font-medium rounded-md
                ${currentStep === steps[0].id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}
              `}
              disabled={currentStep === steps[0].id}
            >
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </div>
            </button>
            
            {currentStep === steps[steps.length - 1].id ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-brand-600 rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70"
              >
                <div className="flex items-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Tour
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-2 text-sm font-medium text-white bg-brand-600 rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                <div className="flex items-center">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditTour;